import type { MetadataRoute } from 'next';
import { readCms } from '@/lib/cms/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://grupogermano.app.br';
  const { products } = await readCms();
  return [
    { url: `${base}/catalogo`, lastModified: new Date(), priority: 1 },
    ...products.map((product) => ({ url: `${base}/catalogo/mundo-encantado/${product.slug}`, lastModified: new Date(), priority: .8 })),
  ];
}
