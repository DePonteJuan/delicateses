import { useMemo, useState } from 'react';
import type { Product, ProductCategory } from '../lib/types';
import { categoryLabels } from '../lib/types';
import { formatPrice } from '../lib/format';
import AddToCartButton from './AddToCartButton';

type Props = {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
};

const filters: Array<'todas' | ProductCategory> = [
  'todas',
  'galletas',
  'tortas',
  'postres',
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function CategoryFilter({
  products,
  initialCategory,
  initialQuery = '',
}: Props) {
  const start =
    initialCategory && filters.includes(initialCategory as ProductCategory)
      ? (initialCategory as ProductCategory | 'todas')
      : 'todas';
  const [active, setActive] = useState<'todas' | ProductCategory>(start);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const available = products.filter((p) => p.available);
    const byCategory =
      active === 'todas'
        ? available
        : available.filter((p) => p.category === active);

    const needle = normalize(query);
    if (!needle) return byCategory;

    return byCategory.filter((product) => {
      const haystack = normalize(
        [
          product.name,
          product.description,
          categoryLabels[product.category],
        ].join(' '),
      );
      return haystack.includes(needle);
    });
  }, [active, products, query]);

  return (
    <div>
      <div className="mb-5 sm:mb-6">
        <label htmlFor="tienda-buscar" className="sr-only">
          Buscar productos
        </label>
        <div className="relative max-w-xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-berry)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            id="tienda-buscar"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar galletas, tortas, postres..."
            autoComplete="off"
            className="w-full rounded-2xl border border-[var(--color-berry)]/15 bg-white/80 pl-11 pr-4 py-3 text-sm sm:text-base text-[var(--color-cocoa)] placeholder:text-[var(--color-ink-soft)]/70 outline-none transition focus:border-[var(--color-berry)]/40 focus:bg-white focus:ring-2 focus:ring-[var(--color-frost)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
        {filters.map((filter) => {
          const label = filter === 'todas' ? 'Todas' : categoryLabels[filter];
          const isActive = active === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={`chip px-3.5 sm:px-4 py-2 text-xs sm:text-sm tracking-wide ${
                isActive
                  ? 'bg-[var(--color-berry)] text-white'
                  : 'bg-white/70 text-[var(--color-ink-soft)] hover:bg-[var(--color-mousse)]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-ink-soft)] text-sm sm:text-base">
          {query.trim()
            ? `No encontramos resultados para “${query.trim()}”.`
            : 'No hay productos en esta categoría por ahora.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12">
          {filtered.map((product) => (
            <article key={product.slug} className="product-hover group">
              <a href={`/producto/${product.slug}`} className="block mb-4">
                <div className="media-frame aspect-[4/3]">
                  <img
                    src={
                      product.image ?? '/images/products/galletas-de-avena.svg'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </a>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-berry)] mb-2 font-semibold">
                {categoryLabels[product.category]}
              </p>
              <h2 className="font-display italic text-2xl md:text-[1.7rem] text-[var(--color-cocoa)] mb-2 leading-tight">
                <a href={`/producto/${product.slug}`}>{product.name}</a>
              </h2>
              <p className="text-sm text-[var(--color-ink-soft)] line-clamp-2 mb-4 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[var(--color-cocoa)]">
                  {formatPrice(product.price)}
                </span>
                <AddToCartButton
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  available={product.available}
                  className="btn-primary text-sm px-4 py-2"
                  label="Agregar"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
