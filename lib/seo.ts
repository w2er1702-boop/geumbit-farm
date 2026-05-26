import type { Metadata } from 'next';
import { defaultLocale, locales, type Locale } from '@/i18n';

const FALLBACK_SITE_URL = 'https://w2er1702-boop.github.io/geumbit-farm';

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
}

/**
 * Produce the canonical URL for a given locale + path.
 * Mirrors lib/navigation.ts::localePath but for absolute URLs.
 *
 * postbuild moves /out/ko/* to /out/, so ko paths sit at the site root
 * while en/zh keep their locale prefix.
 */
export function pageUrl(path: string, locale: Locale): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const withTrailing = normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;
  return `${siteUrl}${prefix}${withTrailing}`;
}

export type PageMetaOptions = {
  locale: Locale;
  /** Site-relative path without locale prefix and without trailing slash, e.g. "/brand". Use "/" for home. */
  path: string;
  title: string;
  description: string;
  ogImagePath?: string;
};

const siteTitleByLocale: Record<Locale, string> = {
  ko: '금빛농원 · GEUMBIT FARM',
  en: 'GEUMBIT FARM · 금빛농원',
  zh: '金光农园 · GEUMBIT FARM',
};

export function getSiteTitle(locale: Locale): string {
  return siteTitleByLocale[locale];
}

/**
 * Build per-page Metadata with canonical, hreflang alternates, and OG fields.
 * Pages should call this from their own generateMetadata().
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogImagePath = '/og-default.jpg',
}: PageMetaOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = pageUrl(path, locale);
  const siteTitle = getSiteTitle(locale);
  const fullTitle = title === siteTitle ? title : `${title} · ${siteTitle}`;

  const languageAlternates: Record<string, string> = {};
  for (const loc of locales) {
    languageAlternates[loc === 'zh' ? 'zh-CN' : loc] = pageUrl(path, loc);
  }
  languageAlternates['x-default'] = pageUrl(path, defaultLocale);

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages: languageAlternates,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteTitle,
      images: [ogImagePath],
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : locale === 'en' ? 'en_US' : 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImagePath],
    },
  };
}
