import type { Locale } from '@/i18n';
import { defaultLocale } from '@/i18n';

export function localePath(path: string, locale: Locale): string {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) {
    return normalized === '' ? '/' : normalized;
  }
  return `/${locale}${normalized}` || `/${locale}`;
}
