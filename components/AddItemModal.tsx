'use client';

import { useState, useEffect } from 'react';
import { Product, Addon } from '../types/product';
import { useProductStore } from '../store/productStore';

interface AddItemModalProps {
  product: Product;
  onClose: () => void;
}

const SPECIAL_ADDONS = ['Camarão', 'Carne de sol', 'Palmito', 'Azeitona', 'Bacon'];

const ADDON_OPTIONS: Record<'Pastéis Salgados' | 'Pastéis Doces' | 'Sucos Naturais', Record<'P' | 'G', Addon[]>> = {
  'Pastéis Salgados': {
    'P': [
      ...SPECIAL_ADDONS.map(name => ({ name, price: 3 })),
      { name: 'Outros sabores', price: 2 }
    ],
    'G': [
      ...SPECIAL_ADDONS.map(name => ({ name, price: 4 })),
      { name: 'Outros sabores', price: 3 }
    ]
  },
  'Pastéis Doces': {
    'P': [],
    'G': []
  },
  'Sucos Naturais': {
    'P': [{ name: 'Leite', price: 2 }],
    'G': [{ name: 'Leite', price: 2 }]
  }
};

const NO_SIZE_CATEGORIES = ['Saltenhas', 'Bebidas', 'Sucos Naturais'];

export default function AddItemModal({ product, onClose }: AddItemModalProps) {
  const [selectedSize, setSelectedSize] = useState<'P' | 'G' | ''>('');
  const [selectedAddon, setSelectedAddon] = useState<Addon | undefined>();
  const [observation, setObservation] = useState('');
  const addItem = useProductStore((state) => state.addItem);

  const hasP = product.priceP !== undefined;
  const hasG = product.priceG !== undefined;
  const isSaltedPastel = product.category === 'Pastéis Salgados';
  const isSuco = product.category === 'Sucos Naturais';
  const hasNoSize = NO_SIZE_CATEGORIES.includes(product.category);

  // Auto-select size for categories without size option
  useEffect(() => {
    if (hasNoSize) {
      setSelectedSize('P');
    }
  }, [hasNoSize]);

  const showAddons = (isSaltedPastel || isSuco) && selectedSize;
  const availableAddons = selectedSize && showAddons
    ? ADDON_OPTIONS[product.category as 'Pastéis Salgados' | 'Sucos Naturais']?.[selectedSize] || []
    : [];

  const formatPrice = (value?: number) => (value !== undefined ? value.toFixed(2) : '0.00');
  const basePrice = selectedSize === 'G'
    ? product.priceG ?? product.priceP ?? 0
    : product.priceP ?? product.priceG ?? 0;
  const totalPrice = basePrice + (selectedAddon?.price ?? 0);

  const handleConfirm = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedAddon, observation || undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Seleção de Tamanho - Apenas se tiver múltiplos tamanhos */}
        {!hasNoSize && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">Tamanho</p>
            <div className="grid grid-cols-2 gap-3">
              {hasP && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSize('P');
                    setSelectedAddon(undefined);
                  }}
                  className={`p-4 rounded-2xl border-2 transition ${
                    selectedSize === 'P'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">Pequeno</p>
                  <p className="text-sm text-slate-600">R$ {formatPrice(product.priceP)}</p>
                </button>
              )}
              {hasG && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSize('G');
                    setSelectedAddon(undefined);
                  }}
                  className={`p-4 rounded-2xl border-2 transition ${
                    selectedSize === 'G'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">Grande</p>
                  <p className="text-sm text-slate-600">R$ {formatPrice(product.priceG)}</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Acréscimos Opcionais */}
        {showAddons && availableAddons.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">Acréscimo (Opcional)</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedAddon(undefined)}
                className={`w-full p-3 rounded-2xl border-2 transition text-left ${
                  selectedAddon === undefined
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <p className="text-sm font-medium text-slate-900">Sem acréscimo</p>
              </button>
              {availableAddons.map((addon) => (
                <button
                  key={addon.name}
                  type="button"
                  onClick={() => setSelectedAddon(addon)}
                  className={`w-full p-3 rounded-2xl border-2 transition text-left ${
                    selectedAddon?.name === addon.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{addon.name}</p>
                    <p className="text-sm text-slate-600">+ R$ {formatPrice(addon.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Observação do Item */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">Observação (Opcional)</p>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Ex: Sem cebola, bem frito..."
            className="w-full p-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            rows={3}
          />
        </div>

        {/* Total */}
        <div className="mb-6 bg-slate-50 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Total:</p>
            <p className="text-lg font-semibold text-slate-900">R$ {formatPrice(totalPrice)}</p>
          </div>
        </div>

        {/* Botão Confirmar */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedSize}
          className={`w-full py-3 rounded-2xl font-semibold transition ${
            selectedSize
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
