export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function resolveProductImage(image: string | null | undefined) {
  if (!image) return '/images/products/galletas-de-avena.svg';
  if (image.startsWith('/')) return image;
  if (image.startsWith('http')) return image;
  return `/images/products/${image}`;
}
