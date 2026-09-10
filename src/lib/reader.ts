import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import type { Product, ProductCategory, ProductSize } from './types';
import { CUSTOM_ORDER_SLUG, customOrderProduct } from './types';
import { resolveProductImage } from './format';

export type { Product, ProductCategory, ProductSize } from './types';
export {
  categoryLabels,
  CUSTOM_ORDER_SLUG,
  customOrderProduct,
  productDisplayPrice,
} from './types';

export function getReader() {
  return createReader(process.cwd(), keystaticConfig);
}

function mapSizes(
  category: ProductCategory,
  cookieSizing: {
    discriminant: boolean;
    value: { label: string; price: number | null }[] | null;
  } | null | undefined,
): ProductSize[] {
  if (category !== 'galletas') return [];
  if (!cookieSizing?.discriminant || !cookieSizing.value) return [];

  return cookieSizing.value
    .map((size) => ({
      label: size.label?.trim() ?? '',
      price: size.price ?? 0,
    }))
    .filter((size) => size.label.length > 0);
}

function mapProduct(
  slug: string,
  entry: {
    name: string;
    category: string;
    description: string | null;
    price: number | null;
    image: string | null;
    available: boolean | null;
    featured: boolean | null;
    cookieSizing?: {
      discriminant: boolean;
      value: { label: string; price: number | null }[] | null;
    } | null;
  },
): Product {
  const category = entry.category as ProductCategory;
  const sizes = mapSizes(category, entry.cookieSizing);

  return {
    slug,
    name: entry.name,
    category,
    description: entry.description ?? '',
    price: entry.price ?? 0,
    image: resolveProductImage(entry.image),
    available: entry.available ?? true,
    featured: entry.featured ?? false,
    sizes,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const reader = getReader();
  const entries = await reader.collections.products.all();

  const products = entries
    .map(({ slug, entry }) => mapProduct(slug, entry))
    .filter((product) => product.slug !== CUSTOM_ORDER_SLUG)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return [customOrderProduct, ...products];
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (slug === CUSTOM_ORDER_SLUG) return customOrderProduct;

  const reader = getReader();
  const entry = await reader.collections.products.read(slug);
  if (!entry) return null;

  return mapProduct(slug, entry);
}

export async function getSiteSettings() {
  const reader = getReader();
  const site = await reader.singletons.site.read();

  return {
    whatsappNumber:
      site?.whatsappNumber?.trim() ||
      import.meta.env.PUBLIC_WHATSAPP_NUMBER ||
      '',
    paymentNote:
      site?.paymentNote?.trim() ||
      'Pago móvil, transferencia o efectivo al entregar. Coordinamos zona y horario por WhatsApp.',
    orderGreeting:
      site?.orderGreeting?.trim() ||
      'Hola! Quiero hacer un pedido en Delicateses Doña Rosa:',
  };
}
