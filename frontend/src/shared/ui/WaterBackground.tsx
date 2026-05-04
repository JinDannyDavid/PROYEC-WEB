// src/shared/ui/WaterBackground.tsx

import React, { ReactNode } from 'react';

interface WaterBackgroundProps {
  children: ReactNode;
}

const WaterBackground: React.FC<WaterBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo estilo acuático */}
      <div className="fixed inset-0 bg-gradient-to-br from-jass-primary via-jass-secondary to-jass-accent" />
      
      {/* Ondulaciones SVG */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-10" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320"
      >
        <path 
          fill="white" 
          fillOpacity="0.15" 
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      
      {/* Segunda ondulación */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-5 animate-wave" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320" 
        style={{ transform: 'translateY(-50px)' }}
      >
        <path 
          fill="white" 
          d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,160C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      
      {/* Burbujas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 60 + 10}px`,
              height: `${Math.random() * 60 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 8 + 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default WaterBackground;