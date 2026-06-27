'use client';

import { useMemo } from 'react';
import { useProductStore } from '../store/productStore';

export default function FloatingCartButton() {
  const cart = useProductStore((state) => state.cart);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  if (cart.length === 0) {
    return null;
  }

  const handleClick = () => {
    document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border border-orange-200 bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(249,115,22,0.35)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] md:hidden"
      aria-label={`Ver carrinho com ${totalItems} item${totalItems === 1 ? '' : 's'}`}
    >
      <span className="text-lg" aria-hidden="true">
        🛒
      </span>
      <span className="flex flex-col items-start leading-none">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-100">Ver carrinho</span>
        <span className="mt-1 text-sm font-semibold">({totalItems})</span>
      </span>
    </button>
  );
}
