import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import type { Product, ProductCategory } from './types';
import { resolveProductImage } from './format';

export type { Product, ProductCategory } from './types';
export { categoryLabels } from './types';

export function getReader() {
  return createReader(process.cwd(), keystaticConfig);
}

export async function getAllProducts(): Promise<Product[]> {
  const reader = getReader();
  const entries = await reader.collections.products.all();

  return entries
    .map(({ slug, entry }) => ({
      slug,
      name: entry.name,
      category: entry.category as ProductCategory,
      description: entry.description ?? '',
      price: entry.price ?? 0,
      image: resolveProductImage(entry.image),
      available: entry.available ?? true,
      featured: entry.featured ?? false,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export async function getProduct(slug: string): Promise<Product | null> {
  const reader = getReader();
  const entry = await reader.collections.products.read(slug);
  if (!entry) return null;

  return {
    slug,
    name: entry.name,
    category: entry.category as ProductCategory,
    description: entry.description ?? '',
    price: entry.price ?? 0,
    image: resolveProductImage(entry.image),
    available: entry.available ?? true,
    featured: entry.featured ?? false,
  };
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
