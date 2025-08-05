
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { portfolioProjectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createPortfolioProject } from '../handlers/create_portfolio_project';
import { eq } from 'drizzle-orm';

// Test input for photography project
const photographyInput: CreateProjectInput = {
  title: 'Sunset Portfolio',
  description: 'A beautiful collection of sunset photographs',
  type: 'photography',
  hero_image_url: 'https://example.com/hero.jpg',
  gallery_images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  tools_used: ['Canon EOS R5', 'Lightroom', 'Photoshop'],
  role: null,
  problem: null,
  solution: null,
  prototype_url: null,
  featured: true,
  sort_order: 10
};

// Test input for UI/UX project
const uiuxInput: CreateProjectInput = {
  title: 'E-commerce Redesign',
  description: 'Complete redesign of an e-commerce platform',
  type: 'uiux',
  hero_image_url: 'https://example.com/hero-uiux.jpg',
  gallery_images: ['https://example.com/mockup1.jpg', 'https://example.com/mockup2.jpg'],
  tools_used: ['Figma', 'Adobe XD', 'Sketch'],
  role: 'Lead UX Designer',
  problem: 'Poor user experience and low conversion rates',
  solution: 'Redesigned user flow and improved checkout process',
  prototype_url: 'https://figma.com/prototype/123',
  featured: false,
  sort_order: 5
};

describe('createPortfolioProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a photography project', async () => {
    const result = await createPortfolioProject(photographyInput);

    // Basic field validation
    expect(result.title).toEqual('Sunset Portfolio');
    expect(result.description).toEqual(photographyInput.description);
    expect(result.type).toEqual('photography');
    expect(result.hero_image_url).toEqual('https://example.com/hero.jpg');
    expect(result.gallery_images).toEqual(['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
    expect(result.tools_used).toEqual(['Canon EOS R5', 'Lightroom', 'Photoshop']);
    expect(result.role).toBeNull();
    expect(result.problem).toBeNull();
    expect(result.solution).toBeNull();
    expect(result.prototype_url).toBeNull();
    expect(result.featured).toBe(true);
    expect(result.sort_order).toEqual(10);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a UI/UX project', async () => {
    const result = await createPortfolioProject(uiuxInput);

    // Basic field validation
    expect(result.title).toEqual('E-commerce Redesign');
    expect(result.description).toEqual(uiuxInput.description);
    expect(result.type).toEqual('uiux');
    expect(result.hero_image_url).toEqual('https://example.com/hero-uiux.jpg');
    expect(result.gallery_images).toEqual(['https://example.com/mockup1.jpg', 'https://example.com/mockup2.jpg']);
    expect(result.tools_used).toEqual(['Figma', 'Adobe XD', 'Sketch']);
    expect(result.role).toEqual('Lead UX Designer');
    expect(result.problem).toEqual('Poor user experience and low conversion rates');
    expect(result.solution).toEqual('Redesigned user flow and improved checkout process');
    expect(result.prototype_url).toEqual('https://figma.com/prototype/123');
    expect(result.featured).toBe(false);
    expect(result.sort_order).toEqual(5);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save project to database', async () => {
    const result = await createPortfolioProject(photographyInput);

    // Query using proper drizzle syntax
    const projects = await db.select()
      .from(portfolioProjectsTable)
      .where(eq(portfolioProjectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Sunset Portfolio');
    expect(projects[0].description).toEqual(photographyInput.description);
    expect(projects[0].type).toEqual('photography');
    expect(projects[0].hero_image_url).toEqual('https://example.com/hero.jpg');
    expect(projects[0].gallery_images).toEqual(['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
    expect(projects[0].tools_used).toEqual(['Canon EOS R5', 'Lightroom', 'Photoshop']);
    expect(projects[0].featured).toBe(true);
    expect(projects[0].sort_order).toEqual(10);
    expect(projects[0].created_at).toBeInstanceOf(Date);
    expect(projects[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle empty arrays as defaults', async () => {
    const minimalInput: CreateProjectInput = {
      title: 'Minimal Project',
      description: 'A minimal project for testing',
      type: 'photography',
      hero_image_url: 'https://example.com/minimal.jpg',
      gallery_images: [],
      tools_used: [],
      featured: false,
      sort_order: 0
    };

    const result = await createPortfolioProject(minimalInput);

    expect(result.gallery_images).toEqual([]);
    expect(result.tools_used).toEqual([]);
    expect(result.role).toBeNull();
    expect(result.problem).toBeNull();
    expect(result.solution).toBeNull();
    expect(result.prototype_url).toBeNull();
    expect(result.featured).toBe(false);
    expect(result.sort_order).toEqual(0);
  });
});
