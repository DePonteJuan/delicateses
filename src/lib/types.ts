export type ProductCategory = 'galletas' | 'tortas' | 'postres';

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string | null;
  available: boolean;
  featured: boolean;
};

export const categoryLabels: Record<ProductCategory, string> = {
  galletas: 'Galletas',
  tortas: 'Tortas',
  postres: 'Postres',
};
