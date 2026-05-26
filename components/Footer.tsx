import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/navigation';
import { GoldRule } from './GoldRule';

type Props = { locale: Locale };

export async function Footer({ locale }: Props) {
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const year = new Date().getFullYear();

  const nav = [
    { path: '/brand', label: tNav('brand') },
    { path: '/products', label: tNav('products') },
    { path: '/farm', label: tNav('farm') },
    { path: '/certifications', label: tNav('certifications') },
    { path: '/contact', label: tNav('contact') },
  ];

  return (
    <footer className="bg-[var(--color-onyx)] text-[var(--color-parchment)] mt-24">
      <GoldRule />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 py-16 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="wordmark text-[var(--color-gold)] text-lg tracking-[0.2em]">
            GEUMBIT FARM
          </div>
          <div className="mt-2 opacity-70 text-sm">금빛농원 · {tFooter('company')}</div>
          <p className="mt-6 opacity-60 text-sm leading-relaxed max-w-md">
            {tFooter('tagline')}
          </p>
          <p className="mt-6 text-xs opacity-50 leading-relaxed">
            {tFooter('disclaimer')}
          </p>
        </div>

        <div className="md:col-span-4">
          <div className="label-section text-[var(--color-gold)] mb-4">SITEMAP</div>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.path}>
                <Link href={localePath(item.path, locale)} className="opacity-70 hover:opacity-100 link-gold-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="label-section text-[var(--color-gold)] mb-4">CONTACT</div>
          <p className="text-sm opacity-70">
            smartstore.naver.com/<br />ycgoldenfarm
          </p>
        </div>
      </div>

      <GoldRule />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 py-6 flex items-center justify-between text-xs opacity-50">
        <span>© {year} {tFooter('company')}. {tFooter('rights')}</span>
        <span className="wordmark tracking-[0.3em]">金 · 黃 · 桑 · 黃</span>
      </div>
    </footer>
  );
}
