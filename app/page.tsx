'use client';

import CartSummary from '../components/CartSummary';
import CheckoutPanel from '../components/CheckoutPanel';
import FloatingCartButton from '../components/FloatingCartButton';
import MenuGrid from '../components/MenuGrid';
import { ProductProvider, useProductStore } from '../store/productStore';

function PageContent() {
  const cart = useProductStore((state) => state.cart);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 pb-24 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">Varandas Pastelaria</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Faça seu pedido</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Escolha seus pastéis, sucos naturais e bebidas, depois envie seu pedido direto para o WhatsApp.
              </p>
            </div>
            <div className="rounded-3xl bg-orange-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-orange-100 sm:px-5">
              <p className="text-sm font-medium">Rápido e sem cadastro</p>
              <p className="text-xs text-slate-600">A cada atualização o total reflete na hora.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6">
            <MenuGrid />
          </section>
          <aside className="space-y-6">
            <div id="cart-section">
              <CartSummary />
            </div>
            {cart.length > 0 && <CheckoutPanel />}
          </aside>
        </div>
      </div>
      <FloatingCartButton />
    </main>
  );
}

export default function Home() {
  return (
    <ProductProvider>
      <PageContent />
    </ProductProvider>
  );
}
