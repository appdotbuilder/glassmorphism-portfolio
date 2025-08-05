
import { type PortfolioProject } from '../schema';
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { desc, eq, and, asc } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

export async function getPortfolioProjects(type?: 'photography' | 'uiux', featuredOnly?: boolean): Promise<PortfolioProject[]> {
  try {
    // Build conditions array
    const conditions: SQL<unknown>[] = [];
    
    if (type) {
      conditions.push(eq(portfolioProjectsTable.type, type));
    }
    
    if (featuredOnly) {
      conditions.push(eq(portfolioProjectsTable.featured, true));
    }

    // Start with base query
    const baseQuery = db.select().from(portfolioProjectsTable);

    // Apply conditions and ordering in a single query chain
    const query = conditions.length > 0
      ? baseQuery
          .where(conditions.length === 1 ? conditions[0] : and(...conditions))
          .orderBy(asc(portfolioProjectsTable.sort_order), desc(portfolioProjectsTable.created_at))
      : baseQuery
          .orderBy(asc(portfolioProjectsTable.sort_order), desc(portfolioProjectsTable.created_at));

    const projects = await query.execute();

    // Convert JSONB fields to proper types
    return projects.map(project => ({
      ...project,
      gallery_images: Array.isArray(project.gallery_images) ? project.gallery_images as string[] : [],
      tools_used: Array.isArray(project.tools_used) ? project.tools_used as string[] : []
    }));

  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    throw error;
  }
}
