
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput } from '../schema';
import { getTestimonials } from '../handlers/get_testimonials';

// Test testimonial data
const testTestimonial1: CreateTestimonialInput = {
  client_name: 'John Doe',
  client_company: 'Tech Corp',
  client_avatar_url: 'https://example.com/avatar1.jpg',
  quote: 'Excellent work on our photography project!',
  rating: 5,
  project_type: 'photography',
  featured: true,
  sort_order: 1
};

const testTestimonial2: CreateTestimonialInput = {
  client_name: 'Jane Smith',
  client_company: 'Design Studio',
  client_avatar_url: 'https://example.com/avatar2.jpg',
  quote: 'Amazing UI/UX design that exceeded our expectations.',
  rating: 4,
  project_type: 'uiux',
  featured: false,
  sort_order: 2
};

const testTestimonial3: CreateTestimonialInput = {
  client_name: 'Bob Johnson',
  client_company: null,
  client_avatar_url: null,
  quote: 'Great work overall, would definitely recommend!',
  rating: 5,
  project_type: null,
  featured: true,
  sort_order: 0
};

describe('getTestimonials', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no testimonials exist', async () => {
    const result = await getTestimonials();
    expect(result).toEqual([]);
  });

  it('should return all testimonials when no filter applied', async () => {
    // Create test testimonials
    await db.insert(testimonialsTable).values([
      testTestimonial1,
      testTestimonial2,
      testTestimonial3
    ]).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(3);
    expect(result.map(t => t.client_name)).toContain('John Doe');
    expect(result.map(t => t.client_name)).toContain('Jane Smith');
    expect(result.map(t => t.client_name)).toContain('Bob Johnson');
  });

  it('should return only featured testimonials when featuredOnly is true', async () => {
    // Create test testimonials
    await db.insert(testimonialsTable).values([
      testTestimonial1, // featured: true
      testTestimonial2, // featured: false
      testTestimonial3  // featured: true
    ]).execute();

    const result = await getTestimonials(true);

    expect(result).toHaveLength(2);
    expect(result.every(t => t.featured)).toBe(true);
    expect(result.map(t => t.client_name)).toContain('John Doe');
    expect(result.map(t => t.client_name)).toContain('Bob Johnson');
    expect(result.map(t => t.client_name)).not.toContain('Jane Smith');
  });

  it('should return testimonials sorted by sort_order ascending then created_at descending', async () => {
    // Create testimonials with different sort orders
    await db.insert(testimonialsTable).values([
      { ...testTestimonial1, sort_order: 3 },
      { ...testTestimonial2, sort_order: 1 },
      { ...testTestimonial3, sort_order: 2 }
    ]).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(3);
    // Should be sorted by sort_order ascending
    expect(result[0].sort_order).toBe(1);
    expect(result[1].sort_order).toBe(2);
    expect(result[2].sort_order).toBe(3);
    expect(result[0].client_name).toBe('Jane Smith');
    expect(result[1].client_name).toBe('Bob Johnson');
    expect(result[2].client_name).toBe('John Doe');
  });

  it('should handle testimonials with null values correctly', async () => {
    await db.insert(testimonialsTable).values([testTestimonial3]).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(1);
    expect(result[0].client_name).toBe('Bob Johnson');
    expect(result[0].client_company).toBeNull();
    expect(result[0].client_avatar_url).toBeNull();
    expect(result[0].project_type).toBeNull();
    expect(result[0].rating).toBe(5);
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should return all testimonials when featuredOnly is false', async () => {
    await db.insert(testimonialsTable).values([
      testTestimonial1, // featured: true
      testTestimonial2  // featured: false
    ]).execute();

    const result = await getTestimonials(false);

    expect(result).toHaveLength(2);
    expect(result.map(t => t.client_name)).toContain('John Doe');
    expect(result.map(t => t.client_name)).toContain('Jane Smith');
  });
});
