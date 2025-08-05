
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '../../../server/src/schema';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Placeholder testimonials for demo since testimonials array is empty from stub
  const placeholderTestimonials = [
    {
      id: 1,
      client_name: 'Sarah Johnson',
      client_company: 'Tech Startup Inc.',
      client_avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b151faa4?w=150&h=150&fit=crop&crop=face',
      quote: 'Alex delivered exceptional work on our app redesign. The user experience improvements led to a 40% increase in user engagement. Highly professional and creative!',
      rating: 5,
      project_type: 'uiux' as const,
      featured: true,
      sort_order: 1,
      created_at: new Date('2023-10-15')
    },
    {
      id: 2,
      client_name: 'Michael Chen',
      client_company: 'Chen Photography Studio',
      client_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      quote: 'The wedding photos Alex captured were absolutely stunning. Every moment was perfectly framed, and the editing style was exactly what we envisioned. Pure artistry!',
      rating: 5,
      project_type: 'photography' as const,
      featured: true,
      sort_order: 2,
      created_at: new Date('2023-09-20')
    },
    {
      id: 3,
      client_name: 'Emma Rodriguez',
      client_company: 'Design Agency Co.',
      client_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      quote: 'Working with Alex on our dashboard redesign was a game-changer. The new interface is intuitive and beautiful. Our clients love the improved user experience.',
      rating: 5,
      project_type: 'uiux' as const,
      featured: true,
      sort_order: 3,
      created_at: new Date('2023-11-05')
    },
    {
      id: 4,
      client_name: 'David Thompson',
      client_company: 'Thompson Events',
      client_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      quote: 'Alex covered our corporate event and the photos exceeded all expectations. Professional, creative, and captured the energy perfectly. Would definitely hire again!',
      rating: 5,
      project_type: 'photography' as const,
      featured: true,
      sort_order: 4,
      created_at: new Date('2023-08-12')
    }
  ];

  // Use placeholder data since backend returns empty array (stub implementation)
  const displayTestimonials = testimonials.length > 0 ? testimonials : placeholderTestimonials;

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && displayTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, displayTestimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayTestimonials.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayTestimonials.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (displayTestimonials.length === 0) {
    return null;
  }

  const currentTestimonial = displayTestimonials[currentIndex];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="section-padding bg-black/20" id="testimonials">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="mb-6">What Clients Say</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Hear from the amazing people I've had the pleasure to work with.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial card */}
          <div className="glass-panel p-8 lg:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full translate-x-16 translate-y-16"></div>

            {/* Quote icon */}
            <div className="text-4xl lg:text-6xl text-slate-600 mb-6">"</div>

            {/* Testimonial content */}
            <div className="relative z-10">
              <blockquote className="text-lg lg:text-xl text-slate-200 leading-relaxed mb-8 italic">
                {currentTestimonial.quote}
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center mb-6 gap-1">
                {renderStars(currentTestimonial.rating)}
              </div>

              {/* Client info */}
              <div className="flex items-center justify-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-white/20">
                  <AvatarImage 
                    src={currentTestimonial.client_avatar_url || undefined} 
                    alt={currentTestimonial.client_name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-teal-400/20 to-indigo-600/20 text-white">
                    {currentTestimonial.client_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-left">
                  <div className="font-semibold text-white text-lg">
                    {currentTestimonial.client_name}
                  </div>
                  {currentTestimonial.client_company && (
                    <div className="text-slate-400 text-sm">
                      {currentTestimonial.client_company}
                    </div>
                  )}
                  {currentTestimonial.project_type && (
                    <div className="text-xs text-slate-500 capitalize mt-1">
                      {currentTestimonial.project_type === 'uiux' ? 'UI/UX Project' : 'Photography Project'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {displayTestimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
                onClick={goToPrevious}
              >
                ←
              </Button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-gradient-to-r from-teal-400 to-indigo-600 scale-125'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next button */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
                onClick={goToNext}
              >
                →
              </Button>
            </div>
          )}

          {/* Auto-play indicator */}
          {isAutoPlaying && displayTestimonials.length > 1 && (
            <div className="text-center mt-4">
              <p className="text-xs text-slate-500">Auto-playing • Click dots to pause</p>
            </div>
          )}

          {/* Notice about stub data */}
          {testimonials.length === 0 && (
            <div className="text-center mt-12">
              <div className="glass-card p-6 max-w-md mx-auto">
                <p className="text-slate-400 text-sm mb-2">💬 Demo Content</p>
                <p className="text-slate-300">
                  These testimonials show placeholder content. Connect to your backend to display real client feedback.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
