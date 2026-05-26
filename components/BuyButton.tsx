import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import type { Product } from '@/lib/products';

type Props = {
  product: Product;
  locale: Locale;
  variant?: 'primary' | 'outline';
};

export async function BuyButton({ product, locale, variant = 'primary' }: Props) {
  const t = await getTranslations({ locale, namespace: 'actions' });

  const sixshopBase = process.env.NEXT_PUBLIC_SIXSHOP_URL || '';
  const naverBase =
    process.env.NEXT_PUBLIC_NAVER_STORE_URL || 'https://smartstore.naver.com/ycgoldenfarm';

  const href =
    sixshopBase && product.sixshopSlug
      ? `${sixshopBase}/product/${product.sixshopSlug}`
      : `${naverBase}/products/${product.naverProductNo}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
    >
      {t('buyNow')} →
    </a>
  );
}
