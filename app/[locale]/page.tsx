import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import brandData from '@/data/brand.json';
import { isLocale, type Locale } from '@/i18n';
import { localePath } from '@/lib/navigation';
import { getFeaturedProducts } from '@/lib/products';
import { buildPageMetadata } from '@/lib/seo';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

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
    path: '/',
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home' });
  const tActions = await getTranslations({ locale, namespace: 'actions' });
  const featured = getFeaturedProducts();
  const heritage = brandData.heritage;

  return (
    <>
      <HeroSection locale={locale} />

      {/* Brand Lead-in */}
      <Section tone="parchment" noise className="py-24 lg:py-32">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-3">
              <SectionLabel>
                <span className="opacity-60">Ⅱ</span>
                <span className="gold-divider" />
                {t('brandLeadHeading')}
              </SectionLabel>
            </div>
            <div className="lg:col-span-7 lg:col-start-5">
              <h2 className="display display-2 mb-8">{t('brandLeadTitle')}</h2>
              <GoldRule />
              <p className="mt-8 text-lg leading-relaxed text-[var(--color-ink)] opacity-90">
                {t('brandLeadBody')}
              </p>
              <div className="mt-10">
                <Link
                  href={localePath('/brand', locale)}
                  className="link-gold-underline label-section text-[var(--color-oxblood)]"
                >
                  {tActions('brandStory')} →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Products */}
      <Section tone="onyx" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-12 left-6 hidden lg:block">
          <VerticalHanjaAccent chars="金桑黃" size="md" />
        </div>
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <SectionLabel>
                <span className="opacity-60">Ⅲ</span>
                <span className="gold-divider" />
                {t('featuredHeading')}
              </SectionLabel>
              <h2 className="display display-2 mt-4 text-[var(--color-parchment)]">
                {t('featuredTitle')}
              </h2>
            </div>
            <Link
              href={localePath('/products', locale)}
              className="link-gold-underline label-section text-[var(--color-gold)] self-start md:self-end"
            >
              {tActions('viewAllProducts')} →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} featured />
            ))}
          </div>
        </Container>
      </Section>

      {/* Heritage Strip */}
      <Section tone="parchment-2" className="py-20" noise>
        <Container>
          <div className="grid md:grid-cols-3 gap-10">
            {heritage.map((item, i) => (
              <div key={i} className="relative">
                {i > 0 && (
                  <div className="hidden md:block absolute -left-5 top-0 bottom-0 w-px bg-[var(--color-gold)] opacity-40" />
                )}
                <div className="label-section text-[var(--color-gold-deep)] mb-4">
                  · 0{i + 1}
                </div>
                <h3 className="display text-2xl mb-3 leading-tight">
                  {item.title[locale]}
                </h3>
                <p className="text-base text-[var(--color-ink-muted)] leading-relaxed">
                  {item.desc[locale]}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* B2B Trust */}
      <Section tone="onyx" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden lg:block">
          <VerticalHanjaAccent chars="信義" size="md" />
        </div>
        <Container size="reading">
          <SectionLabel>
            <span className="opacity-60">Ⅴ</span>
            <span className="gold-divider" />
            {t('b2bHeading')}
          </SectionLabel>
          <h2 className="display display-3 mt-6 text-[var(--color-parchment)]">
            {t('b2bTitle')}
          </h2>
          <GoldRule className="mt-8" />
          <p className="mt-8 text-base leading-relaxed opacity-80">
            {t('b2bBody')}
          </p>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="parchment" className="py-24" noise>
        <Container size="reading" className="text-center">
          <SectionLabel>
            <span className="opacity-60">Ⅵ</span>
            <span className="gold-divider" />
            INVITATION
          </SectionLabel>
          <h2 className="display display-2 mt-6">{t('ctaHeading')}</h2>
          <p className="mt-6 text-lg text-[var(--color-ink-muted)]">{t('ctaBody')}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href={localePath('/products', locale)} className="btn btn-primary">
              {tActions('viewAllProducts')} →
            </Link>
            <Link href={localePath('/contact', locale)} className="btn btn-outline-dark">
              {tActions('inquire')}
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
