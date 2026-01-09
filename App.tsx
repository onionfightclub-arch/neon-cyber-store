
import React, { useState, useEffect, useMemo } from 'react';
import { Product, AppRoute, CartItem } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { getPersonalizedGreeting, getGeminiProductInsight } from './services/geminiService';

const App: React.FC = () => {
  const [route, setRoute] = useState<string>(AppRoute.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [aiGreeting, setAiGreeting] = useState<string>('Syncing with the grid...');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
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
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="marketplace" className="py-20 container mx-auto px-6 min-h-[600px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-cyber-text flex items-center gap-4 mb-2">
              <span className="w-12 h-[2px] bg-electric-blue shadow-[0_0_10px_#00FFFF]"></span>
              {activeCategory === 'all' ? 'LATEST TECH' : `${activeCategory.toUpperCase()} DROP`}
            </h2>
            <p className="text-cyber-muted text-sm font-medium tracking-wide">CURATED FOR THE ELITE OPERATORS</p>
          </div>
          <button 
            onClick={() => setRoute(AppRoute.HOLDING)}
            className="text-electric-blue text-[10px] font-bold border border-electric-blue/30 px-4 py-2 hover:bg-electric-blue hover:text-cyber-black transition-all uppercase tracking-widest"
          >
            Advanced Filter
          </button>
        </div>
        
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
      </section>
    </div>
  );

  const renderProduct = () => (
    selectedProduct && (
      <div className="pt-32 pb-20 container mx-auto px-6 animate-in slide-in-from-bottom-10 duration-500">
        <button onClick={() => setRoute(AppRoute.HOME)} className="flex items-center gap-2 text-cyber-muted hover:text-electric-blue mb-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          <span className="font-bold uppercase text-xs">Return to Grid</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-cyber-gray border border-border-gray rounded-sm overflow-hidden relative">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-black text-cyber-text mb-6 uppercase">{selectedProduct.name}</h1>
            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl font-black text-neon-green font-orbitron">${selectedProduct.price.toFixed(2)}</span>
            </div>
            
            <p className="text-cyber-muted leading-relaxed text-lg mb-10">{selectedProduct.description}</p>

            <div className={`bg-cyber-gray/50 border-l-4 p-6 mb-10 border-cyber-purple relative`}>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-cyber-purple">NEON-X Insight</h4>
              <p className="text-cyber-text font-medium italic">
                {isLoadingInsight ? 'DECRYPTING DATA STREAMS...' : aiInsight}
              </p>
            </div>

            <button 
              onClick={() => addToCart(selectedProduct)}
              className="w-full bg-electric-blue text-cyber-black font-black py-4 rounded-sm hover:neon-glow-blue transition-all uppercase tracking-[0.2em] font-orbitron"
            >
              Acquire Asset
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderCart = () => (
    <div className="pt-32 pb-20 container mx-auto px-6 animate-in fade-in duration-500 min-h-[60vh]">
      <h1 className="text-4xl font-black text-cyber-text mb-12 uppercase">CART_BUFFER</h1>
      {cart.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-gray rounded-sm">
          <p className="text-cyber-muted mb-8 italic">Memory bank empty.</p>
          <button onClick={() => setRoute(AppRoute.HOME)} className="text-electric-blue border border-electric-blue px-8 py-3 hover:bg-electric-blue hover:text-cyber-black transition-all">SCAVENGE MARKETPLACE</button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 bg-cyber-gray p-4 border border-border-gray">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-cyber-text">{item.name}</h3>
                <p className="text-neon-green font-bold">${item.price}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => updateCartQuantity(item.id, -1)} className="px-2 bg-cyber-black">-</button>
                  <span className="text-xs">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, 1)} className="px-2 bg-cyber-black">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-auto text-neon-red text-xs">SCRAP</button>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-10 border-t border-border-gray flex justify-between items-center">
            <span className="text-2xl font-black">TOTAL: ${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
            <button onClick={() => setRoute(AppRoute.HOLDING)} className="bg-cyber-purple px-10 py-4 font-black uppercase">Initialize Transaction</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHolding = () => (
    <div className="pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="text-9xl font-black text-neon-red/10 animate-glitch mb-12">403</div>
      <h1 className="text-4xl md:text-6xl font-black text-cyber-text mb-4 uppercase">Access Restricted</h1>
      <p className="text-cyber-muted max-w-lg mb-10">Sector offline. Level 5 Clearance required for this node.</p>
      <button onClick={() => setRoute(AppRoute.HOME)} className="px-12 py-4 bg-cyber-purple text-white font-black hover:neon-glow-purple">Return to Safe Grid</button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        activeCategory={activeCategory}
        onNavigate={(r) => setRoute(r)}
        onSearch={(q) => setSearchQuery(q)}
        onCategorySelect={(c) => setActiveCategory(c)}
      />
      <main className="flex-1">
        {route === AppRoute.HOME && renderHome()}
        {route === AppRoute.PRODUCT && renderProduct()}
        {route === AppRoute.CART && renderCart()}
        {route === AppRoute.HOLDING && renderHolding()}
      </main>
      <ChatBot />
      <Footer onNavigate={(r) => setRoute(r)} />
    </div>
  );
};

export default App;
