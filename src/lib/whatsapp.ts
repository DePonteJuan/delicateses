import type { CartItem } from './cart';
import { getCartTotal } from './cart';

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function formatLineItem(item: CartItem) {
  const sizePart = item.size ? ` (${item.size})` : '';

  if (item.isCustomOrder) {
    const ref = item.customReference
      ? ` — referencia: ${item.customReference}`
      : '';
    const guide =
      item.price > 0
        ? ` (precio orientativo ${formatPrice(item.price)})`
        : '';
    return `• ${item.qty}x Encargo personalizado${ref}${guide} — a cotizar`;
  }

  return `• ${item.qty}x ${item.name}${sizePart} — ${formatPrice(item.price * item.qty)}`;
}

export function buildOrderMessage({
  greeting,
  items,
}: {
  greeting: string;
  items: CartItem[];
}) {
  const lines = items.map(formatLineItem);
  const hasCustom = items.some((item) => item.isCustomOrder);
  const pricedTotal = getCartTotal(items);
  const totalLine = hasCustom
    ? `Total catalogado: ${formatPrice(pricedTotal)} (+ encargo a cotizar)`
    : `Total: ${formatPrice(pricedTotal)}`;

  const footer = hasCustom
    ? ['Nombre:', 'Zona/entrega:', 'Referencia del encargo:', 'Notas:']
    : ['Nombre:', 'Zona/entrega:', 'Notas:'];

  return [greeting, '', ...lines, '', totalLine, '', ...footer].join('\n');
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
