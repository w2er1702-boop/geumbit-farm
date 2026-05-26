import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/i18n';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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

  const rows = [
    { label: t('addressLabel'), value: t('addressValue') },
    { label: t('phoneLabel'), value: t('phoneValue') },
    { label: t('emailLabel'), value: t('emailValue') },
    { label: t('kakaoLabel'), value: t('kakaoValue') },
    { label: t('businessLabel'), value: t('businessValue') },
    { label: t('ecommerceLabel'), value: t('ecommerceValue') },
    {
      label: t('smartstoreLabel'),
      value: t('smartstoreValue'),
      href: smartstoreUrl,
    },
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
        <Container size="reading">
          <div className="double-border bg-[var(--color-parchment-2)] p-8 lg:p-12">
            <dl className="divide-y divide-[var(--color-rule)]">
              {rows.map((row) => (
                <div key={row.label} className="py-5 grid grid-cols-3 gap-4 items-baseline">
                  <dt className="label-section text-[var(--color-gold-deep)] col-span-1">
                    {row.label}
                  </dt>
                  <dd className="col-span-2 text-base">
                    {row.href ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-gold-underline text-[var(--color-oxblood)]"
                      >
                        {row.value} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> {tFooter('openInNewTab')}</span>
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>
    </>
  );
}
