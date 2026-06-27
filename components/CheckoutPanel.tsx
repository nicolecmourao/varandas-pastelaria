'use client';

import { useMemo, useState } from 'react';
import { useProductStore } from '../store/productStore';

const phoneNumber = '5569992289480';
const orderTypes = ['Entrega', 'Retirada'] as const;
const paymentOptions = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito'] as const;
const deliveryFees: Record<string, number> = {
  Centro: 5,
  'Agenor de Carvalho': 7,
  Aponiã: 8,
  Caladinho: 6,
  'Cidade Nova': 10
};

const formatCurrency = (value: number) => value.toFixed(2);

export default function CheckoutPanel() {
  const cart = useProductStore((state) => state.cart);
  const removeItem = useProductStore((state) => state.removeItem);
  const updateQuantity = useProductStore((state) => state.updateQuantity);
  const customerName = useProductStore((state) => state.customerName);
  const [orderType, setOrderType] = useState<'' | 'Entrega' | 'Retirada'>('');
  const street = useProductStore((state) => state.street);
  const number = useProductStore((state) => state.number);
  const neighborhood = useProductStore((state) => state.neighborhood);
  const complement = useProductStore((state) => state.complement);
  const paymentMethod = useProductStore((state) => state.paymentMethod);
  const changeAmount = useProductStore((state) => state.changeAmount);
  const notes = useProductStore((state) => state.notes);
  const setCustomerName = useProductStore((state) => state.setCustomerName);
  const setStreet = useProductStore((state) => state.setStreet);
  const setNumber = useProductStore((state) => state.setNumber);
  const setNeighborhood = useProductStore((state) => state.setNeighborhood);
  const setComplement = useProductStore((state) => state.setComplement);
  const setPaymentMethod = useProductStore((state) => state.setPaymentMethod);
  const setChangeAmount = useProductStore((state) => state.setChangeAmount);
  const setNotes = useProductStore((state) => state.setNotes);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const isDelivery = orderType === 'Entrega';
  const isCash = paymentMethod === 'Dinheiro';
  const deliveryFee = isDelivery && neighborhood ? deliveryFees[neighborhood] ?? 0 : 0;
  const hasDeliveryFee = isDelivery && neighborhood in deliveryFees;
  const total = subtotal + (hasDeliveryFee ? deliveryFee : 0);

  const hasRequiredAddress = street.trim() !== '' && number.trim() !== '' && neighborhood.trim() !== '';
  const canSend =
    customerName.trim() !== '' &&
    orderType !== '' &&
    paymentMethod !== '' &&
    cart.length > 0 &&
    (!isDelivery || hasRequiredAddress) &&
    (!isCash || changeAmount.trim() !== '');

  const itemsText = cart
    .map((item) => {
      let line = `- ${item.quantity}x ${item.name} (${item.size}) - R$ ${formatCurrency(item.price * item.quantity)}`;
      if (item.addon) {
        line += `\n  Acréscimo: ${item.addon.name} (+ R$ ${formatCurrency(item.addon.price)})`;
      }
      if (item.observation) {
        line += `\n  Obs: ${item.observation}`;
      }
      return line;
    })
    .join('\n');

  const messageLines = [
    `Olá, meu nome é ${customerName}.`,
    '',
    `Tipo do pedido: ${orderType}`
  ];

  if (isDelivery) {
    messageLines.push('');
    messageLines.push('Endereço:');
    messageLines.push(`Rua: ${street}`);
    messageLines.push(`Número: ${number}`);
    messageLines.push(`Bairro: ${neighborhood}`);
    if (complement.trim() !== '') {
      messageLines.push(`Complemento/Referência: ${complement}`);
    }
  }

  messageLines.push('');
  messageLines.push(`Forma de pagamento: ${paymentMethod}`);
  if (isCash) {
    messageLines.push(`Troco para: R$ ${changeAmount}`);
  }

  messageLines.push('');
  messageLines.push('Itens:');
  messageLines.push(itemsText);

  messageLines.push('');
  messageLines.push(`Subtotal: R$ ${formatCurrency(subtotal)}`);
  if (isDelivery) {
    messageLines.push(`Taxa de entrega: ${hasDeliveryFee ? `R$ ${formatCurrency(deliveryFee)}` : 'A confirmar'}`);
  }

  let totalText;
  if (isDelivery && !hasDeliveryFee) {
    totalText = `*Total: R$ ${formatCurrency(subtotal)} + taxa de entrega a confirmar*`;
  } else {
    totalText = `*Total: R$ ${formatCurrency(total)}*`;
  }
  messageLines.push(totalText);

  if (notes.trim() !== '') {
    messageLines.push('');
    messageLines.push('Observação:');
    messageLines.push(notes);
  }

  const message = messageLines.join('\n');

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">Checkout</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Finalize seu pedido</h2>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Nome do cliente
          <input
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Ex: João"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </label>

        <div>
          <p className="text-sm font-medium text-slate-700">Tipo de pedido</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {orderTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  orderType === type
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {isDelivery && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Endereço de entrega</p>
            <label className="block text-sm font-medium text-slate-700">
              Rua
              <input
                type="text"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                placeholder="Rua"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Número
              <input
                type="text"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                placeholder="Número"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Bairro
              <input
                type="text"
                value={neighborhood}
                onChange={(event) => setNeighborhood(event.target.value)}
                placeholder="Bairro"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Complemento / Referência
              <input
                type="text"
                value={complement}
                onChange={(event) => setComplement(event.target.value)}
                placeholder="Opcional"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <p className="text-xs text-slate-500">
              {neighborhood && hasDeliveryFee
                ? `Taxa de entrega: R$ ${formatCurrency(deliveryFee)}`
                : neighborhood
                ? 'Taxa de entrega a confirmar pelo WhatsApp'
                : 'Digite o bairro para calcular a taxa de entrega.'}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-slate-700">Forma de pagamento</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {paymentOptions.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  paymentMethod === method
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {isCash && (
          <label className="block text-sm font-medium text-slate-700">
            Troco para quanto?
            <input
              type="number"
              min="0"
              step="0.5"
              value={changeAmount}
              onChange={(event) => setChangeAmount(event.target.value)}
              placeholder="Ex: 50"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Observações do pedido
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ex: Sem cebola, por favor."
            className="mt-2 h-20 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </label>

        {/* Carrinho */}
        {cart.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">Carrinho</p>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-3 border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.quantity}x {item.name} ({item.size})
                      </p>
                      {item.addon && (
                        <p className="text-xs text-slate-600 mt-1">
                          Acréscimo: {item.addon.name} (+ R$ {formatCurrency(item.addon.price)})
                        </p>
                      )}
                      {item.observation && (
                        <p className="text-xs text-slate-600 mt-1">
                          Obs: {item.observation}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                      R$ {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-sm hover:bg-slate-300 transition"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-xs font-semibold text-slate-700">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
        <div className="flex items-center justify-between py-1">
          <span>Subtotal</span>
          <span>R$ {formatCurrency(subtotal)}</span>
        </div>
        {isDelivery && (
          <div className="flex items-center justify-between py-1">
            <span>Taxa de entrega</span>
            <span>
              {hasDeliveryFee ? `R$ ${formatCurrency(deliveryFee)}` : 'A confirmar'}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between py-1">
          <span>Total</span>
          <strong>R$ {formatCurrency(total)}</strong>
        </div>
      </div>

      <div className="mt-4 text-sm text-red-600">
        {!canSend && 'Preencha todos os campos obrigatórios antes de enviar.'}
      </div>

      <button
        type="button"
        onClick={() => canSend && window.open(whatsappUrl, '_blank')}
        disabled={!canSend}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-3xl px-5 py-4 text-center text-sm font-semibold transition ${
          canSend
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
        }`}
      >
        Enviar para WhatsApp
      </button>
    </section>
  );
}
