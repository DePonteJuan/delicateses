import type { CartItem } from './cart';
import { getCartTotal } from './cart';

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function buildOrderMessage({
  greeting,
  items,
  paymentNote,
}: {
  greeting: string;
  items: CartItem[];
  paymentNote: string;
}) {
  const lines = items.map(
    (item) =>
      `• ${item.qty}x ${item.name} — ${formatPrice(item.price * item.qty)}`,
  );

  return [
    greeting,
    '',
    ...lines,
    '',
    `Total: ${formatPrice(getCartTotal(items))}`,
    '',
    paymentNote,
    '',
    'Nombre:',
    'Zona/entrega:',
    'Notas:',
  ].join('\n');
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
