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

  // TODO(legal): 운영주에게서 사업자등록번호·통신판매업 신고번호·대표자·정식 주소·
  // 전화·이메일 확정 후 messages/{locale}.json::footer.* 값 교체.
  const legalRows = [
    { label: tFooter('ceoLabel'), value: tFooter('ceoValue') },
    { label: tFooter('businessLabel'), value: tFooter('businessValue') },
    { label: tFooter('ecommerceLabel'), value: tFooter('ecommerceValue') },
    { label: tFooter('addressLabel'), value: tFooter('addressValue') },
    { label: tFooter('phoneLabel'), value: tFooter('phoneValue') },
    { label: tFooter('emailLabel'), value: tFooter('emailValue') },
  ];

  const smartstoreUrl =
    process.env.NEXT_PUBLIC_NAVER_STORE_URL || 'https://smartstore.naver.com/ycgoldenfarm';

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
            <li className="pt-3 mt-3 border-t border-[var(--color-rule)] opacity-70">
              <Link href={localePath('/privacy', locale)} className="hover:opacity-100 link-gold-underline">
                {tFooter('privacy')}
              </Link>
            </li>
            <li className="opacity-70">
              <Link href={localePath('/terms', locale)} className="hover:opacity-100 link-gold-underline">
                {tFooter('terms')}
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="label-section text-[var(--color-gold)] mb-4">CONTACT</div>
          <p className="text-sm opacity-70">
            <span className="block label-section text-[var(--color-gold)] mb-1 opacity-80">
              {tFooter('smartstoreLabel')}
            </span>
            <a
              href={smartstoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold-underline opacity-90 hover:opacity-100"
            >
              smartstore.naver.com/<br />ycgoldenfarm{' '}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">{tFooter('openInNewTab')}</span>
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 pb-12">
        <div className="label-section text-[var(--color-gold)] mb-4 opacity-70">
          {tFooter('legalHeading')}
        </div>
        <div className="text-xs opacity-80 mb-3">{tFooter('company')}</div>
        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-[max-content_1fr] text-xs opacity-70">
          {legalRows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="opacity-70">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <GoldRule />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 py-6 flex items-center justify-between text-xs opacity-50">
        <span>© {year} {tFooter('company')}. {tFooter('rights')}</span>
        <span className="wordmark tracking-[0.3em]" aria-hidden="true">
          金 · 黃 · 桑 · 黃
        </span>
      </div>
    </footer>
  );
}
