import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

type Props = { locale: Locale };

export async function Header({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });

  const navItems = [
    { key: 'brand', path: '/brand', label: t('brand') },
    { key: 'products', path: '/products', label: t('products') },
    { key: 'farm', path: '/farm', label: t('farm') },
    { key: 'certifications', path: '/certifications', label: t('certifications') },
    { key: 'contact', path: '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-onyx)] text-[var(--color-parchment)] border-b border-[var(--color-rule)]">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link href={localePath('/', locale)} className="flex items-center gap-3">
          <span className="wordmark text-[var(--color-gold)] text-base tracking-[0.2em]">
            GEUMBIT FARM
          </span>
          <span className="hidden md:inline text-xs opacity-60">금빛농원</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={localePath(item.path, locale)}
              className="link-gold-underline opacity-80 hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <LocaleSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
