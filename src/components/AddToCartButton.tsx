import { useState } from 'react';
import { addToCart } from '../lib/cart';

type Props = {
  slug: string;
  name: string;
  price: number;
  available?: boolean;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  slug,
  name,
  price,
  available = true,
  className = '',
  label = 'Agregar al carrito',
}: Props) {
  const [added, setAdded] = useState(false);

  if (!available) {
    return (
      <button
        type="button"
        disabled
        className={`opacity-50 cursor-not-allowed ${className}`}
      >
        Agotado
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addToCart({ slug, name, price });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      {added ? 'Agregado ✓' : label}
    </button>
  );
}
