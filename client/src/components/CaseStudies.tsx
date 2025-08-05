
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PortfolioProject } from '../../../server/src/schema';

interface CaseStudiesProps {
  projects: PortfolioProject[];
}

const CaseStudies: React.FC<CaseStudiesProps> = ({ projects }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Placeholder case studies for demo since projects array is empty from stub
  const placeholderCaseStudies = [
    {
      id: 1,
      title: 'E-commerce Mobile App',
      description: 'Complete redesign of a fashion e-commerce platform with focus on conversion optimization and user experience.',
      type: 'uiux' as const,
      hero_image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      tools_used: ['Figma', 'React Native', 'Framer', 'Principle'],
      role: 'Lead UI/UX Designer',
      problem: 'Low conversion rates and poor mobile navigation experience were affecting sales and user retention.',
      solution: 'Implemented a streamlined checkout process, improved product discovery, and created an intuitive mobile-first design system.',
      prototype_url: 'https://figma.com/proto/example'
    },
    {
      id: 2,
      title: 'SaaS Dashboard Redesign',
      description: 'Comprehensive redesign of a complex analytics dashboard to improve data visualization and user workflow.',
      type: 'uiux' as const,
      hero_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      tools_used: ['Sketch', 'InVision', 'Chart.js', 'Vue.js'],
      role: 'Senior UX Designer',
      problem: 'Users were overwhelmed by information density and struggled to find actionable insights from their data.',
      solution: 'Created a modular dashboard system with customizable widgets, progressive disclosure, and smart data filtering.',
      prototype_url: 'https://invision.com/example'
    },
    {
      id: 3,
      title: 'Healthcare App Interface',
      description: 'Patient-centered mobile application design focused on accessibility and ease of use for all age groups.',
      type: 'uiux' as const,
      hero_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      tools_used: ['Adobe XD', 'Miro', 'Axure', 'React'],
      role: 'UX Researcher & Designer',
      problem: 'Existing healthcare apps were not accessible to elderly patients and had poor usability for critical health tasks.',
      solution: 'Designed with WCAG 2.1 AA compliance, large touch targets, clear typography, and simplified navigation flows.',
      prototype_url: 'https://xd.adobe.com/example'
    },
    {
      id: 4,
      title: 'Banking App Redesign',
      description: 'Modern financial app focusing on security, trust, and simplified money management for young professionals.',
      type: 'uiux' as const,
      hero_image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
      tools_used: ['Figma', 'Principle', 'Lottie', 'Swift UI'],
      role: 'Product Designer',
      problem: 'Young users found traditional banking apps intimidating and difficult to navigate for everyday transactions.',
      solution: 'Created a friendly, gamified experience with smart budgeting tools, instant notifications, and biometric security.',
      prototype_url: 'https://figma.com/banking-proto'
    }
  ];

  // Use placeholder data since backend returns empty array (stub implementation)
  const displayProjects = projects.length > 0 ? projects : placeholderCaseStudies;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding" id="case-studies">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="mb-6">UI/UX Case Studies</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Deep dives into my design process, from problem identification to solution implementation.
          </p>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            onClick={scrollLeft}
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            onClick={scrollRight}
          >
            →
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayProjects.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-96 glass-panel p-6 group hover:scale-105 transition-all duration-300"
              >
                {/* Hero image */}
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img
                    src={project.hero_image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Project details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
                  </div>

                  {/* Role */}
                  {project.role && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Role</p>
                      <p className="text-sm text-slate-200">{project.role}</p>
                    </div>
                  )}

                  {/* Problem */}
                  {project.problem && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Problem</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.problem}</p>
                    </div>
                  )}

                  {/* Solution */}
                  {project.solution && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Solution</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{project.solution}</p>
                    </div>
                  )}

                  {/* Tools used */}
                  {project.tools_used && project.tools_used.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Tools Used</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tools_used.map((tool, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-white/10 text-slate-200 border-white/20 hover:bg-white/20"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA button */}
                  {project.prototype_url && (
                    <div className="pt-4">
                      <Button
                        className="btn-gradient w-full rounded-full"
                        onClick={() => window.open(project.prototype_url!, '_blank')}
                      >
                        <span>View Prototype</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice about stub data */}
        {projects.length === 0 && (
          <div className="text-center mt-12">
            <div className="glass-card p-6 max-w-md mx-auto">
              <p className="text-slate-400 text-sm mb-2">🎨 Demo Content</p>
              <p className="text-slate-300">
                These case studies show placeholder content. Connect to your backend to display real UI/UX projects.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
