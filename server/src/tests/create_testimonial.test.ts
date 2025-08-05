
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput } from '../schema';
import { createTestimonial } from '../handlers/create_testimonial';
import { eq } from 'drizzle-orm';

// Complete test input with all fields
const testInput: CreateTestimonialInput = {
  client_name: 'John Doe',
  client_company: 'Acme Corp',
  client_avatar_url: 'https://example.com/avatar.jpg',
  quote: 'Amazing work, exceeded all expectations and delivered on time.',
  rating: 5,
  project_type: 'uiux',
  featured: true,
  sort_order: 1
};

describe('createTestimonial', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a testimonial with all fields', async () => {
    const result = await createTestimonial(testInput);

    // Validate all fields
    expect(result.client_name).toEqual('John Doe');
    expect(result.client_company).toEqual('Acme Corp');
    expect(result.client_avatar_url).toEqual('https://example.com/avatar.jpg');
    expect(result.quote).toEqual('Amazing work, exceeded all expectations and delivered on time.');
    expect(result.rating).toEqual(5);
    expect(result.project_type).toEqual('uiux');
    expect(result.featured).toEqual(true);
    expect(result.sort_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save testimonial to database', async () => {
    const result = await createTestimonial(testInput);

    const testimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, result.id))
      .execute();

    expect(testimonials).toHaveLength(1);
    expect(testimonials[0].client_name).toEqual('John Doe');
    expect(testimonials[0].quote).toEqual(testInput.quote);
    expect(testimonials[0].rating).toEqual(5);
    expect(testimonials[0].project_type).toEqual('uiux');
    expect(testimonials[0].featured).toEqual(true);
    expect(testimonials[0].created_at).toBeInstanceOf(Date);
  });

  it('should create testimonial with nullable fields as null', async () => {
    const minimalInput: CreateTestimonialInput = {
      client_name: 'Jane Smith',
      quote: 'Great photographer, captured perfect moments for our wedding.',
      rating: 4,
      featured: false,
      sort_order: 0
    };

    const result = await createTestimonial(minimalInput);

    expect(result.client_name).toEqual('Jane Smith');
    expect(result.client_company).toBeNull();
    expect(result.client_avatar_url).toBeNull();
    expect(result.project_type).toBeNull();
    expect(result.quote).toEqual('Great photographer, captured perfect moments for our wedding.');
    expect(result.rating).toEqual(4);
    expect(result.featured).toEqual(false);
    expect(result.sort_order).toEqual(0);
  });

  it('should create photography testimonial', async () => {
    const photographyInput: CreateTestimonialInput = {
      client_name: 'Sarah Wilson',
      client_company: 'Wedding Bells',
      quote: 'Beautiful wedding photos that we will treasure forever.',
      rating: 5,
      project_type: 'photography',
      featured: true,
      sort_order: 2
    };

    const result = await createTestimonial(photographyInput);

    expect(result.project_type).toEqual('photography');
    expect(result.client_name).toEqual('Sarah Wilson');
    expect(result.rating).toEqual(5);
    expect(result.featured).toEqual(true);
  });

  it('should handle different rating values', async () => {
    const ratingTests = [1, 2, 3, 4, 5];

    for (const rating of ratingTests) {
      const input: CreateTestimonialInput = {
        client_name: `Client ${rating}`,
        quote: `This is a ${rating} star review with enough characters.`,
        rating: rating,
        featured: false,
        sort_order: 0
      };

      const result = await createTestimonial(input);
      expect(result.rating).toEqual(rating);
    }
  });
});
