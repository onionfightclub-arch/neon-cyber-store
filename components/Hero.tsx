
import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, onCtaClick }) => {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/cyberhero/1920/1080" 
          alt="Cyber Background" 
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.8)_100%)]"></div>
      </div>

      {/* Floating Elements (Decorative) */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-electric-blue/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-cyber-purple/20 rounded-full animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-black text-cyber-text tracking-tight mb-6 leading-tight uppercase drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-cyber-muted mb-10 font-medium">
          {subtitle}
        </p>
        <button 
          onClick={onCtaClick}
          className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-cyber-black bg-electric-blue rounded-sm hover:neon-glow-blue transition-all transform hover:-translate-y-1 active:translate-y-0"
        >
          <span className="relative z-10 tracking-[0.2em] font-orbitron uppercase">Enter the Grid</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>

      {/* Animated Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="w-full h-[2px] bg-electric-blue shadow-[0_0_10px_#00FFFF] absolute top-0 animate-[scan_4s_linear_infinite]"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
