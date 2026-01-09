
import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types.ts';

interface NavbarProps {
  cartCount: number;
  activeCategory: string;
  onNavigate: (route: string) => void;
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, activeCategory, onNavigate, onSearch, onCategorySelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center px-6 md:px-12 ${
      isScrolled ? 'bg-cyber-black/90 backdrop-blur-md border-b border-cyber-purple/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
    }`}>
      {/* Logo -> Holding Page */}
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate(AppRoute.HOLDING)}
      >
        <div className="w-10 h-10 rounded-full border-2 border-electric-blue flex items-center justify-center relative overflow-hidden group-hover:neon-glow-blue transition-all">
           <div className="w-6 h-6 bg-electric-blue/20 rounded-full animate-pulse"></div>
           <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/50 to-transparent opacity-30"></div>
        </div>
        <span className="text-2xl font-black font-orbitron tracking-tighter text-cyber-text hidden sm:inline">
          NEON<span className="text-electric-blue">X</span>
        </span>
      </div>

      {/* Navigation Links -> Holding Page */}
      <div className="hidden lg:flex items-center gap-8 ml-12">
        {['ALL', 'ELECTRONICS', 'FASHION', 'GADGETS', 'VEHICLES'].map((cat) => (
          <button 
            key={cat}
            className={`font-semibold tracking-widest text-xs transition-colors relative group uppercase text-cyber-muted hover:text-electric-blue`}
            onClick={() => onNavigate(AppRoute.HOLDING)}
          >
            {cat}
            <span className={`absolute -bottom-1 left-0 h-[1px] bg-electric-blue transition-all duration-300 w-0 group-hover:w-full`}></span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-auto px-4">
        <div className="relative group">
          <input 
            type="text" 
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search the grid..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full bg-cyber-gray/50 border border-border-gray rounded-full py-2 px-6 text-sm text-cyber-text focus:outline-none transition-all placeholder:text-cyber-muted/50 ${
              searchFocused ? 'border-electric-blue neon-glow-blue bg-cyber-black' : ''
            }`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-muted cursor-pointer" onClick={() => onNavigate(AppRoute.HOLDING)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* Icons -> Holding Page */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={() => onNavigate(AppRoute.HOLDING)}
          className="text-cyber-muted hover:text-cyber-purple transition-colors relative hidden sm:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button 
          className="text-cyber-muted hover:text-cyber-purple transition-colors relative"
          onClick={() => onNavigate(AppRoute.HOLDING)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-cyber-purple text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center neon-glow-purple border border-cyber-black animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
