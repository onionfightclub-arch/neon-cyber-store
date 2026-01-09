
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  tags: string[];
  isNew?: boolean;
  onSale?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export enum AppRoute {
  HOME = '/',
  PRODUCT = '/product',
  CATEGORY = '/category',
  CART = '/cart',
  HOLDING = '/holding'
}
