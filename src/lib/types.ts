export type ProductCategory = 'galletas' | 'tortas' | 'postres';

export type ProductSize = {
  label: string;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string | null;
  available: boolean;
  featured: boolean;
  sizes: ProductSize[];
  isCustomOrder?: boolean;
};

export const CUSTOM_ORDER_SLUG = 'encargo-personalizado';

export const customOrderProduct: Product = {
  slug: CUSTOM_ORDER_SLUG,
  name: 'Encargo personalizado',
  category: 'postres',
  description:
    'Lo preparamos a tu medida. Envíanos una referencia de lo que deseas (foto, idea o descripción) y te cotizamos el precio según la petición.',
  price: 0,
  image: '/images/products/encargo-personalizado.svg',
  available: true,
  featured: false,
  sizes: [],
  isCustomOrder: true,
};

export const categoryLabels: Record<ProductCategory, string> = {
  galletas: 'Galletas',
  tortas: 'Tortas',
  postres: 'Postres',
};

export function productDisplayPrice(product: Product): number {
  if (product.isCustomOrder) return 0;
  if (product.sizes.length > 0) {
    return Math.min(...product.sizes.map((size) => size.price));
  }
  return product.price;
}
