'use client';

import { useState } from 'react';
import { Product } from '../types/product';
import AddItemModal from './AddItemModal';

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const [showModal, setShowModal] = useState(false);

  const hasP = product.priceP !== undefined;
  const hasG = product.priceG !== undefined;

  const formatPrice = (value?: number) => (value !== undefined ? value.toFixed(2) : '0.00');

  const priceLabel = hasP && hasG
    ? `P R$ ${formatPrice(product.priceP)} | G R$ ${formatPrice(product.priceG)}`
    : hasG
      ? `R$ ${formatPrice(product.priceG)}`
      : `R$ ${formatPrice(product.priceP)}`;

  return (
    <>
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 py-3 px-4 last:border-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{product.description}</p>
          )}
          <p className="mt-2 text-sm font-medium text-slate-700">{priceLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 mt-1 rounded-2xl bg-orange-500 text-white px-4 py-2 text-xs font-semibold transition hover:bg-orange-600"
        >
          Adicionar
        </button>
      </div>

      {showModal && (
        <AddItemModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
