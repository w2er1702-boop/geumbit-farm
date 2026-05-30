import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import brandData from '@/data/brand.json';
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
    path: '/brand',
    title: t('brandTitle'),
    description: t('brandDescription'),
  });
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'brand' });

  const company = brandData.company[locale];
  const brandName = brandData.brandName[locale];
  // TODO(copy): story[2]는 운영주 인터뷰 확정 후 정식 카피로 교체 (data/brand.json)
  const story = brandData.story[locale];
  const principles = brandData.principles;

  return (
    <>
      <Section tone="onyx" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block">
          <VerticalHanjaAccent chars="金黃桑" size="lg" />
        </div>
        <Container>
          <SectionLabel>
            <span className="opacity-60">Ⅰ</span>
            <span className="gold-divider" />
            {t('title')}
          </SectionLabel>
          <h1 className="display display-1 mt-6 text-[var(--color-gold)]">{brandName}</h1>
          <p className="mt-4 text-lg opacity-80">{t('subtitle')}</p>
          <GoldRule className="mt-12" />
        </Container>
      </Section>

      <Section tone="parchment" noise className="py-24">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <SectionLabel>{t('companyLabel')}</SectionLabel>
              <div className="mt-2 display text-2xl">{company}</div>
            </div>
            <div className="lg:col-span-8 lg:col-start-5 space-y-6">
              {story.map((paragraph, i) => (
                <p key={i} className="text-lg leading-relaxed text-[var(--color-ink)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="parchment-2" className="py-24">
        <Container>
          <div className="text-center mb-16">
            <SectionLabel>
              <span className="opacity-60">Ⅱ</span>
              <span className="gold-divider" />
              {t('principlesHeading')}
            </SectionLabel>
            <h2 className="display display-2 mt-4">{t('principlesTitle')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, i) => (
              <div key={i} className="double-border bg-[var(--color-parchment)] p-8 flex flex-col">
                <span
                  className="text-6xl text-[var(--color-gold)] mb-4 font-bold"
                  style={{ fontFamily: "'Noto Serif SC', serif" }}
                >
                  {principle.hanja}
                </span>
                <h3 className="display text-xl mb-3">{principle.title[locale]}</h3>
                <p className="text-base text-[var(--color-ink-muted)] leading-relaxed">
                  {principle.desc[locale]}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
