'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@/i18n';
import type { Product, ProductCategory } from '@/lib/products';
import { getCategoryLabel } from '@/lib/products';

type Props = {
  products: Product[];
  locale: Locale;
  cards: ReactNode[];
};

const ALL = '__all__' as const;
type FilterValue = typeof ALL | ProductCategory;

export function ProductsFilter({ products, locale, cards }: Props) {
  const [active, setActive] = useState<FilterValue>(ALL);

  const categories = useMemo(() => {
    const set = new Set<ProductCategory>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const allLabel =
    locale === 'ko' ? '전체' : locale === 'zh' ? '全部' : 'All';

  return (
    <div>
      <div className="flex flex-wrap gap-3 md:gap-4 items-center mb-12 pb-6 border-b border-[var(--color-rule)]">
        <FilterPill
          active={active === ALL}
          onClick={() => setActive(ALL)}
          label={allLabel}
          count={products.length}
        />
        {categories.map((cat) => (
          <FilterPill
            key={cat}
            active={active === cat}
            onClick={() => setActive(cat)}
            label={getCategoryLabel(cat, locale)}
            count={products.filter((p) => p.category === cat).length}
          />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((product, i) =>
          active === ALL || product.category === active ? (
            <div key={product.slug}>{cards[i]}</div>
          ) : null
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 label-section transition-colors border ${
        active
          ? 'bg-[var(--color-onyx)] text-[var(--color-gold)] border-[var(--color-gold)]'
          : 'bg-transparent text-[var(--color-ink-muted)] border-[var(--color-rule)] hover:text-[var(--color-onyx)] hover:border-[var(--color-gold)]'
      }`}
    >
      {label}
      <span className="ml-2 opacity-60 text-xs">({count})</span>
    </button>
  );
}
