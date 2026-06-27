'use client';

import { useState } from 'react';
import { Product } from '../types/product';
import ProductListItem from './ProductListItem';

interface CategoryAccordionProps {
  category: string;
  items: Product[];
  defaultOpen?: boolean;
}

export default function CategoryAccordion({
  category,
  items,
  defaultOpen = false
}: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            {category}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-950">{category}</h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {items.length}
            </span>
          </div>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-lg font-bold text-slate-700 transition">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-200">
          <div>
            {items.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
