import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n';
import { products } from '@/lib/products';

export const dynamic = 'force-static';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://w2er1702-boop.github.io/geumbit-farm';

const pages = [
  '',
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
    const prefix = locale === defaultLocale ? '' : `/${locale}`;
    for (const path of pages) {
      entries.push({
        url: `${siteUrl}${prefix}${path || '/'}`,
        changeFrequency: 'monthly',
        priority: path === '' ? 1.0 : 0.7,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${siteUrl}${prefix}/products/${product.slug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
