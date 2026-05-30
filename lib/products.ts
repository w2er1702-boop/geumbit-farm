import productsData from '@/data/products.json';
import type { Locale } from '@/i18n';

export type ProductCategory = '원물' | '슬라이스' | '진액' | '발효액' | '세트';

export interface Product {
  slug: string;
  category: ProductCategory;
  name: Record<Locale, string>;
  shortDesc: Record<Locale, string>;
  weight: string;
  regularPrice: number;
  salePrice: number;
  image: string;
  naverProductNo: string;
  sixshopSlug: string;
  /** 운영주가 확인한 상품별 스마트스토어 URL. 비어 있으면 메인 스토어 URL로 fallback. */
  smartstoreUrl?: string;
  featured?: boolean;
}

export const products = productsData as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

const NAVER_STORE_BASE =
  process.env.NEXT_PUBLIC_NAVER_STORE_URL || 'https://smartstore.naver.com/ycgoldenfarm';

/**
 * Resolve the buy URL for a product. Precedence:
 *  1) Per-product smartstoreUrl set in data/products.json
 *  2) `${NAVER_STORE_BASE}/products/${naverProductNo}`
 *  3) NAVER_STORE_BASE alone (last-resort fallback)
 */
export function getSmartstoreUrl(product: Product): string {
  if (product.smartstoreUrl) return product.smartstoreUrl;
  if (product.naverProductNo) return `${NAVER_STORE_BASE}/products/${product.naverProductNo}`;
  return NAVER_STORE_BASE;
}

export type PriceMode = 'show' | 'hide';

export function getPriceMode(): PriceMode {
  return process.env.NEXT_PUBLIC_PRICE_MODE === 'hide' ? 'hide' : 'show';
}

export function getCategoryLabel(category: ProductCategory, locale: Locale): string {
  const labels: Record<ProductCategory, Record<Locale, string>> = {
    원물: { ko: '원물', en: 'Whole', zh: '原物' },
    슬라이스: { ko: '슬라이스', en: 'Sliced', zh: '切片' },
    진액: { ko: '진액', en: 'Extract', zh: '进液' },
    발효액: { ko: '발효액', en: 'Fermented', zh: '发酵液' },
    세트: { ko: '세트', en: 'Set', zh: '套装' },
  };
  return labels[category][locale];
}

export function formatPrice(value: number, locale: Locale): string {
  const formatter = new Intl.NumberFormat(
    locale === 'ko' ? 'ko-KR' : locale === 'zh' ? 'zh-CN' : 'en-US'
  );
  const symbol = locale === 'zh' ? '¥' : locale === 'en' ? '₩' : '₩';
  return `${symbol}${formatter.format(value)}`;
}
