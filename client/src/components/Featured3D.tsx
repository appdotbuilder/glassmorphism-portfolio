
import React from 'react';

const Featured3D: React.FC = () => {
  const sampleImages = [
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop'
  ];

  return (
    <section className="section-padding" id="featured" data-testid="featured-section">
      <div className="container">
        <header className="text-center mb-12">
          <h2 className="mb-4" data-testid="featured-title">Featured Work</h2>
          <p className="text-lg text-slate-300" data-testid="featured-description">
            A selection of my recent photography and design projects
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto" data-testid="featured-grid">
          {sampleImages.map((image, index) => (
            <div key={index} className="glass-card p-2 aspect-square" data-testid={`featured-item-${index}`}>
              <img
                src={image}
                alt={`Featured work ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured3D;
