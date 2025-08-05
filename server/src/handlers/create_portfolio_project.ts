
import { type CreateProjectInput, type PortfolioProject } from '../schema';
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';

export async function createPortfolioProject(input: CreateProjectInput): Promise<PortfolioProject> {
  try {
    const [project] = await db
      .insert(portfolioProjectsTable)
      .values({
        title: input.title,
        description: input.description,
        type: input.type,
        hero_image_url: input.hero_image_url,
        gallery_images: input.gallery_images,
        tools_used: input.tools_used,
        role: input.role || null,
        problem: input.problem || null,
        solution: input.solution || null,
        prototype_url: input.prototype_url || null,
        featured: input.featured,
        sort_order: input.sort_order
      })
      .returning();

    // Convert database types to schema types
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      type: project.type,
      hero_image_url: project.hero_image_url,
      gallery_images: project.gallery_images as string[],
      tools_used: project.tools_used as string[],
      role: project.role,
      problem: project.problem,
      solution: project.solution,
      prototype_url: project.prototype_url,
      featured: project.featured,
      sort_order: project.sort_order,
      created_at: project.created_at,
      updated_at: project.updated_at
    };

  } catch (error) {
    console.error('Error creating portfolio project:', error);
    throw error;
  }
}
