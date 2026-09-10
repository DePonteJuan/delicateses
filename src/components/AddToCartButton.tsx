import { useState } from 'react';
import { addToCart } from '../lib/cart';
import type { ProductSize } from '../lib/types';
import { formatPrice } from '../lib/format';

type Props = {
  slug: string;
  name: string;
  price: number;
  sizes?: ProductSize[];
  isCustomOrder?: boolean;
  available?: boolean;
  className?: string;
  label?: string;
  compact?: boolean;
};

export default function AddToCartButton({
  slug,
  name,
  price,
  sizes = [],
  isCustomOrder = false,
  available = true,
  className = '',
  label,
  compact = false,
}: Props) {
  const hasSizes = sizes.length > 0;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = hasSizes ? sizes[sizeIndex] : null;
  const unitPrice = selectedSize?.price ?? price;
  const defaultLabel = isCustomOrder
    ? 'Agregar solicitud'
    : compact
      ? 'Agregar'
      : 'Agregar al carrito';

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

  const onAdd = () => {
    addToCart(
      {
        slug,
        name,
        price: isCustomOrder ? 0 : unitPrice,
        size: selectedSize?.label,
        isCustomOrder,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const controls = (
    <>
      {hasSizes && (
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink-soft)]">
          <span className="font-semibold text-[var(--color-cocoa)]">Tamaño</span>
          <select
            value={sizeIndex}
            onChange={(event) => setSizeIndex(Number(event.target.value))}
            className="rounded-xl border border-[var(--color-berry)]/25 bg-white/90 px-3 py-2 text-[var(--color-cocoa)] outline-none focus:ring-2 focus:ring-[var(--color-frost)]"
          >
            {sizes.map((size, index) => (
              <option key={size.label} value={index}>
                {size.label} — {formatPrice(size.price)}
              </option>
            ))}
          </select>
        </label>
      )}

      {(hasSizes || isCustomOrder) && (
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink-soft)]">
          <span className="font-semibold text-[var(--color-cocoa)]">Cantidad</span>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(event) => {
              const next = Number(event.target.value);
              setQty(Number.isNaN(next) || next < 1 ? 1 : next);
            }}
            className="w-24 rounded-xl border border-[var(--color-berry)]/25 bg-white/90 px-3 py-2 text-[var(--color-cocoa)] outline-none focus:ring-2 focus:ring-[var(--color-frost)]"
          />
        </label>
      )}
    </>
  );

  if (compact && !hasSizes && !isCustomOrder) {
    return (
      <button type="button" className={className} onClick={onAdd}>
        {added ? 'Agregado ✓' : label ?? defaultLabel}
      </button>
    );
  }

  if (compact) {
    return (
      <div className="flex w-full flex-col gap-3">
        {controls}
        {!isCustomOrder && hasSizes && (
          <p className="text-sm font-semibold text-[var(--color-cocoa)]">
            {formatPrice(unitPrice)}
          </p>
        )}
        {isCustomOrder && (
          <p className="text-sm font-semibold text-[var(--color-berry-deep)]">
            Precio según petición
          </p>
        )}
        <button type="button" className={className} onClick={onAdd}>
          {added ? 'Agregado ✓' : label ?? defaultLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {controls}
      <button type="button" className={className} onClick={onAdd}>
        {added ? 'Agregado ✓' : label ?? defaultLabel}
      </button>
    </div>
  );
}
