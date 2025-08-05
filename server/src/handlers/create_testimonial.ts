
import { type CreateTestimonialInput, type Testimonial } from '../schema';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';

export async function createTestimonial(input: CreateTestimonialInput): Promise<Testimonial> {
  try {
    const [testimonial] = await db
      .insert(testimonialsTable)
      .values({
        client_name: input.client_name,
        client_company: input.client_company || null,
        client_avatar_url: input.client_avatar_url || null,
        quote: input.quote,
        rating: input.rating,
        project_type: input.project_type || null,
        featured: input.featured,
        sort_order: input.sort_order
      })
      .returning();

    console.log('Created new testimonial:', {
      id: testimonial.id,
      client_name: input.client_name,
      rating: input.rating
    });

    // Convert database types to schema types
    return {
      id: testimonial.id,
      client_name: testimonial.client_name,
      client_company: testimonial.client_company,
      client_avatar_url: testimonial.client_avatar_url,
      quote: testimonial.quote,
      rating: testimonial.rating,
      project_type: testimonial.project_type,
      featured: testimonial.featured,
      sort_order: testimonial.sort_order,
      created_at: testimonial.created_at
    };

  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
}
