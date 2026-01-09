
import React, { useState, useEffect, useMemo } from 'react';
import { Product, AppRoute, CartItem } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { getPersonalizedGreeting, getGeminiProductInsight } from './services/geminiService';

const App: React.FC = () => {
  const [route, setRoute] = useState<string>(AppRoute.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [aiGreeting, setAiGreeting] = useState<string>('Syncing with the grid...');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  // Filtering & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchGreeting = async () => {
      const greeting = await getPersonalizedGreeting();
      setAiGreeting(greeting);
    };
    fetchGreeting();
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const navigateToProduct = async (product: Product) => {
    setSelectedProduct(product);
    setRoute(AppRoute.PRODUCT);
    setIsLoadingInsight(true);
    setAiInsight('');
    const insight = await getGeminiProductInsight(product.name, product.description);
    setAiInsight(insight);
    setIsLoadingInsight(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => (
    <div className="animate-in fade-in duration-700">
      <Hero 
        title="Evolution Starts Here" 
        subtitle={aiGreeting}
        onCtaClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Categories Browser */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-black text-cyber-text mb-12 flex items-center gap-4">
          <span className="w-12 h-[2px] bg-cyber-purple shadow-[0_0_10px_#FF00FF]"></span>
          ZONE SELECT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => {
                setActiveCategory(cat.id.toLowerCase());
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group relative h-48 rounded-sm overflow-hidden cursor-pointer border transition-all duration-500 ${
                activeCategory === cat.id.toLowerCase() ? 'border-cyber-purple shadow-[0_0_20px_rgba(255,0,255,0.3)]' : 'border-border-gray hover:border-cyber-purple'
              }`}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 bg-cyber-black/40 group-hover:bg-cyber-black/20 transition-all"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-xl font-black font-orbitron text-white tracking-widest drop-shadow-lg group-hover:scale-110 transition-transform uppercase">{cat.name}</span>
                {activeCategory === cat.id.toLowerCase() && (
                  <span className="text-[10px] text-cyber-purple font-bold tracking-[0.3em] mt-2 animate-pulse">SELECTED_ZONE</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <section id="marketplace" className="py-20 container mx-auto px-6 min-h-[600px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-cyber-text flex items-center gap-4 mb-2">
              <span className="w-12 h-[2px] bg-electric-blue shadow-[0_0_10px_#00FFFF]"></span>
              {activeCategory === 'all' ? 'LATEST TECH' : `${activeCategory.toUpperCase()} DROP`}
            </h2>
            <p className="text-cyber-muted text-sm font-medium tracking-wide">
              {searchQuery ? `SHOWING RESULTS FOR "${searchQuery.toUpperCase()}"` : 'CURATED FOR THE ELITE OPERATORS'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             { (activeCategory !== 'all' || searchQuery !== '') && (
              <button 
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="text-cyber-muted text-[10px] font-bold border border-border-gray px-4 py-2 hover:border-electric-blue hover:text-electric-blue transition-all uppercase tracking-widest"
              >
                Clear Filters
              </button>
            )}
            <button 
              onClick={() => setRoute(AppRoute.HOLDING)}
              className="text-electric-blue text-[10px] font-bold border border-electric-blue/30 px-4 py-2 hover:bg-electric-blue hover:text-cyber-black transition-all uppercase tracking-widest"
            >
              Advanced Search
            </button>
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => navigateToProduct(product)}
                onAddToCart={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border-gray/30 rounded-sm">
            <div className="w-16 h-16 text-cyber-muted mb-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-cyber-muted font-orbitron">NO ASSETS FOUND</h3>
            <p className="text-sm text-cyber-muted/60 mt-2">Adjust your search parameters or check a different frequency.</p>
          </div>
        )}
      </section>

      {/* Flash Sale Banner */}
      <section className="py-20">
        <div 
          onClick={() => setRoute(AppRoute.HOLDING)}
          className="bg-gradient-to-r from-cyber-purple/20 via-cyber-black to-electric-blue/20 border-y border-border-gray py-12 relative overflow-hidden cursor-pointer group"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <span className="text-neon-red font-orbitron font-bold tracking-[0.3em] text-sm animate-pulse block mb-2">SYSTEM ALERT: FLASH DROP</span>
              <h2 className="text-3xl md:text-5xl font-black text-cyber-text group-hover:text-electric-blue transition-colors">AUGMENT YOUR REALITY - 30% OFF</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block text-3xl font-orbitron font-bold text-cyber-text">02</span>
                <span className="text-[10px] text-cyber-muted uppercase tracking-widest">Hours</span>
              </div>
              <span className="text-2xl text-cyber-muted">:</span>
              <div className="text-center">
                <span className="block text-3xl font-orbitron font-bold text-cyber-text">34</span>
                <span className="text-[10px] text-cyber-muted uppercase tracking-widest">Mins</span>
              </div>
              <span className="text-2xl text-cyber-muted">:</span>
              <div className="text-center">
                <span className="block text-3xl font-orbitron font-bold text-cyber-text">56</span>
                <span className="text-[10px] text-cyber-muted uppercase tracking-widest">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderProduct = () => (
    selectedProduct && (
      <div className="pt-32 pb-20 container mx-auto px-6 animate-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={() => setRoute(AppRoute.HOME)}
          className="flex items-center gap-2 text-cyber-muted hover:text-electric-blue transition-colors mb-12 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          <span className="font-bold tracking-widest uppercase text-xs">Return to Grid</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-cyber-gray border border-border-gray rounded-sm overflow-hidden relative group">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/60 to-transparent"></div>
              {selectedProduct.onSale && (
                <div className="absolute top-6 right-6 bg-neon-red text-white text-xs font-bold px-4 py-2 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,69,0,0.5)] transform rotate-3">Limited Drop</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-cyber-gray border border-border-gray hover:border-electric-blue transition-all cursor-pointer overflow-hidden rounded-sm group">
                  <img src={`https://picsum.photos/seed/${selectedProduct.id}${i}/400/400`} alt="Thumb" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-electric-blue font-bold tracking-[0.4em] text-xs uppercase mb-4 block">{selectedProduct.category}</span>
              <h1 className="text-4xl md:text-6xl font-black text-cyber-text mb-6 uppercase leading-none">{selectedProduct.name}</h1>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-black font-orbitron text-neon-green">${selectedProduct.price.toFixed(2)}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-cyber-muted line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="h-10 w-[1px] bg-border-gray"></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.floor(selectedProduct.rating) ? "#FF00FF" : "none"} stroke="#FF00FF" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-cyber-muted tracking-widest uppercase mt-1">Authenticity verified</span>
                </div>
              </div>
              
              <p className="text-cyber-muted leading-relaxed text-lg mb-10">
                {selectedProduct.description}
              </p>

              {/* AI Insight Box */}
              <div className={`bg-cyber-gray/50 border-l-4 p-6 mb-10 relative overflow-hidden transition-all duration-500 ${isLoadingInsight ? 'border-electric-blue' : 'border-cyber-purple'}`}>
                {isLoadingInsight && (
                  <div className="absolute bottom-0 left-0 h-[2px] bg-electric-blue w-full animate-[loading_2s_linear_infinite]"></div>
                )}
                <div className={`absolute top-2 right-4 text-[10px] font-orbitron animate-pulse ${isLoadingInsight ? 'text-electric-blue/50' : 'text-cyber-purple/50'}`}>
                  {isLoadingInsight ? 'DECRYPTING...' : 'AI-ANALYSIS COMPLETE'}
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-[0.2em] mb-2 ${isLoadingInsight ? 'text-electric-blue' : 'text-cyber-purple'}`}>NEON-X Insight</h4>
                <p className="text-cyber-text font-medium italic min-h-[40px]">
                  {isLoadingInsight ? 'Scanning mesh network for vulnerabilities and performance metrics...' : aiInsight}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mb-12">
                {selectedProduct.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-cyber-black border border-border-gray text-cyber-muted text-[10px] font-bold tracking-widest uppercase hover:border-electric-blue hover:text-electric-blue cursor-default transition-all">{tag}</span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  className="flex-1 bg-electric-blue text-cyber-black font-black py-4 rounded-sm hover:neon-glow-blue transition-all uppercase tracking-[0.2em] font-orbitron flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Acquire Asset
                </button>
                <button 
                  onClick={() => setRoute(AppRoute.HOLDING)}
                  className="w-full sm:w-16 h-16 border border-border-gray hover:border-cyber-purple text-cyber-muted hover:text-cyber-purple transition-all flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
            </div>

            {/* Accordion mockup */}
            <div className="border-t border-border-gray">
              {['SPECIFICATIONS', 'REVIEW_LOGS', 'SECURE_SHIPPING'].map(item => (
                <div 
                  key={item} 
                  onClick={() => setRoute(AppRoute.HOLDING)}
                  className="border-b border-border-gray py-4 flex justify-between items-center cursor-pointer hover:bg-cyber-gray/30 px-2 group"
                >
                  <span className="text-xs font-bold text-cyber-muted group-hover:text-cyber-text tracking-widest">{item}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  );

  const renderCart = () => (
    <div className="pt-32 pb-20 container mx-auto px-6 animate-in fade-in duration-500 min-h-[60vh]">
      <h1 className="text-4xl font-black text-cyber-text mb-12 flex items-center gap-4">
        <span className="w-12 h-[2px] bg-cyber-purple shadow-[0_0_10px_#FF00FF]"></span>
        CART_BUFFER
      </h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-gray rounded-sm">
          <p className="text-cyber-muted mb-8 italic">Memory bank empty. No assets found in the current session.</p>
          <button 
            onClick={() => setRoute(AppRoute.HOME)}
            className="text-electric-blue font-bold tracking-widest border border-electric-blue px-8 py-3 hover:bg-electric-blue hover:text-cyber-black transition-all font-orbitron"
          >
            SCAVENGE MARKETPLACE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-cyber-gray p-4 border border-border-gray group hover:border-cyber-purple transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[1px] h-full bg-cyber-purple/20 group-hover:bg-cyber-purple/40 transition-all"></div>
                <img src={item.image} alt={item.name} className="w-full sm:w-32 h-32 object-cover rounded-sm" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-cyber-text uppercase tracking-widest text-lg group-hover:text-electric-blue transition-colors">{item.name}</h3>
                      <p className="text-xs text-cyber-muted mt-1 uppercase tracking-tight">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-cyber-muted hover:text-neon-red transition-colors p-2"
                      title="Abort asset retrieval"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center bg-cyber-black border border-border-gray rounded-sm overflow-hidden">
                        <button 
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-cyber-muted hover:bg-cyber-gray hover:text-white transition-all font-bold"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-cyber-text">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-cyber-muted hover:bg-cyber-gray hover:text-white transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-[10px] text-cyber-muted uppercase tracking-widest mb-1">Asset Value</span>
                       <span className="font-bold text-neon-green font-orbitron text-xl">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-cyber-gray p-8 border border-border-gray h-fit sticky top-32 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
            <h3 className="font-bold text-cyber-text uppercase tracking-widest mb-8 pb-4 border-b border-border-gray flex justify-between items-center">
              Summary
              <span className="text-[10px] text-electric-blue font-orbitron">SECURE_LINK</span>
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-cyber-muted text-sm uppercase tracking-tighter">
                <span>Subtotal</span>
                <span className="font-bold">${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cyber-muted text-sm uppercase tracking-tighter">
                <span>Network Protocol Fee</span>
                <span className="font-bold">$25.00</span>
              </div>
              <div className="h-[1px] bg-border-gray w-full my-6"></div>
              <div className="flex justify-between text-cyber-text font-black text-xl font-orbitron">
                <span>TOTAL</span>
                <span className="text-neon-green shadow-neon-green text-2xl tracking-tighter">${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 25).toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => setRoute(AppRoute.HOLDING)}
              className="w-full bg-cyber-purple text-white font-black py-4 rounded-sm hover:neon-glow-purple transition-all uppercase tracking-[0.2em] font-orbitron relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              Initialize Transaction
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-[8px] text-cyber-muted uppercase tracking-[0.4em]">Encrypted Connection Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHolding = () => (
    <div className="pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-12">
        <div className="text-9xl font-black text-neon-red/10 select-none animate-glitch">403</div>
        <div className="absolute inset-0 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-neon-red animate-pulse"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m14.5 9-5 5"/><path d="m9.5 9 5 5"/></svg>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black text-cyber-text mb-4 uppercase tracking-tighter animate-glitch">Access Restricted</h1>
      <p className="text-cyber-muted max-w-lg mx-auto mb-10 text-lg">
        The requested protocol is currently offline or requires Level 5 Clearance. System administrators have been notified of this unauthorized handshake attempt.
      </p>

      <div className="bg-cyber-gray border border-neon-red/30 p-6 rounded-sm max-w-xl w-full text-left font-mono text-xs mb-12 shadow-[0_0_30px_rgba(255,69,0,0.1)]">
        <div className="flex items-center gap-2 mb-4 border-b border-border-gray pb-2">
          <div className="w-2 h-2 rounded-full bg-neon-red"></div>
          <span className="text-neon-red uppercase font-bold tracking-widest">Terminal Output</span>
        </div>
        <div className="space-y-1 text-cyber-muted">
          <p>> Initializing decryption sequence...</p>
          <p className="text-neon-red">> [ERROR] RSA Key Refused by Uplink</p>
          <p>> Retrying via proxy 127.0.0.1:8080...</p>
          <p className="text-neon-red">> [FATAL] MAC Address Blacklisted</p>
          <p>> Resource: {window.location.hash || 'unknown_node'}</p>
          <p>> Status: Under Construction / Encrypted</p>
          <p className="animate-pulse">> _</p>
        </div>
      </div>

      <button 
        onClick={() => setRoute(AppRoute.HOME)}
        className="px-12 py-4 bg-cyber-purple text-white font-black rounded-sm hover:neon-glow-purple transition-all uppercase tracking-widest font-orbitron"
      >
        Return to Safe Grid
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-electric-blue selection:text-cyber-black">
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        activeCategory={activeCategory}
        onNavigate={(r) => {
          setRoute(r);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearch={(q) => setSearchQuery(q)}
        onCategorySelect={(c) => setActiveCategory(c)}
      />
      
      <main className="flex-1">
        {route === AppRoute.HOME && renderHome()}
        {route === AppRoute.PRODUCT && renderProduct()}
        {route === AppRoute.CART && renderCart()}
        {route === AppRoute.HOLDING && renderHolding()}
      </main>

      <Footer onNavigate={(r) => {
        setRoute(r);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
};

export default App;
