import { useMemo, useState, type ReactNode } from 'react';
import type { Product, ProductCategory } from '../lib/types';
import { categoryLabels, productDisplayPrice } from '../lib/types';
import {
  customOrderExamples,
  customOrderSlug,
} from '../lib/customOrders';
import { CUSTOM_ORDER_SLUG } from '../lib/types';
import { formatPrice } from '../lib/format';
import AddToCartButton from './AddToCartButton';

type ShopFilter = 'todas' | ProductCategory | 'encargos';

type Props = {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
};

const filters: ShopFilter[] = [
  'todas',
  'galletas',
  'tortas',
  'postres',
  'encargos',
];

const filterLabels: Record<ShopFilter, string> = {
  todas: 'Todas',
  galletas: 'Galletas',
  tortas: 'Tortas',
  postres: 'Postres',
  encargos: 'Encargos',
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function priceLabel(product: Product) {
  if (product.isCustomOrder) return 'A cotizar';
  if (product.sizes.length > 0) {
    return `Desde ${formatPrice(productDisplayPrice(product))}`;
  }
  return formatPrice(product.price);
}

function ProductTile({
  product,
  dense = false,
}: {
  product: Product;
  dense?: boolean;
}) {
  const needsOptions = product.isCustomOrder || product.sizes.length > 0;

  return (
    <article className="product-hover group flex h-full flex-col">
      <a href={`/producto/${product.slug}`} className="mb-3 block shrink-0">
        <div
          className={`media-frame ${dense ? 'aspect-square' : 'aspect-[4/5] sm:aspect-[4/3]'}`}
        >
          <img
            src={product.image ?? '/images/products/galleta-de-miel.jpg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </a>
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-berry-deep)] sm:text-xs">
          {categoryLabels[product.category]}
        </p>
        <h2
          className={`mb-1 line-clamp-2 min-h-[2.6em] font-display italic leading-tight text-[var(--color-cocoa)] ${
            dense ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
          }`}
        >
          <a href={`/producto/${product.slug}`}>{product.name}</a>
        </h2>
        {!dense && product.description ? (
          <p className="mb-3 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {product.description}
          </p>
        ) : (
          <p className="mb-3 min-h-[1.5rem] text-sm font-semibold text-[var(--color-cocoa)] sm:text-base">
            {priceLabel(product)}
          </p>
        )}
        <div className="mt-auto">
          {needsOptions ? (
            <AddToCartButton
              slug={product.slug}
              name={product.name}
              price={product.price}
              sizes={product.sizes}
              isCustomOrder={product.isCustomOrder}
              available={product.available}
              className="btn-primary w-full px-4 py-2 text-sm"
              compact
            />
          ) : (
            <div className="flex items-center justify-between gap-2">
              {!dense ? (
                <span className="font-semibold text-[var(--color-cocoa)]">
                  {priceLabel(product)}
                </span>
              ) : (
                <span />
              )}
              <AddToCartButton
                slug={product.slug}
                name={product.name}
                price={product.price}
                available={product.available}
                className="btn-primary px-3 py-2 text-sm"
                label="Agregar"
                compact
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Section({
  title,
  subtitle,
  children,
  gridClass,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  gridClass: string;
}) {
  return (
    <section className="mb-12 sm:mb-16">
      <div className="mb-5 sm:mb-6">
        <h2 className="font-display italic text-3xl sm:text-4xl text-[var(--color-cocoa)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{subtitle}</p>
        ) : null}
      </div>
      <div className={gridClass}>{children}</div>
    </section>
  );
}

function EncargosGallery({ query }: { query: string }) {
  const freeformHref = `/producto/${CUSTOM_ORDER_SLUG}`;
  const needle = normalize(query);
  const matchesFreeform =
    !needle ||
    normalize(
      'peticion personalizada encargo idea propia a medida cotizar',
    ).includes(needle);

  const examples = useMemo(() => {
    const q = normalize(query);
    if (!q) return customOrderExamples;
    return customOrderExamples.filter((ex) =>
      normalize(`${ex.name} ${ex.description} encargo personalizado`).includes(
        q,
      ),
    );
  }, [query]);

  if (!matchesFreeform && examples.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-soft)]">
        No hay referencias que coincidan con la búsqueda.
      </p>
    );
  }

  return (
    <section className="mb-12 sm:mb-16">
      <div className="mb-5 max-w-2xl sm:mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-berry-deep)]">
          A pedido
        </p>
        <h2 className="mb-2 font-display italic text-3xl text-[var(--color-cocoa)] sm:text-4xl">
          Encargos personalizados
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
          Puedes pedir una idea tuya desde cero, o elegir una referencia de la
          galería con precio orientativo. Confirmamos el valor final por
          WhatsApp.
        </p>
      </div>

      {matchesFreeform && (
        <a
          href={freeformHref}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border border-[var(--color-berry)]/20 bg-[var(--color-berry)]/10 px-5 py-5 sm:px-6 sm:py-6 transition-colors hover:bg-[var(--color-berry)]/15"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-berry-deep)] mb-1.5">
              Sin referencia
            </p>
            <h3 className="font-display italic text-2xl sm:text-3xl text-[var(--color-cocoa)] leading-tight mb-2">
              Petición personalizada
            </h3>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
              Describe tu idea a medida — temática, tamaño y detalles — sin
              basarte en los ejemplos de abajo. Cotizamos por WhatsApp.
            </p>
          </div>
          <span className="btn-primary shrink-0 px-5 py-3 text-sm text-center">
            Crear petición
          </span>
        </a>
      )}

      {examples.length > 0 && (
        <>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
            O elige una referencia
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {examples.map((ex) => {
              const href = `/producto/${customOrderSlug(ex.id)}`;
              return (
                <article
                  key={ex.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-berry)]/10 bg-white/60"
                >
                  <a href={href} className="block shrink-0">
                    <div className="media-frame aspect-square rounded-none">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </a>
                  <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                    <h3 className="mb-1 line-clamp-2 min-h-[2.5em] font-display italic text-base leading-snug text-[var(--color-cocoa)] sm:text-lg">
                      <a href={href}>{ex.name}</a>
                    </h3>
                    <p className="mb-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-[var(--color-ink-soft)] sm:text-sm">
                      {ex.description}
                    </p>
                    <p className="mb-3 text-sm font-semibold text-[var(--color-berry-deep)]">
                      Desde {formatPrice(ex.price)}
                    </p>
                    <a
                      href={href}
                      className="btn-primary mt-auto w-full px-3 py-2 text-center text-xs sm:text-sm"
                    >
                      Ver y pedir
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default function CategoryFilter({
  products,
  initialCategory,
  initialQuery = '',
}: Props) {
  const start: ShopFilter =
    initialCategory && filters.includes(initialCategory as ShopFilter)
      ? (initialCategory as ShopFilter)
      : 'todas';
  const [active, setActive] = useState<ShopFilter>(start);
  const [query, setQuery] = useState(initialQuery);

  const available = useMemo(
    () => products.filter((p) => p.available && !p.isCustomOrder),
    [products],
  );

  const matchesQuery = (product: Product) => {
    const needle = normalize(query);
    if (!needle) return true;
    return normalize(
      [product.name, product.description, categoryLabels[product.category]].join(
        ' ',
      ),
    ).includes(needle);
  };

  const galletas = available.filter(
    (p) => p.category === 'galletas' && matchesQuery(p),
  );
  const tortas = available.filter(
    (p) => p.category === 'tortas' && matchesQuery(p),
  );
  const postres = available.filter(
    (p) => p.category === 'postres' && matchesQuery(p),
  );

  const showEncargos = active === 'todas' || active === 'encargos';
  const showGalletas =
    (active === 'todas' || active === 'galletas') && galletas.length > 0;
  const showTortas =
    (active === 'todas' || active === 'tortas') && tortas.length > 0;
  const showPostres =
    (active === 'todas' || active === 'postres') && postres.length > 0;

  const empty =
    !showEncargos && !showGalletas && !showTortas && !showPostres
      ? false
      : active === 'encargos'
        ? false
        : !showGalletas &&
          !showTortas &&
          !showPostres &&
          active !== 'todas' &&
          active !== 'encargos';

  const nothingVisible =
    !showEncargos &&
    !showGalletas &&
    !showTortas &&
    !showPostres &&
    active !== 'encargos';

  return (
    <div>
      <div className="mb-5 sm:mb-6">
        <label htmlFor="tienda-buscar" className="sr-only">
          Buscar productos
        </label>
        <div className="relative max-w-xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-berry-deep)]"
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
            placeholder="Buscar por nombre o categoría..."
            autoComplete="off"
            className="w-full rounded-2xl border border-[var(--color-berry)]/15 bg-white/80 pl-11 pr-4 py-3 text-sm sm:text-base text-[var(--color-cocoa)] placeholder:text-[var(--color-ink-soft)]/70 outline-none transition focus:border-[var(--color-berry)]/40 focus:bg-white focus:ring-2 focus:ring-[var(--color-frost)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
        {filters.map((filter) => {
          const isActive = active === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={`chip px-3.5 sm:px-4 py-2 text-xs sm:text-sm tracking-wide ${
                isActive
                  ? 'bg-[var(--color-berry)] text-[var(--color-cocoa)]'
                  : 'bg-white/70 text-[var(--color-ink-soft)] hover:bg-[var(--color-mousse)]'
              }`}
            >
              {filterLabels[filter]}
            </button>
          );
        })}
      </div>

      {nothingVisible || empty ? (
        <p className="text-[var(--color-ink-soft)] text-sm sm:text-base">
          {query.trim()
            ? `No encontramos resultados para “${query.trim()}”.`
            : 'No hay productos en esta categoría por ahora.'}
        </p>
      ) : (
        <>
          {showEncargos ? <EncargosGallery query={query} /> : null}

          {showGalletas ? (
            <Section
              title="Galletas"
              subtitle="Por 1/4, 1/2 o 1 kilo"
              gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {galletas.map((p) => (
                <ProductTile key={p.slug} product={p} />
              ))}
            </Section>
          ) : null}

          {showTortas ? (
            <Section
              title="Tortas"
              subtitle="Listas para celebrar"
              gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {tortas.map((p) => (
                <ProductTile key={p.slug} product={p} />
              ))}
            </Section>
          ) : null}

          {showPostres ? (
            <Section
              title="Postres"
              subtitle="Minis y especiales"
              gridClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {postres.map((p) => (
                <ProductTile key={p.slug} product={p} dense />
              ))}
            </Section>
          ) : null}
        </>
      )}
    </div>
  );
}
