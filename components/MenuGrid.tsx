'use client';

import { useMemo } from 'react';
import CategoryAccordion from './CategoryAccordion';
import { useProductStore } from '../store/productStore';
import { Category } from '../types/product';

const categories: Category[] = [
  'Pastéis Salgados',
  'Pastéis Doces',
  'Saltenhas',
  'Bebidas',
  'Sucos Naturais'
];

const getMinPrice = (priceP?: number, priceG?: number): number => {
  if (priceP !== undefined && priceG !== undefined) {
    return Math.min(priceP, priceG);
  }
  return priceP ?? priceG ?? 0;
};

export default function MenuGrid() {
  const products = useProductStore((state) => state.products);

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        category,
        items: products
          .filter((product) => product.category === category)
          .sort((a, b) => getMinPrice(a.priceP, a.priceG) - getMinPrice(b.priceP, b.priceG))
      })),
    [products]
  );

  return (
    <div className="space-y-4">
      {grouped.map((group, index) => (
        <CategoryAccordion
          key={group.category}
          category={group.category}
          items={group.items}
          defaultOpen={group.category === 'Pastéis Salgados'}
        />
      ))}
    </div>
  );
}
