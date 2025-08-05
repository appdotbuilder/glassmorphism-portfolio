
import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Contact submission record schema
export const contactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  ip_address: z.string().nullable(),
  created_at: z.coerce.date(),
  status: z.enum(['pending', 'processed', 'spam']).default('pending')
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Portfolio project schema
export const portfolioProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['photography', 'uiux']),
  hero_image_url: z.string(),
  gallery_images: z.array(z.string()),
  tools_used: z.array(z.string()),
  role: z.string().nullable(),
  problem: z.string().nullable(),
  solution: z.string().nullable(),
  prototype_url: z.string().nullable(),
  featured: z.boolean().default(false),
  sort_order: z.number().default(0),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;

// Create project input schema
export const createProjectInputSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  type: z.enum(['photography', 'uiux']),
  hero_image_url: z.string().url(),
  gallery_images: z.array(z.string().url()).default([]),
  tools_used: z.array(z.string()).default([]),
  role: z.string().nullable().optional(),
  problem: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  prototype_url: z.string().url().nullable().optional(),
  featured: z.boolean().default(false),
  sort_order: z.number().default(0)
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

// Update project input schema
export const updateProjectInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(2000).optional(),
  type: z.enum(['photography', 'uiux']).optional(),
  hero_image_url: z.string().url().optional(),
  gallery_images: z.array(z.string().url()).optional(),
  tools_used: z.array(z.string()).optional(),
  role: z.string().nullable().optional(),
  problem: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  prototype_url: z.string().url().nullable().optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Testimonial schema
export const testimonialSchema = z.object({
  id: z.number(),
  client_name: z.string(),
  client_company: z.string().nullable(),
  client_avatar_url: z.string().nullable(),
  quote: z.string(),
  rating: z.number().int().min(1).max(5),
  project_type: z.enum(['photography', 'uiux']).nullable(),
  featured: z.boolean().default(false),
  sort_order: z.number().default(0),
  created_at: z.coerce.date()
});

export type Testimonial = z.infer<typeof testimonialSchema>;

// Create testimonial input schema
export const createTestimonialInputSchema = z.object({
  client_name: z.string().min(1).max(100),
  client_company: z.string().max(100).nullable().optional(),
  client_avatar_url: z.string().url().nullable().optional(),
  quote: z.string().min(10).max(500),
  rating: z.number().int().min(1).max(5),
  project_type: z.enum(['photography', 'uiux']).nullable().optional(),
  featured: z.boolean().default(false),
  sort_order: z.number().default(0)
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialInputSchema>;

// Rate limiting check schema
export const rateLimitCheckSchema = z.object({
  ip_address: z.string(),
  endpoint: z.string().default('/api/contact'),
  window_minutes: z.number().default(5),
  max_requests: z.number().default(5)
});

export type RateLimitCheck = z.infer<typeof rateLimitCheckSchema>;

// Contact form response schema
export const contactFormResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional()
});

export type ContactFormResponse = z.infer<typeof contactFormResponseSchema>;
