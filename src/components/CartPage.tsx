import { useEffect, useMemo, useState } from 'react';
import {
  clearCart,
  readCart,
  removeFromCart,
  setCartQty,
  type CartItem,
  CART_EVENT,
  getCartTotal,
} from '../lib/cart';
import { buildOrderMessage, buildWhatsAppUrl, formatPrice } from '../lib/whatsapp';

type Props = {
  whatsappNumber: string;
  paymentNote: string;
  orderGreeting: string;
};

export default function CartPage({
  whatsappNumber,
  paymentNote,
  orderGreeting,
}: Props) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const total = useMemo(() => getCartTotal(items), [items]);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return null;
    const message = buildOrderMessage({
      greeting: orderGreeting,
      items,
      paymentNote,
    });
    return buildWhatsAppUrl(whatsappNumber, message);
  }, [items, orderGreeting, paymentNote, whatsappNumber]);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="font-display italic text-4xl md:text-5xl text-[var(--color-cocoa)] mb-4">
          Tu carrito
        </h1>
        <p className="text-[var(--color-ink-soft)] mb-8 leading-relaxed">
          Aún no hay dulces aquí. Explora la tienda y arma tu pedido.
        </p>
        <a
          href="/tienda"
          className="btn-primary inline-flex items-center justify-center px-7 py-3"
        >
          Ver tienda
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display italic text-4xl md:text-5xl text-[var(--color-cocoa)] mb-2">
        Tu carrito
      </h1>
      <p className="text-[var(--color-ink-soft)] mb-10 leading-relaxed">
        Revisa tu pedido y envíalo por WhatsApp para confirmarlo.
      </p>

      <ul className="space-y-2 mb-10">
        {items.map((item) => (
          <li
            key={item.slug}
            className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 px-4 rounded-2xl bg-white/55 border border-[var(--color-berry)]/10"
          >
            <div className="flex-1">
              <p className="font-display italic text-xl text-[var(--color-cocoa)]">
                {item.name}
              </p>
              <p className="text-sm text-[var(--color-ink-soft)]">
                {formatPrice(item.price)} c/u
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor={`qty-${item.slug}`}>
                Cantidad de {item.name}
              </label>
              <input
                id={`qty-${item.slug}`}
                type="number"
                min={1}
                value={item.qty}
                onChange={(event) => {
                  const qty = Number(event.target.value);
                  setItems(setCartQty(item.slug, Number.isNaN(qty) ? 1 : qty));
                }}
                className="w-16 border border-[var(--color-berry)]/20 bg-[var(--color-vanilla)] rounded-xl px-2 py-1.5 text-center"
              />
              <p className="w-20 text-right font-semibold text-[var(--color-cocoa)]">
                {formatPrice(item.price * item.qty)}
              </p>
              <button
                type="button"
                onClick={() => setItems(removeFromCart(item.slug))}
                className="text-sm text-[var(--color-berry)] underline-offset-2 hover:underline"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-ink-soft)] mb-1 font-semibold">
            Total
          </p>
          <p className="font-display italic text-4xl text-[var(--color-cocoa)]">
            {formatPrice(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearCart();
            setItems([]);
          }}
          className="text-sm text-[var(--color-ink-soft)] underline-offset-2 hover:underline self-start sm:self-auto"
        >
          Vaciar carrito
        </button>
      </div>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 rounded-[0.9rem] bg-[#25D366] text-white font-semibold tracking-wide hover:brightness-105 transition"
        >
          Enviar pedido por WhatsApp
        </a>
      ) : (
        <p className="text-[var(--color-berry-deep)] bg-[var(--color-mousse)] border border-[var(--color-berry)]/25 rounded-2xl px-4 py-3">
          Configura el número de WhatsApp en{' '}
          <code className="text-sm">PUBLIC_WHATSAPP_NUMBER</code> o en Keystatic
          (Configuración del sitio) para enviar pedidos.
        </p>
      )}

      <p className="mt-6 text-sm text-[var(--color-ink-soft)] max-w-xl leading-relaxed">
        {paymentNote}
      </p>
    </div>
  );
}
