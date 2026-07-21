import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://grupogermano.app.br';
  return [
    { url: `${base}/catalogo`, lastModified: new Date(), priority: 1 },
    { url: `${base}/cadastro`, lastModified: new Date(), priority: .8 },
    { url: `${base}/orcamento`, lastModified: new Date(), priority: .8 },
    { url: `${base}/mundo-encantado/revendedor`, lastModified: new Date(), priority: .7 },
    { url: `${base}/mundo-encantado/contato`, lastModified: new Date(), priority: .6 },
    { url: `${base}/mundo-encantado/download`, lastModified: new Date(), priority: .6 },
  ];
}
