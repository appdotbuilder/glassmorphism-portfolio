
import React from 'react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/alexjohnson',
      icon: '📷',
      hoverColor: 'hover:text-pink-400'
    },
    {
      name: 'Dribbble',
      url: 'https://dribbble.com/alexjohnson',
      icon: '🏀',
      hoverColor: 'hover:text-pink-400'
    },
    {
      name: 'Behance',
      url: 'https://behance.net/alexjohnson',
      icon: '🎨',
      hoverColor: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/alexjohnson',
      icon: '💼',
      hoverColor: 'hover:text-blue-400'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/alexjohnson',
      icon: '𝕏',
      hoverColor: 'hover:text-slate-300'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20">
      {/* Floating glass bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-card px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-slate-300 ${link.hoverColor} transition-all duration-300 hover:scale-110 hover:drop-shadow-lg text-xl`}
                  aria-label={link.name}
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20"></div>

            {/* Back to top button */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 text-white hover:bg-white/10 hover:border-teal-400 transition-all duration-300 px-3 py-1"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              ↑
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container pb-32">
        <div className="glass-panel p-12 text-center">
          {/* Logo/Name */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold gradient-text mb-2">Alex Johnson</h3>
            <p className="text-slate-400">Photographer & UI/UX Designer</p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <a href="#about" className="text-slate-300 hover:text-teal-400 transition-colors">
              About
            </a>
            <a href="#photography" className="text-slate-300 hover:text-teal-400 transition-colors">
              Photography
            </a>
            <a href="#case-studies" className="text-slate-300 hover:text-teal-400 transition-colors">
              UI/UX Work
            </a>
            <a href="#contact" className="text-slate-300 hover:text-teal-400 transition-colors">
              Contact
            </a>
            <a href="#testimonials" className="text-slate-300 hover:text-teal-400 transition-colors">
              Testimonials
            </a>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-sm">
            <a 
              href="mailto:hello@alexjohnson.com" 
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              hello@alexjohnson.com
            </a>
            <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></div>
            <a 
              href="tel:+1234567890" 
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              +1 (234) 567-8900
            </a>
            <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></div>
            <span className="text-slate-400">
              Based in San Francisco, CA
            </span>
          </div>

          {/* Copyright and credits */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <div>
                © {new Date().getFullYear()} Alex Johnson. All rights reserved.
              </div>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-slate-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-slate-400 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Tech stack credit */}
            <div className="mt-4 text-xs text-slate-600">
              <p>Built with React, TypeScript, Tailwind CSS & tRPC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-full blur-2xl"></div>
      </div>
    </footer>
  );
};

export default Footer;
