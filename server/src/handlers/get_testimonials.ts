
import { type Testimonial } from '../schema';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { desc, eq, asc } from 'drizzle-orm';

export async function getTestimonials(featuredOnly?: boolean): Promise<Testimonial[]> {
  try {
    const baseQuery = db.select().from(testimonialsTable);
    
    const testimonials = featuredOnly
      ? await baseQuery
          .where(eq(testimonialsTable.featured, true))
          .orderBy(
            asc(testimonialsTable.sort_order),
            desc(testimonialsTable.created_at)
          )
          .execute()
      : await baseQuery
          .orderBy(
            asc(testimonialsTable.sort_order),
            desc(testimonialsTable.created_at)
          )
          .execute();

    return testimonials;

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}
