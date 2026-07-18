export type CartItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
};

export const CART_STORAGE_KEY = 'dona-rosa-cart';
export const CART_EVENT = 'dona-rosa-cart-change';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
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
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1) {
  const cart = readCart();
  const existing = cart.find((entry) => entry.slug === item.slug);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...item, qty });
  }
  writeCart(cart);
  return cart;
}

export function setCartQty(slug: string, qty: number) {
  const cart = readCart()
    .map((item) => (item.slug === slug ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);
  writeCart(cart);
  return cart;
}

export function removeFromCart(slug: string) {
  const cart = readCart().filter((item) => item.slug !== slug);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}
