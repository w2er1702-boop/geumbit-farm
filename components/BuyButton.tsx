import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { getSmartstoreUrl, type Product } from '@/lib/products';

type Props = {
  product: Product;
  locale: Locale;
  variant?: 'primary' | 'outline';
};

export async function BuyButton({ product, locale, variant = 'primary' }: Props) {
  const tActions = await getTranslations({ locale, namespace: 'actions' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  const href = getSmartstoreUrl(product);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
    >
      {tActions('buyOnSmartstore')} <span aria-hidden="true">→</span>
      <span className="sr-only"> {tFooter('openInNewTab')}</span>
    </a>
  );
}
