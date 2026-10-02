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
  name: 'Petición personalizada',
  category: 'postres',
  description:
    'Cuéntanos tu idea desde cero: temática, colores, tamaño, ocasión y cualquier detalle. No hace falta basarte en las referencias de la galería. Cotizamos el precio final por WhatsApp según lo que necesites.',
  price: 0,
  image: '/images/products/torta-personalizada-de-harry-potter-nina.jpg',
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
