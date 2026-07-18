import { useEffect, useState } from 'react';
import { CART_EVENT, getCartCount, readCart } from '../lib/cart';

export default function CartBadge() {
  const [count, setCount] = useState(0);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = getCartCount(readCart());
      setCount((prev) => {
        if (next !== prev) {
          setPop(true);
          window.setTimeout(() => setPop(false), 350);
        }
        return next;
      });
    };

    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-lg bg-[var(--color-berry)] text-white text-xs font-semibold grid place-items-center ${pop ? 'cart-badge-pop' : ''}`}
    >
      {count}
    </span>
  );
}
