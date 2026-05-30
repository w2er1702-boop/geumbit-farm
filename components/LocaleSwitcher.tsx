'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/i18n';

const labels: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
  zh: '中',
};

// Next.js usePathname() returns a path without basePath. Because pages live under
// app/[locale]/, the client router treats the default locale (ko) as a real URL
// segment even though scripts/postbuild.mjs moves /out/ko/* to root at build time.
// We therefore strip *every* locale prefix — including ko — so the switcher
// never produces nested segments like /en/ko/brand.
function pathWithoutLocale(pathname: string): string {
  for (const loc of locales) {
    if (pathname === `/${loc}`) return '/';
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length);
  }
  return pathname || '/';
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
