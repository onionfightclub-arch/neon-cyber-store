
import { Product, Category } from './types.ts';

export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'CYBER-CORE', image: 'https://picsum.photos/seed/cyber1/600/400' },
  { id: 'fashion', name: 'NEO-WEAR', image: 'https://picsum.photos/seed/cyber2/600/400' },
  { id: 'gadgets', name: 'AUGMENTS', image: 'https://picsum.photos/seed/cyber3/600/400' },
  { id: 'vehicles', name: 'DRIFTERS', image: 'https://picsum.photos/seed/cyber4/600/400' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neural Link V2',
    description: 'Direct cortex interface with 10ms latency. Includes subconscious backup and mood filtering.',
    price: 1299.99,
    originalPrice: 1599.99,
    image: 'https://picsum.photos/seed/neural/400/500',
    category: 'electronics',
    rating: 4.8,
    tags: ['Cybernetic', 'Elite'],
    onSale: true,
    isNew: true
  },
  {
    id: '2',
    name: 'Holo-Visor G-7',
    description: 'Augmented reality overlay with thermal vision and tactical drone integration.',
    price: 450.00,
    image: 'https://picsum.photos/seed/visor/400/500',
    category: 'electronics',
    rating: 4.5,
    tags: ['Tactical', 'Visual']
  },
  {
    id: '3',
    name: 'Stealth Weave Trench',
    description: 'Light-bending fabric provides 90% invisibility in low-light environments. Waterproof.',
    price: 899.00,
    image: 'https://picsum.photos/seed/trench/400/500',
    category: 'fashion',
    rating: 4.9,
    tags: ['Stealth', 'Premium']
  },
  {
    id: '4',
    name: 'Neon Kinetic Boots',
    description: 'Energy-harvesting footwear that glows with every step. Boosts jump height by 15%.',
    price: 299.00,
    originalPrice: 350.00,
    image: 'https://picsum.photos/seed/boots/400/500',
    category: 'fashion',
    rating: 4.2,
    tags: ['Kinetic', 'Glow'],
    onSale: true
  },
  {
    id: '5',
    name: 'Plasma Cutter Tool',
    description: 'Industrial-grade precision tool. Slices through steel like butter.',
    price: 150.00,
    image: 'https://picsum.photos/seed/cutter/400/500',
    category: 'gadgets',
    rating: 4.7,
    tags: ['Industrial']
  },
  {
    id: '6',
    name: 'Cipher Hand Augment',
    description: 'Finger-tip based decryption interface. Bypass level 3 security protocols.',
    price: 2100.00,
    image: 'https://picsum.photos/seed/cipher/400/500',
    category: 'gadgets',
    rating: 5.0,
    tags: ['Hack-Ready', 'Illegal-ish'],
    isNew: true
  }
];
