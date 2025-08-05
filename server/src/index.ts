
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  contactFormSchema, 
  createProjectInputSchema, 
  updateProjectInputSchema,
  createTestimonialInputSchema
} from './schema';

// Import handlers
import { submitContact } from './handlers/submit_contact';
import { getPortfolioProjects } from './handlers/get_portfolio_projects';
import { createPortfolioProject } from './handlers/create_portfolio_project';
import { getTestimonials } from './handlers/get_testimonials';
import { createTestimonial } from './handlers/create_testimonial';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Contact form submission
  submitContact: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input, ctx }) => {
      // Extract IP address from context (would be set up in createContext)
      const ipAddress = (ctx as any)?.req?.ip || 'unknown';
      return submitContact(input, ipAddress);
    }),

  // Portfolio projects endpoints
  getPortfolioProjects: publicProcedure
    .input(z.object({
      type: z.enum(['photography', 'uiux']).optional(),
      featuredOnly: z.boolean().optional()
    }).optional())
    .query(({ input }) => {
      return getPortfolioProjects(input?.type, input?.featuredOnly);
    }),

  createPortfolioProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createPortfolioProject(input)),

  // Testimonials endpoints
  getTestimonials: publicProcedure
    .input(z.object({
      featuredOnly: z.boolean().optional()
    }).optional())
    .query(({ input }) => {
      return getTestimonials(input?.featuredOnly);
    }),

  createTestimonial: publicProcedure
    .input(createTestimonialInputSchema)
    .mutation(({ input }) => createTestimonial(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: cors({
      origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
      credentials: true
    }),
    router: appRouter,
    createContext({ req, res }) {
      return { req, res };
    },
  });
  
  server.listen(port);
  console.log(`🚀 Portfolio API server listening at port: ${port}`);
  console.log(`📸 Ready to handle contact forms and portfolio data`);
}

start();
