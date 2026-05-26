import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/navigation';
import { formatPrice, getCategoryLabel, type Product } from '@/lib/products';
import { ProductImage } from './ProductImage';

type Props = {
  product: Product;
  locale: Locale;
  featured?: boolean;
};

export async function ProductCard({ product, locale, featured = false }: Props) {
  const t = await getTranslations({ locale, namespace: 'actions' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const name = product.name[locale];
  const desc = product.shortDesc[locale];
  const category = getCategoryLabel(product.category, locale);

  return (
    <Link
      href={localePath(`/products/${product.slug}`, locale)}
      className="product-card group flex flex-col h-full"
    >
      <div className={`product-card-image relative w-full ${featured ? 'aspect-[4/5]' : 'aspect-square'} bg-[var(--color-parchment-2)]`}>
        <ProductImage
          src={product.image}
          alt={name}
          comingSoonLabel={tCommon('comingSoon')}
          sizes={featured ? '(min-width: 1024px) 33vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
        />
      </div>

      <div className="flex-1 flex flex-col p-6 gap-3">
        <div className="label-section text-[var(--color-gold-deep)]">{category}</div>
        <h3 className="display text-lg leading-snug min-h-[3em]">{name}</h3>
        <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2">{desc}</p>

        <div className="mt-auto pt-3 flex items-baseline gap-3">
          <span className="price text-xs text-[var(--color-ink-muted)] line-through">
            {formatPrice(product.regularPrice, locale)}
          </span>
          <span className="price text-base text-[var(--color-oxblood)] font-medium">
            {formatPrice(product.salePrice, locale)}
          </span>
        </div>

        <div className="pt-3 flex items-center justify-between border-t border-[var(--color-rule)]">
          <span className="label-section text-[var(--color-gold-deep)] group-hover:text-[var(--color-oxblood)] transition-colors">
            {t('learnMore')}
          </span>
          <span className="text-[var(--color-gold)] group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
