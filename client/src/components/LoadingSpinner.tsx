
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" data-testid="loading-spinner">
      <div className="glass-card p-8 text-center">
        <div className="loading-spinner mx-auto mb-4" aria-label="Loading"></div>
        <p className="text-slate-300" data-testid="loading-text">Loading portfolio...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
