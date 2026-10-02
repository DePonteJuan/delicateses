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
  customReference?: string;
  /** Si true, el cliente escribe su idea (sin referencia de galería). */
  freeformCustom?: boolean;
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
  customReference,
  freeformCustom = false,
  available = true,
  className = '',
  label,
  compact = false,
}: Props) {
  const hasSizes = sizes.length > 0;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [idea, setIdea] = useState('');
  const [added, setAdded] = useState(false);

  const selectedSize = hasSizes ? sizes[sizeIndex] : null;
  const unitPrice = selectedSize?.price ?? price;
  const needsIdea = isCustomOrder && freeformCustom && !customReference;
  const defaultLabel = isCustomOrder
    ? needsIdea
      ? 'Agregar petición'
      : 'Agregar solicitud'
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
    const trimmedIdea = idea.trim();
    if (needsIdea && !trimmedIdea) return;

    addToCart(
      {
        slug: isCustomOrder ? 'encargo-personalizado' : slug,
        name,
        price: isCustomOrder ? price : unitPrice,
        size: selectedSize?.label,
        isCustomOrder,
        customReference: needsIdea
          ? trimmedIdea
          : customReference,
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

      {needsIdea && (
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink-soft)]">
          <span className="font-semibold text-[var(--color-cocoa)]">
            Describe tu idea
          </span>
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            rows={compact ? 3 : 4}
            placeholder="Ej.: torta de unicornio, 20 porciones, colores pastel, nombre Ana…"
            className="w-full resize-y rounded-xl border border-[var(--color-berry)]/25 bg-white/90 px-3 py-2 text-[var(--color-cocoa)] outline-none focus:ring-2 focus:ring-[var(--color-frost)]"
          />
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
            {price > 0 ? `Desde ${formatPrice(price)}` : 'Precio según petición'}
          </p>
        )}
        <button
          type="button"
          className={className}
          onClick={onAdd}
          disabled={needsIdea && !idea.trim()}
        >
          {added ? 'Agregado ✓' : label ?? defaultLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {controls}
      <button
        type="button"
        className={className}
        onClick={onAdd}
        disabled={needsIdea && !idea.trim()}
      >
        {added ? 'Agregado ✓' : label ?? defaultLabel}
      </button>
    </div>
  );
}
