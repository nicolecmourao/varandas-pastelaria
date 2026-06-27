'use client';

import { useMemo } from 'react';
import { useProductStore } from '../store/productStore';

export default function CartSummary() {
  const cart = useProductStore((state) => state.cart);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">Carrinho</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Seu pedido</h2>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
          {cart.length} {cart.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-sm leading-6 text-slate-600">Adicione um item para começar seu pedido.</p>
        ) : (
          cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="rounded-3xl bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{item.name} • {item.size}</p>
                  <p className="mt-1 text-xs text-slate-500">Qtd: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">R$ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Total</span>
          <strong className="text-base text-slate-950">R$ {total.toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}
