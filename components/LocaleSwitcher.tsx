'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/i18n';

const labels: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
  zh: '中',
};

function stripBasePath(pathname: string): string {
  if (typeof window === 'undefined') return pathname;
  return pathname;
}

function pathWithoutLocale(pathname: string): string {
  const clean = stripBasePath(pathname);
  for (const loc of locales) {
    if (loc === defaultLocale) continue;
    if (clean === `/${loc}`) return '/';
    if (clean.startsWith(`/${loc}/`)) return clean.slice(`/${loc}`.length);
  }
  return clean || '/';
}

function buildHref(basePath: string, locale: Locale): string {
  const normalized = basePath === '' ? '/' : basePath;
  if (locale === defaultLocale) return normalized;
  if (normalized === '/') return `/${locale}`;
  return `/${locale}${normalized}`;
}

type Props = { currentLocale: Locale };

export function LocaleSwitcher({ currentLocale }: Props) {
  const pathname = usePathname() || '/';
  const base = pathWithoutLocale(pathname);

  return (
    <div className="flex items-center gap-3 text-xs tracking-[0.18em]">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-3">
          {i > 0 && <span className="opacity-30">/</span>}
          <Link
            href={buildHref(base, loc)}
            className={
              loc === currentLocale
                ? 'text-[var(--color-gold)]'
                : 'opacity-60 hover:opacity-100 transition-opacity'
            }
            aria-current={loc === currentLocale ? 'true' : undefined}
          >
            {labels[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
