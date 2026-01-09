
import React from 'react';
import { AppRoute } from '../types';

interface FooterProps {
  onNavigate: (route: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-cyber-gray pt-20 pb-10 border-t border-border-gray">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate(AppRoute.HOME)}>
            <span className="text-2xl font-black font-orbitron tracking-tighter text-cyber-text">
              NEON<span className="text-electric-blue">X</span>
            </span>
          </div>
          <p className="text-cyber-muted text-sm leading-relaxed mb-6">
            Providing the hardware for your digital evolution. Secure your future in the grid with high-performance augments and tech.
          </p>
          <div className="flex gap-4">
            {['twitter', 'instagram', 'github'].map(social => (
              <button 
                key={social} 
                onClick={() => onNavigate(AppRoute.HOLDING)}
                className="w-10 h-10 rounded-sm bg-cyber-black flex items-center justify-center text-cyber-muted hover:text-electric-blue hover:border-electric-blue border border-border-gray transition-all"
              >
                <span className="sr-only">{social}</span>
                <div className="w-5 h-5 bg-current mask-contain" style={{ maskImage: `url(https://unpkg.com/lucide-static/icons/${social}.svg)` }}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-cyber-text font-bold mb-6 tracking-widest uppercase">Navigation</h4>
          <ul className="space-y-4">
            {['Archives', 'Marketplace', 'Auctions', 'New Drops'].map(link => (
              <li key={link}>
                <button 
                  onClick={() => onNavigate(AppRoute.HOLDING)}
                  className="text-cyber-muted hover:text-cyber-purple text-sm transition-colors"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-cyber-text font-bold mb-6 tracking-widest uppercase">Support</h4>
          <ul className="space-y-4">
            {['Encrypted Comms', 'Refund Protocols', 'FAQ', 'Grid Status'].map(link => (
              <li key={link}>
                <button 
                  onClick={() => onNavigate(AppRoute.HOLDING)}
                  className="text-cyber-muted hover:text-cyber-purple text-sm transition-colors"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-cyber-text font-bold mb-6 tracking-widest uppercase">Join the Collective</h4>
          <p className="text-cyber-muted text-sm mb-4">Subscribe for firmware updates and exclusive drop alerts.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="user@network.com"
              className="bg-cyber-black border border-border-gray rounded-sm py-2 px-4 text-sm text-cyber-text focus:outline-none focus:border-electric-blue"
            />
            <button 
              onClick={() => onNavigate(AppRoute.HOLDING)}
              className="bg-electric-blue text-cyber-black font-bold py-2 rounded-sm hover:neon-glow-blue transition-all uppercase text-sm tracking-widest"
            >
              Sync
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20 pt-10 border-t border-border-gray flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-cyber-muted text-xs">© 2077 NEON-X COLLECTIVE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <button onClick={() => onNavigate(AppRoute.HOLDING)} className="text-cyber-muted hover:text-electric-blue text-xs uppercase">Privacy Protocol</button>
          <button onClick={() => onNavigate(AppRoute.HOLDING)} className="text-cyber-muted hover:text-electric-blue text-xs uppercase">Terms of Service</button>
        </div>
      </div>

      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-cyber-black border border-electric-blue text-electric-blue rounded-sm flex items-center justify-center hover:bg-electric-blue hover:text-cyber-black transition-all z-40 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform"><path d="m18 15-6-6-6 6"/></svg>
      </button>
    </footer>
  );
};

export default Footer;
