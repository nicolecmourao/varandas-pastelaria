export type Category =
  | 'Pastéis Salgados'
  | 'Pastéis Doces'
  | 'Saltenhas'
  | 'Bebidas'
  | 'Sucos Naturais';

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  priceP?: number;
  priceG?: number;
}

export interface Addon {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: 'P' | 'G';
  price: number;
  addon?: Addon;
  observation?: string;
  quantity: number;
}
