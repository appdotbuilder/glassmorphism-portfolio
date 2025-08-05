
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type ContactFormInput } from '../schema';
import { submitContact } from '../handlers/submit_contact';
import { eq } from 'drizzle-orm';

const testInput: ContactFormInput = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'This is a test message with enough characters to meet the minimum requirement.'
};

const testIpAddress = '192.168.1.1';

describe('submitContact', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully submit a contact form', async () => {
    const result = await submitContact(testInput, testIpAddress);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Message sent successfully!');
    expect(result.error).toBeUndefined();
  });

  it('should save contact submission to database', async () => {
    const result = await submitContact(testInput, testIpAddress);
    expect(result.success).toBe(true);

    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.email, testInput.email))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toBe('John Doe');
    expect(submissions[0].email).toBe('john@example.com');
    expect(submissions[0].message).toBe(testInput.message);
    expect(submissions[0].ip_address).toBe(testIpAddress);
    expect(submissions[0].status).toBe('pending');
    expect(submissions[0].created_at).toBeInstanceOf(Date);
  });

  it('should enforce rate limiting after 5 submissions', async () => {
    // Submit 5 contact forms from the same IP
    for (let i = 0; i < 5; i++) {
      const result = await submitContact({
        ...testInput,
        name: `Test User ${i + 1}`,
        email: `test${i + 1}@example.com`
      }, testIpAddress);
      expect(result.success).toBe(true);
    }

    // 6th submission should be rate limited
    const result = await submitContact({
      ...testInput,
      name: 'Rate Limited User',
      email: 'ratelimited@example.com'
    }, testIpAddress);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Too many requests. Please wait before submitting again.');
  });

  it('should allow submissions from different IP addresses', async () => {
    // Submit 5 times from first IP
    for (let i = 0; i < 5; i++) {
      const result = await submitContact({
        ...testInput,
        email: `test${i + 1}@example.com`
      }, testIpAddress);
      expect(result.success).toBe(true);
    }

    // Submission from different IP should still work
    const result = await submitContact({
      ...testInput,
      name: 'Different IP User',
      email: 'differentip@example.com'
    }, '192.168.1.2');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Message sent successfully!');
  });

  it('should count only recent submissions for rate limiting', async () => {
    // Create an old submission (more than 5 minutes ago)
    const oldTimestamp = new Date(Date.now() - 6 * 60 * 1000); // 6 minutes ago
    await db.insert(contactSubmissionsTable)
      .values({
        name: 'Old User',
        email: 'old@example.com',
        message: 'Old message',
        ip_address: testIpAddress,
        status: 'pending',
        created_at: oldTimestamp
      })
      .execute();

    // Should still be able to submit 5 new requests
    for (let i = 0; i < 5; i++) {
      const result = await submitContact({
        ...testInput,
        email: `recent${i + 1}@example.com`
      }, testIpAddress);
      expect(result.success).toBe(true);
    }

    // 6th recent submission should be rate limited
    const result = await submitContact({
      ...testInput,
      email: 'shouldfail@example.com'
    }, testIpAddress);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Too many requests. Please wait before submitting again.');
  });

  it('should handle database errors gracefully', async () => {
    // Test with an invalid IP address that might cause database issues
    const result = await submitContact(testInput, '');

    // The handler should still return a proper response structure
    expect(result).toHaveProperty('success');
    expect(typeof result.success).toBe('boolean');
    
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    }
  });
});
