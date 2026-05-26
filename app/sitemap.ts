import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { products } from '@/lib/products';
import { pageUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const pages = [
  '/',
  '/brand',
  '/products',
  '/farm',
  '/certifications',
  '/contact',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of pages) {
      entries.push({
        url: pageUrl(path, locale),
        changeFrequency: 'monthly',
        priority: path === '/' ? 1.0 : 0.7,
      });
    }
    for (const product of products) {
      entries.push({
        url: pageUrl(`/products/${product.slug}`, locale),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
