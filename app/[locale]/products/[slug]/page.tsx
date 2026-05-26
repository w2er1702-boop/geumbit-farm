import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { isLocale, locales, type Locale } from '@/i18n';
import { localePath } from '@/lib/navigation';
import {
  formatPrice,
  getCategoryLabel,
  getProductBySlug,
  products,
} from '@/lib/products';
import { BuyButton } from '@/components/BuyButton';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProductBySlug(slug);
  if (!product) return {};

  const loc = locale as Locale;
  return {
    title: product.name[loc],
    description: product.shortDesc[loc],
    openGraph: {
      title: product.name[loc],
      description: product.shortDesc[loc],
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: 'product' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tActions = await getTranslations({ locale, namespace: 'actions' });

  const name = product.name[locale];
  const desc = product.shortDesc[locale];
  const category = getCategoryLabel(product.category, locale);
  const discount = Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100
  );

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const relatedCards = await Promise.all(
    related.map((p) => ProductCard({ product: p, locale }))
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://w2er1702-boop.github.io/geumbit-farm';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: desc,
    image: `${siteUrl}${product.image}`,
    sku: product.naverProductNo,
    category: product.category,
    brand: { '@type': 'Brand', name: 'GEUMBIT FARM' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KRW',
      price: product.salePrice,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <Section tone="parchment" noise className="py-16 lg:py-24">
        <Container>
          <nav className="mb-10 label-section text-[var(--color-ink-muted)]">
            <Link href={localePath('/products', locale)} className="link-gold-underline">
              ← {tActions('viewAllProducts')}
            </Link>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="double-border bg-[var(--color-parchment-2)] aspect-square relative">
                <div className="absolute inset-3 overflow-hidden">
                  <ProductImage
                    src={product.image}
                    alt={name}
                    comingSoonLabel={tCommon('comingSoon')}
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col">
              <SectionLabel className="text-[var(--color-gold-deep)]">{category}</SectionLabel>
              <h1 className="display display-3 mt-4 leading-tight">{name}</h1>
              <p className="mt-4 text-lg text-[var(--color-ink-muted)] leading-relaxed">{desc}</p>

              <GoldRule className="my-8" />

              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="label-section text-[var(--color-ink-muted)] w-16">
                    {tCommon('regularPrice')}
                  </span>
                  <span className="price text-base text-[var(--color-ink-muted)] line-through">
                    {formatPrice(product.regularPrice, locale)}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="label-section text-[var(--color-ink-muted)] w-16">
                    {tCommon('salePrice')}
                  </span>
                  <span className="price text-3xl text-[var(--color-oxblood)] font-medium">
                    {formatPrice(product.salePrice, locale)}
                  </span>
                  {discount > 0 && (
                    <span className="label-section text-[var(--color-oxblood)]">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="label-section text-[var(--color-ink-muted)] w-16">
                    {tCommon('weight')}
                  </span>
                  <span className="text-base">{product.weight}</span>
                </div>
              </div>

              <GoldRule className="my-8" />

              <div className="flex flex-wrap gap-3">
                <BuyButton product={product} locale={locale} />
                <Link
                  href={localePath('/contact', locale)}
                  className="btn btn-outline-dark"
                >
                  {tActions('inquire')}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="parchment-2" className="py-20">
        <Container size="reading">
          <div className="grid gap-12">
            <div>
              <SectionLabel>{t('aboutHeading')}</SectionLabel>
              <h2 className="display display-3 mt-3 mb-6">{t('aboutHeading')}</h2>
              <GoldRule />
              <p className="mt-6 text-base leading-relaxed">{t('aboutBody')}</p>
            </div>
            <div>
              <SectionLabel>{t('storageHeading')}</SectionLabel>
              <h2 className="display display-3 mt-3 mb-6">{t('storageHeading')}</h2>
              <GoldRule />
              <p className="mt-6 text-base leading-relaxed">{t('storageBody')}</p>
            </div>
            <div>
              <SectionLabel>{t('cautionHeading')}</SectionLabel>
              <h2 className="display display-3 mt-3 mb-6">{t('cautionHeading')}</h2>
              <GoldRule />
              <p className="mt-6 text-base leading-relaxed text-[var(--color-ink-muted)]">{t('cautionBody')}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="onyx" className="py-20 relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block">
          <VerticalHanjaAccent chars="緣" size="md" />
        </div>
        <Container>
          <div className="mb-12">
            <SectionLabel>{tCommon('relatedProducts')}</SectionLabel>
            <h2 className="display display-2 mt-4 text-[var(--color-parchment)]">
              {tCommon('relatedProducts')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedCards.map((card, i) => (
              <div key={related[i].slug}>{card}</div>
            ))}
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
