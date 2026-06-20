import catalogJson from '@/data/realisaprint-catalog.json';

export interface CatalogConfiguration {
  id: string;
  name: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  emoji: string;
  configurations: CatalogConfiguration[];
  /** basePath-relative path to a real Préscript preview image, when captured at build time. */
  image?: string;
}

const catalog = catalogJson as {
  fetchedAt: string | null;
  products: Record<string, CatalogProduct>;
};

export function getCatalogProducts(): CatalogProduct[] {
  return Object.values(catalog.products);
}

export function getCatalogProductBySlug(slug: string): CatalogProduct | undefined {
  return Object.values(catalog.products).find((p) => p.slug === slug);
}

export function hasCatalog(): boolean {
  return catalog.fetchedAt !== null && Object.keys(catalog.products).length > 0;
}

export function getFirstConfigId(product: CatalogProduct): string | undefined {
  return product.configurations[0]?.id;
}
