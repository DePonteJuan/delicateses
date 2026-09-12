export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  isCustomOrder?: boolean;
  /** Referencia elegida de la galería de encargos */
  customReference?: string;
};

export const CART_STORAGE_KEY = 'dona-rosa-cart';
export const CART_EVENT = 'dona-rosa-cart-change';

export function cartItemId(slug: string, size?: string, customReference?: string) {
  if (customReference) return `${slug}::ref::${customReference}`;
  return size ? `${slug}::${size}` : slug;
}

function normalizeCartItem(raw: Partial<CartItem> & { slug: string }): CartItem | null {
  if (!raw.slug || typeof raw.name !== 'string') return null;
  const size = typeof raw.size === 'string' && raw.size ? raw.size : undefined;
  const customReference =
    typeof raw.customReference === 'string' && raw.customReference
      ? raw.customReference
      : undefined;
  return {
    id: raw.id || cartItemId(raw.slug, size, customReference),
    slug: raw.slug,
    name: raw.name,
    price: typeof raw.price === 'number' ? raw.price : 0,
    qty: typeof raw.qty === 'number' && raw.qty > 0 ? raw.qty : 1,
    size,
    isCustomOrder: Boolean(raw.isCustomOrder),
    customReference,
  };
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CartItem>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) =>
        item?.slug ? normalizeCartItem(item as Partial<CartItem> & { slug: string }) : null,
      )
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function getCartCount(items: CartItem[] = readCart()) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal(items: CartItem[] = readCart()) {
  return items.reduce((sum, item) => {
    if (item.isCustomOrder) return sum;
    return sum + item.price * item.qty;
  }, 0);
}

export function addToCart(
  item: Omit<CartItem, 'qty' | 'id'> & { id?: string },
  qty = 1,
) {
  const cart = readCart();
  const id = item.id || cartItemId(item.slug, item.size, item.customReference);
  const existing = cart.find((entry) => entry.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      qty,
      size: item.size,
      isCustomOrder: item.isCustomOrder,
      customReference: item.customReference,
    });
  }
  writeCart(cart);
  return cart;
}

export function setCartQty(id: string, qty: number) {
  const cart = readCart()
    .map((item) => (item.id === id ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);
  writeCart(cart);
  return cart;
}

export function removeFromCart(id: string) {
  const cart = readCart().filter((item) => item.id !== id);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}
