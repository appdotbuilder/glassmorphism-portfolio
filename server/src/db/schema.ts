
import { serial, text, pgTable, timestamp, boolean, integer, jsonb, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const projectTypeEnum = pgEnum('project_type', ['photography', 'uiux']);
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'processed', 'spam']);

// Contact submissions table
export const contactSubmissionsTable = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  ip_address: varchar('ip_address', { length: 45 }), // IPv6 support
  status: submissionStatusEnum('status').default('pending').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Portfolio projects table
export const portfolioProjectsTable = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  type: projectTypeEnum('type').notNull(),
  hero_image_url: text('hero_image_url').notNull(),
  gallery_images: jsonb('gallery_images').default([]).notNull(), // Array of image URLs
  tools_used: jsonb('tools_used').default([]).notNull(), // Array of tool names
  role: text('role'), // Nullable for photography projects
  problem: text('problem'), // Nullable for photography projects
  solution: text('solution'), // Nullable for photography projects
  prototype_url: text('prototype_url'), // Nullable
  featured: boolean('featured').default(false).notNull(),
  sort_order: integer('sort_order').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Testimonials table
export const testimonialsTable = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  client_name: varchar('client_name', { length: 100 }).notNull(),
  client_company: varchar('client_company', { length: 100 }),
  client_avatar_url: text('client_avatar_url'),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  project_type: projectTypeEnum('project_type'), // Nullable - can be general testimonial
  featured: boolean('featured').default(false).notNull(),
  sort_order: integer('sort_order').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Rate limiting table for contact form
export const rateLimitsTable = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  ip_address: varchar('ip_address', { length: 45 }).notNull(),
  endpoint: varchar('endpoint', { length: 100 }).notNull(),
  request_count: integer('request_count').default(1).notNull(),
  window_start: timestamp('window_start').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// TypeScript types for database operations
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
export type NewContactSubmission = typeof contactSubmissionsTable.$inferInsert;

export type PortfolioProject = typeof portfolioProjectsTable.$inferSelect;
export type NewPortfolioProject = typeof portfolioProjectsTable.$inferInsert;

export type Testimonial = typeof testimonialsTable.$inferSelect;
export type NewTestimonial = typeof testimonialsTable.$inferInsert;

export type RateLimit = typeof rateLimitsTable.$inferSelect;
export type NewRateLimit = typeof rateLimitsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  contactSubmissions: contactSubmissionsTable,
  portfolioProjects: portfolioProjectsTable,
  testimonials: testimonialsTable,
  rateLimits: rateLimitsTable
};
