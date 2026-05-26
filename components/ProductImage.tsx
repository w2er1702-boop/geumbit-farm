'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  comingSoonLabel: string;
  priority?: boolean;
  sizes?: string;
};

export function ProductImage({ src, alt, comingSoonLabel, priority, sizes }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-parchment-2)] text-[var(--color-onyx)]">
        <span className="text-[88px] leading-none opacity-30 font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          桑黃
        </span>
        <span className="mt-2 label-section opacity-50">{comingSoonLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
      className="object-cover"
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
