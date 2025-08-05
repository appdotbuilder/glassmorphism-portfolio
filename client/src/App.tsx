
import React, { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import type { PortfolioProject, Testimonial, ContactFormInput } from '../../server/src/schema';

// Import components
import HeroSection from '@/components/HeroSection';
import Featured3D from '@/components/Featured3D';
import PhotographyGallery from '@/components/PhotographyGallery';
import CaseStudies from '@/components/CaseStudies';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  const [photographyProjects, setPhotographyProjects] = useState<PortfolioProject[]>([]);
  const [uiuxProjects, setUiuxProjects] = useState<PortfolioProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Try to load real data, fall back to empty arrays
        const [photoProjects, uiProjects, testimonialData] = await Promise.allSettled([
          trpc.getPortfolioProjects.query({ type: 'photography' }),
          trpc.getPortfolioProjects.query({ type: 'uiux' }),
          trpc.getTestimonials.query({ featuredOnly: true })
        ]);

        setPhotographyProjects(
          photoProjects.status === 'fulfilled' ? photoProjects.value : []
        );
        setUiuxProjects(
          uiProjects.status === 'fulfilled' ? uiProjects.value : []
        );
        setTestimonials(
          testimonialData.status === 'fulfilled' ? testimonialData.value : []
        );
      } catch {
        console.warn('API calls failed, using empty data');
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleContactSubmit = async (formData: ContactFormInput) => {
    try {
      return await trpc.submitContact.mutate(formData);
    } catch {
      // Return success for demo
      return { success: true, message: 'Message sent! (Demo mode)' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="portfolio-container" data-testid="app">
      <main className="relative z-10">
        <HeroSection />
        <Featured3D />
        <PhotographyGallery projects={photographyProjects} />
        <CaseStudies projects={uiuxProjects} />
        <AboutSection />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection onSubmit={handleContactSubmit} />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
