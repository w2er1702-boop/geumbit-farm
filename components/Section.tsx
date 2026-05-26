import type { ReactNode } from 'react';

type Tone = 'onyx' | 'parchment' | 'parchment-2';

type Props = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  id?: string;
  noise?: boolean;
};

const toneClass: Record<Tone, string> = {
  onyx: 'bg-[var(--color-onyx)] text-[var(--color-parchment)]',
  parchment: 'bg-[var(--color-parchment)] text-[var(--color-ink)]',
  'parchment-2': 'bg-[var(--color-parchment-2)] text-[var(--color-ink)]',
};

export function Section({ tone = 'parchment', children, className = '', id, noise = false }: Props) {
  return (
    <section
      id={id}
      className={`relative ${toneClass[tone]} ${noise ? 'parchment-noise' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

export function Container({
  children,
  className = '',
  size = 'page',
}: {
  children: ReactNode;
  className?: string;
  size?: 'page' | 'wide' | 'reading';
}) {
  const sizeClass =
    size === 'reading'
      ? 'max-w-[720px]'
      : size === 'wide'
      ? 'max-w-[1280px]'
      : 'max-w-[1440px]';
  return (
    <div className={`mx-auto ${sizeClass} px-6 md:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`label-section text-[var(--color-gold)] ${className}`}>{children}</span>
  );
}
