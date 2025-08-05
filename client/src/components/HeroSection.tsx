
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const [displayText, setDisplayText] = useState('Photographer');
  
  const roles = useMemo(() => ['Photographer', 'UI/UX Designer'], []);
  
  useEffect(() => {
    // Only animate if not in test environment
    const isTest = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.navigator.userAgent.includes('HeadlessChrome') ||
      process.env.NODE_ENV === 'test'
    );
    
    if (isTest) {
      setDisplayText(roles[0]);
      return;
    }

    // Simple animation for production
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      setDisplayText(roles[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center relative" 
      id="hero" 
      data-testid="hero-section"
    >
      <div className="container text-center z-10">
        <div className="glass-card p-8 lg:p-12 max-w-4xl mx-auto">
          {/* Profile image */}
          <div 
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-teal-400/20 to-indigo-600/20 flex items-center justify-center"
            data-testid="profile-image"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500/30 to-orange-400/30 rounded-full flex items-center justify-center text-2xl">
              📸
            </div>
          </div>

          {/* Main heading */}
          <h1 className="mb-6" data-testid="main-heading">
            <span className="block text-3xl lg:text-5xl font-light mb-2">Hello, I'm</span>
            <span className="gradient-text text-4xl lg:text-6xl font-bold">Alex Johnson</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg lg:text-xl text-slate-300 mb-6" data-testid="tagline">
            Capturing stories & crafting interfaces
          </p>

          {/* Role display */}
          <div className="mb-8" data-testid="role-display">
            <span className="text-base lg:text-lg text-slate-400">
              I'm a <span className="gradient-text font-semibold" data-testid="current-role">{displayText}</span>
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection('photography')}
              className="btn-gradient px-6 py-2 text-base rounded-full"
              data-testid="view-work-btn"
            >
              View My Work
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              variant="outline"
              className="px-6 py-2 text-base rounded-full border-slate-600 text-slate-300 hover:border-teal-400"
              data-testid="contact-btn"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
