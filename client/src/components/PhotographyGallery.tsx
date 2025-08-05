
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { PortfolioProject } from '../../../server/src/schema';

interface PhotographyGalleryProps {
  projects: PortfolioProject[];
}

const PhotographyGallery: React.FC<PhotographyGalleryProps> = ({ projects }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Placeholder images for demo since projects array is empty from stub
  const placeholderImages = [
    {
      id: 1,
      title: 'Urban Landscapes',
      description: 'Modern architecture meets natural light',
      hero_image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=800&fit=crop',
      gallery_images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=1600&fit=crop']
    },
    {
      id: 2,
      title: 'Portrait Sessions',
      description: 'Capturing authentic human moments',
      hero_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
      gallery_images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop&crop=face']
    },
    {
      id: 3,
      title: 'Nature & Wildlife',
      description: 'The beauty of the natural world',
      hero_image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      gallery_images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop']
    },
    {
      id: 4,
      title: 'Street Photography',
      description: 'Life as it happens in the urban jungle',
      hero_image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=600&fit=crop',
      gallery_images: ['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=1200&fit=crop']
    },
    {
      id: 5,
      title: 'Wedding Photography',
      description: 'Timeless moments of love and celebration',
      hero_image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=700&fit=crop',
      gallery_images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1000&h=1400&fit=crop']
    },
    {
      id: 6,
      title: 'Abstract & Artistic',
      description: 'Exploring creative visual narratives',
      hero_image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
      gallery_images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop']
    }
  ];

  // Use placeholder data since backend returns empty array (stub implementation)
  const displayProjects = projects.length > 0 ? projects : placeholderImages;

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  };

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <section className="section-padding bg-black/20" id="photography">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="mb-6">Photography Portfolio</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A curated collection of moments captured through my lens, each telling its own unique story.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              className="break-inside-avoid"
            >
              <div className="glass-card p-3 group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                <div className="relative overflow-hidden rounded-lg">
                  {!loadedImages.has(project.hero_image_url) && (
                    <div className="absolute inset-0 bg-slate-800 animate-pulse rounded-lg"></div>
                  )}
                  
                  <img
                    src={project.hero_image_url}
                    alt={project.title}
                    className={`w-full h-auto object-cover rounded-lg transition-all duration-500 ${
                      loadedImages.has(project.hero_image_url) ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(project.hero_image_url)}
                    onClick={() => openLightbox(project.gallery_images?.[0] || project.hero_image_url)}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-4">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-slate-200 opacity-90">{project.description}</p>
                    </div>
                  </div>
                  
                  {/* View button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="btn-gradient rounded-full px-3 py-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(project.gallery_images?.[0] || project.hero_image_url);
                      }}
                    >
                      <span>View</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice about stub data */}
        {projects.length === 0 && (
          <div className="text-center mt-12">
            <div className="glass-card p-6 max-w-md mx-auto">
              <p className="text-slate-400 text-sm mb-2">📷 Demo Content</p>
              <p className="text-slate-300">
                This gallery shows placeholder images. Connect to your backend to display real photography projects.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] bg-black/90 border-0 p-0">
          <div className="relative flex items-center justify-center h-full min-h-[60vh]">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={closeLightbox}
              />
            )}
            
            {/* Close button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 rounded-full border-white/20 text-white hover:bg-white/10"
              onClick={closeLightbox}
            >
              ✕
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PhotographyGallery;
