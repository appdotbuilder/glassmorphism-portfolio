
import React, { useState, useEffect, useRef, useMemo } from 'react';

const AboutSection: React.FC = () => {
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const skills = useMemo(() => [
    { name: 'Photography', level: 95, color: 'from-teal-400 to-indigo-600' },
    { name: 'UI/UX Design', level: 90, color: 'from-pink-500 to-orange-400' },
    { name: 'Adobe Creative Suite', level: 88, color: 'from-purple-500 to-cyan-400' },
    { name: 'Figma & Sketch', level: 92, color: 'from-teal-400 to-indigo-600' },
    { name: 'Frontend Development', level: 75, color: 'from-pink-500 to-orange-400' },
    { name: 'User Research', level: 85, color: 'from-purple-500 to-cyan-400' }
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !skillsVisible) {
          setSkillsVisible(true);
          
          // Animate skill bars with delays
          skills.forEach((skill, index) => {
            setTimeout(() => {
              animateValue(skill.name, 0, skill.level, 1000);
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [skillsVisible, skills]);

  const animateValue = (skillName: string, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + (end - start) * easeOutCubic;
      
      setAnimatedValues(prev => ({
        ...prev,
        [skillName]: Math.round(currentValue)
      }));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <section className="section-padding bg-black/10" id="about" ref={sectionRef}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Photo and intro */}
          <div className="text-center lg:text-left">
            <div className="glass-panel p-8">
              {/* Profile photo placeholder */}
              <div className="w-64 h-64 mx-auto lg:mx-0 mb-8 rounded-full bg-gradient-to-br from-teal-400/20 to-indigo-600/20 flex items-center justify-center overflow-hidden">
                <div className="w-56 h-56 bg-gradient-to-br from-pink-500/30 to-orange-400/30 rounded-full flex items-center justify-center text-4xl">
                  👨‍💻
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">About Me</h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  I'm a creative professional with over 8 years of experience in both photography and UI/UX design. 
                  My journey began with capturing moments through my lens, which naturally evolved into crafting 
                  digital experiences that tell compelling stories.
                </p>
                
                <p>
                  My photography work spans from intimate portraits to grand landscapes, always seeking to capture 
                  the authentic essence of my subjects. In the digital realm, I focus on creating user-centered 
                  designs that are both beautiful and functional.
                </p>
                
                <p>
                  When I'm not behind a camera or designing interfaces, you'll find me exploring new cities, 
                  experimenting with new techniques, or mentoring aspiring creatives in the community.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">150+</div>
                  <div className="text-sm text-slate-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">50+</div>
                  <div className="text-sm text-slate-400">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">8+</div>
                  <div className="text-sm text-slate-400">Years Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Skills */}
          <div>
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-semibold mb-8 text-center lg:text-left">Skills & Expertise</h3>
              
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="skill-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-slate-300 text-sm">
                        {animatedValues[skill.name] || 0}%
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out rounded-full relative`}
                          style={{
                            width: `${animatedValues[skill.name] || 0}%`,
                            transitionDelay: `${index * 200}ms`
                          }}
                        >
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications or awards */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-lg font-semibold mb-4 text-white">Certifications & Awards</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-indigo-600 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Adobe Certified Expert - Photoshop & Lightroom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Google UX Design Professional Certificate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Winner - Local Photography Contest 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
