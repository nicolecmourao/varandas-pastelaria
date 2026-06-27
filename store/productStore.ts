'use client';

import React from 'react';
import { create } from "zustand";
import { Product, CartItem, Addon } from '../types/product';
import productsData from '../data/products.json';

interface ProductState {
  products: Product[];
  cart: CartItem[];
  customerName: string;
  orderType: 'Entrega' | 'Retirada';
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  paymentMethod: 'Pix' | 'Dinheiro' | 'Cartão de crédito' | 'Cartão de débito' | '';
  changeAmount: string;
  notes: string;
  setCustomerName: (name: string) => void;
  setOrderType: (type: 'Entrega' | 'Retirada') => void;
  setStreet: (street: string) => void;
  setNumber: (number: string) => void;
  setNeighborhood: (neighborhood: string) => void;
  setComplement: (complement: string) => void;
  setPaymentMethod: (method: 'Pix' | 'Dinheiro' | 'Cartão de crédito' | 'Cartão de débito' | '') => void;
  setChangeAmount: (value: string) => void;
  setNotes: (notes: string) => void;
  addItem: (product: Product, size: 'P' | 'G', addon?: Addon, observation?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: productsData as Product[],
  cart: [],
  customerName: '',
  orderType: 'Entrega',
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
  paymentMethod: '',
  changeAmount: '',
  notes: '',
  setCustomerName: (name) => set({ customerName: name }),
  setOrderType: (type) => set({ orderType: type }),
  setStreet: (street) => set({ street }),
  setNumber: (number) => set({ number }),
  setNeighborhood: (neighborhood) => set({ neighborhood }),
  setComplement: (complement) => set({ complement }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setChangeAmount: (value) => set({ changeAmount: value }),
  setNotes: (notes) => set({ notes }),
  addItem: (product, size, addon, observation) => {
    const basePrice =
      size === 'G'
        ? product.priceG ?? product.priceP ?? 0
        : product.priceP ?? product.priceG ?? 0;
    const totalPrice = basePrice + (addon?.price ?? 0);

    const uniqueId = `${product.id}-${size}-${addon?.name ?? 'no-addon'}-${observation ?? 'no-obs'}`;
    const existing = get().cart.find((item) => item.id === uniqueId);

    if (existing) {
      set({
        cart: get().cart.map((item) =>
          item.id === uniqueId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
      return;
    }

    set({
      cart: [...get().cart, {
        id: uniqueId,
        productId: product.id,
        name: product.name,
        size,
        price: totalPrice,
        addon,
        observation,
        quantity: 1
      }]
    });
  },
  removeItem: (itemId) => {
    const existing = get().cart.find((item) => item.id === itemId);
    if (!existing) return;
    if (existing.quantity <= 1) {
      set({ cart: get().cart.filter((item) => item.id !== itemId) });
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    });
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      set({ cart: get().cart.filter((item) => item.id !== itemId) });
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    });
  },
  clearCart: () => set({ cart: [] })
}));

export function ProductProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
