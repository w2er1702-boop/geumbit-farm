import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'seo' });
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/contact',
    title: t('contactTitle'),
    description: t('contactDescription'),
  });
}

// TODO(contact): 운영주 확인 후 messages/{locale}.json::contact.kakaoHref,
// phoneHref, emailHref, kakaoValue, phoneValue, emailValue 채우기.
// href 값이 비어 있는 채널은 비활성 카드로 렌더된다.
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  const smartstoreUrl =
    process.env.NEXT_PUBLIC_NAVER_STORE_URL || 'https://smartstore.naver.com/ycgoldenfarm';

  const channels: Array<{
    hanja: string;
    label: string;
    value: string;
    href: string;
    cta: string;
    external: boolean;
  }> = [
    {
      hanja: '話',
      label: t('kakaoLabel'),
      value: t('kakaoValue'),
      href: t('kakaoHref'),
      cta: t('ctaKakao'),
      external: true,
    },
    {
      hanja: '電',
      label: t('phoneLabel'),
      value: t('phoneValue'),
      href: t('phoneHref'),
      cta: t('ctaCall'),
      external: false,
    },
    {
      hanja: '信',
      label: t('emailLabel'),
      value: t('emailValue'),
      href: t('emailHref'),
      cta: t('ctaEmail'),
      external: false,
    },
    {
      hanja: '店',
      label: t('smartstoreLabel'),
      value: t('smartstoreValue'),
      href: smartstoreUrl,
      cta: t('ctaSmartstore'),
      external: true,
    },
  ];

  const pendingValue = t('pendingValue');

  const secondaryRows = [
    { label: t('addressLabel'), value: t('addressValue') },
    { label: t('businessLabel'), value: t('businessValue') },
    { label: t('ecommerceLabel'), value: t('ecommerceValue') },
  ];

  return (
    <>
      <Section tone="onyx" className="py-24 relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block">
          <VerticalHanjaAccent chars="連絡" size="lg" />
        </div>
        <Container>
          <SectionLabel>
            <span className="opacity-60">Ⅰ</span>
            <span className="gold-divider" />
            {t('title')}
          </SectionLabel>
          <h1 className="display display-1 mt-6 text-[var(--color-gold)]">{t('subtitle')}</h1>
          <GoldRule className="mt-10" />
          <p className="mt-8 text-lg max-w-2xl opacity-80">{t('intro')}</p>
        </Container>
      </Section>

      <Section tone="parchment" noise className="py-24">
        <Container>
          <SectionLabel>
            <span className="opacity-60">Ⅱ</span>
            <span className="gold-divider" />
            {t('channelsHeading')}
          </SectionLabel>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((ch) => {
              const enabled = ch.href.length > 0 && ch.value !== pendingValue;
              return (
                <article
                  key={ch.label}
                  className={`double-border bg-[var(--color-parchment-2)] p-6 flex flex-col ${
                    enabled ? '' : 'opacity-60'
                  }`}
                >
                  <span
                    className="text-5xl text-[var(--color-gold)] mb-4 font-bold"
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                    aria-hidden="true"
                  >
                    {ch.hanja}
                  </span>
                  <div className="label-section text-[var(--color-gold-deep)]">{ch.label}</div>
                  <div className="mt-2 text-base break-words">
                    {enabled ? ch.value : pendingValue}
                  </div>
                  <div className="mt-auto pt-5">
                    {enabled ? (
                      <a
                        href={ch.href}
                        {...(ch.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="link-gold-underline label-section text-[var(--color-oxblood)]"
                      >
                        {ch.cta} <span aria-hidden="true">{ch.external ? '↗' : '→'}</span>
                        {ch.external && (
                          <span className="sr-only"> {tFooter('openInNewTab')}</span>
                        )}
                      </a>
                    ) : (
                      <span
                        className="label-section text-[var(--color-ink-muted)] opacity-70"
                        aria-disabled="true"
                      >
                        {ch.cta}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="parchment-2" className="py-20">
        <Container size="reading">
          <SectionLabel>
            <span className="opacity-60">Ⅲ</span>
            <span className="gold-divider" />
            {tFooter('legalHeading')}
          </SectionLabel>
          <dl className="mt-8 divide-y divide-[var(--color-rule)]">
            {secondaryRows.map((row) => (
              <div key={row.label} className="py-4 grid grid-cols-3 gap-4 items-baseline">
                <dt className="label-section text-[var(--color-gold-deep)]">{row.label}</dt>
                <dd className="col-span-2 text-base">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
