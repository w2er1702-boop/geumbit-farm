import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/i18n';
import { products } from '@/lib/products';
import { buildPageMetadata } from '@/lib/seo';
import { ProductCard } from '@/components/ProductCard';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';
import { ProductsFilter } from './ProductsFilter';

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
    path: '/products',
    title: t('productsTitle'),
    description: t('productsDescription'),
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'products' });

  const cards = await Promise.all(
    products.map((p) => ProductCard({ product: p, locale }))
  );

  return (
    <>
      <Section tone="onyx" className="py-24 relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block">
          <VerticalHanjaAccent chars="桑黃" size="lg" />
        </div>
        <Container>
          <SectionLabel>
            <span className="opacity-60">Ⅰ</span>
            <span className="gold-divider" />
            {t('title')}
          </SectionLabel>
          <h1 className="display display-1 mt-6 text-[var(--color-gold)]">
            {t('subtitle')}
          </h1>
          <GoldRule className="mt-10" />
          <p className="mt-8 text-lg max-w-2xl opacity-80">{t('intro')}</p>
        </Container>
      </Section>

      <Section tone="parchment" noise className="py-20">
        <Container>
          <ProductsFilter products={products} locale={locale} cards={cards} />
        </Container>
      </Section>
    </>
  );
}
