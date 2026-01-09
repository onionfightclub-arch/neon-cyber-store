
import React from 'react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  return (
    <div 
      className="group relative bg-cyber-gray border border-border-gray hover:border-electric-blue/50 transition-all duration-500 rounded-sm overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Badge */}
      {(product.isNew || product.onSale) && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-electric-blue text-cyber-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest font-orbitron">New Arrival</span>
          )}
          {product.onSale && (
            <span className="bg-cyber-purple text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest font-orbitron neon-glow-purple">Promo Active</span>
          )}
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Quick Add Button */}
        <button 
          onClick={onAddToCart}
          className="absolute bottom-4 right-4 w-12 h-12 bg-cyber-purple text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 neon-glow-purple hover:bg-white hover:text-cyber-purple"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] text-electric-blue font-bold tracking-[0.2em] uppercase">{product.category}</span>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#FF00FF" stroke="#FF00FF" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-xs text-cyber-purple font-bold">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-cyber-text mb-4 line-clamp-1 group-hover:text-electric-blue transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end gap-3">
          <span className="text-xl font-bold text-neon-green font-orbitron">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-cyber-muted line-through mb-1">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Hover Border Glow Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-electric-blue/20 pointer-events-none transition-colors"></div>
    </div>
  );
};

export default ProductCard;
