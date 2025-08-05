
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { getPortfolioProjects } from '../handlers/get_portfolio_projects';
import type { CreateProjectInput } from '../schema';

// Test data
const photographyProject: CreateProjectInput = {
  title: 'Wedding Photography',
  description: 'Beautiful wedding photography session',
  type: 'photography',
  hero_image_url: 'https://example.com/wedding1.jpg',
  gallery_images: ['https://example.com/wedding2.jpg', 'https://example.com/wedding3.jpg'],
  tools_used: ['Canon 5D', 'Lightroom'],
  featured: true,
  sort_order: 1
};

const uiuxProject: CreateProjectInput = {
  title: 'E-commerce App',
  description: 'Mobile app redesign for better user experience',
  type: 'uiux',
  hero_image_url: 'https://example.com/app1.jpg',
  gallery_images: ['https://example.com/app2.jpg'],
  tools_used: ['Figma', 'Sketch'],
  role: 'Lead Designer',
  problem: 'Poor conversion rates',
  solution: 'Simplified checkout process',
  prototype_url: 'https://figma.com/prototype123',
  featured: false,
  sort_order: 2
};

const featuredUiuxProject: CreateProjectInput = {
  title: 'Banking Dashboard',
  description: 'Admin dashboard for banking application',
  type: 'uiux',
  hero_image_url: 'https://example.com/dashboard1.jpg',
  gallery_images: [],
  tools_used: ['Figma', 'Adobe XD'],
  role: 'UX Designer',
  problem: 'Complex navigation',
  solution: 'Streamlined interface',
  featured: true,
  sort_order: 0
};

describe('getPortfolioProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all projects when no filters are applied', async () => {
    // Create test projects
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      },
      {
        ...uiuxProject,
        gallery_images: uiuxProject.gallery_images,
        tools_used: uiuxProject.tools_used
      }
    ]).execute();

    const result = await getPortfolioProjects();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Wedding Photography');
    expect(result[1].title).toEqual('E-commerce App');
  });

  it('should filter projects by type', async () => {
    // Create test projects
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      },
      {
        ...uiuxProject,
        gallery_images: uiuxProject.gallery_images,
        tools_used: uiuxProject.tools_used
      }
    ]).execute();

    const photographyResults = await getPortfolioProjects('photography');
    expect(photographyResults).toHaveLength(1);
    expect(photographyResults[0].type).toEqual('photography');
    expect(photographyResults[0].title).toEqual('Wedding Photography');

    const uiuxResults = await getPortfolioProjects('uiux');
    expect(uiuxResults).toHaveLength(1);
    expect(uiuxResults[0].type).toEqual('uiux');
    expect(uiuxResults[0].title).toEqual('E-commerce App');
  });

  it('should filter projects by featured status', async () => {
    // Create test projects
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      },
      {
        ...uiuxProject,
        gallery_images: uiuxProject.gallery_images,
        tools_used: uiuxProject.tools_used
      }
    ]).execute();

    const featuredResults = await getPortfolioProjects(undefined, true);
    expect(featuredResults).toHaveLength(1);
    expect(featuredResults[0].featured).toBe(true);
    expect(featuredResults[0].title).toEqual('Wedding Photography');
  });

  it('should apply both type and featured filters', async () => {
    // Create test projects
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      },
      {
        ...uiuxProject,
        gallery_images: uiuxProject.gallery_images,
        tools_used: uiuxProject.tools_used
      },
      {
        ...featuredUiuxProject,
        gallery_images: featuredUiuxProject.gallery_images,
        tools_used: featuredUiuxProject.tools_used
      }
    ]).execute();

    const results = await getPortfolioProjects('uiux', true);
    expect(results).toHaveLength(1);
    expect(results[0].type).toEqual('uiux');
    expect(results[0].featured).toBe(true);
    expect(results[0].title).toEqual('Banking Dashboard');
  });

  it('should return projects ordered by sort_order then created_at', async () => {
    // Create projects with different sort orders
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        sort_order: 2,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      },
      {
        ...featuredUiuxProject,
        sort_order: 0,
        gallery_images: featuredUiuxProject.gallery_images,
        tools_used: featuredUiuxProject.tools_used
      },
      {
        ...uiuxProject,
        sort_order: 1,
        gallery_images: uiuxProject.gallery_images,
        tools_used: uiuxProject.tools_used
      }
    ]).execute();

    const results = await getPortfolioProjects();

    expect(results).toHaveLength(3);
    expect(results[0].sort_order).toEqual(0);
    expect(results[0].title).toEqual('Banking Dashboard');
    expect(results[1].sort_order).toEqual(1);
    expect(results[1].title).toEqual('E-commerce App');
    expect(results[2].sort_order).toEqual(2);
    expect(results[2].title).toEqual('Wedding Photography');
  });

  it('should return empty array when no projects match filters', async () => {
    // Create only photography projects
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      }
    ]).execute();

    const results = await getPortfolioProjects('uiux', true);
    expect(results).toHaveLength(0);
  });

  it('should return projects with correct data structure', async () => {
    await db.insert(portfolioProjectsTable).values([
      {
        ...photographyProject,
        gallery_images: photographyProject.gallery_images,
        tools_used: photographyProject.tools_used
      }
    ]).execute();

    const results = await getPortfolioProjects();
    const project = results[0];

    expect(project.id).toBeDefined();
    expect(project.title).toEqual('Wedding Photography');
    expect(project.description).toEqual('Beautiful wedding photography session');
    expect(project.type).toEqual('photography');
    expect(project.hero_image_url).toEqual('https://example.com/wedding1.jpg');
    expect(project.gallery_images).toEqual(['https://example.com/wedding2.jpg', 'https://example.com/wedding3.jpg']);
    expect(project.tools_used).toEqual(['Canon 5D', 'Lightroom']);
    expect(project.featured).toBe(true);
    expect(project.sort_order).toEqual(1);
    expect(project.created_at).toBeInstanceOf(Date);
    expect(project.updated_at).toBeInstanceOf(Date);
  });

  it('should handle empty gallery_images and tools_used arrays', async () => {
    await db.insert(portfolioProjectsTable).values([
      {
        ...featuredUiuxProject,
        gallery_images: featuredUiuxProject.gallery_images,
        tools_used: featuredUiuxProject.tools_used
      }
    ]).execute();

    const results = await getPortfolioProjects();
    const project = results[0];

    expect(project.gallery_images).toEqual([]);
    expect(project.tools_used).toEqual(['Figma', 'Adobe XD']);
    expect(Array.isArray(project.gallery_images)).toBe(true);
    expect(Array.isArray(project.tools_used)).toBe(true);
  });
});
