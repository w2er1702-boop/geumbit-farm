import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n';
import { localePath } from '@/lib/navigation';
import { VerticalHanjaAccent } from './VerticalHanjaAccent';

type Props = { locale: Locale };

export async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tActions = await getTranslations({ locale, namespace: 'actions' });

  return (
    <section className="relative bg-[var(--color-onyx)] text-[var(--color-parchment)] overflow-hidden">
      <div className="absolute top-8 right-8 lg:right-16 hidden md:block">
        <VerticalHanjaAccent chars="黃金桑黃" size="lg" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 pt-24 pb-32 lg:pt-32 lg:pb-40 grid lg:grid-cols-12 gap-12 relative">
        <div className="lg:col-span-7 flex flex-col justify-center fade-up">
          <div className="label-section text-[var(--color-gold)] mb-6">
            <span className="opacity-60">Ⅰ</span>
            <span className="gold-divider" />
            EST · 連川 · 韓灘江
          </div>

          <h1 className="wordmark display-1 text-[var(--color-gold)] leading-none">
            {t('wordmark')}
          </h1>

          <div className="mt-4 display-3 text-[var(--color-parchment)]">
            {t('brandKo')}
          </div>

          <div className="mt-10 max-w-xl">
            <div className="gold-rule mb-6" />
            <p className="text-lg md:text-xl leading-relaxed text-[var(--color-parchment)] opacity-90">
              {t('heroSlogan')}
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 fade-up fade-up-delay-2">
            <Link href={localePath('/products', locale)} className="btn btn-primary">
              {tActions('viewAllProducts')} →
            </Link>
            <Link href={localePath('/brand', locale)} className="btn btn-outline">
              {tActions('brandStory')}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 relative fade-up fade-up-delay-3">
          <div className="relative aspect-[3/4] w-full double-border bg-[var(--color-onyx-soft)]">
            <div className="absolute inset-3">
              <HeroImage />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroImage() {
  return (
    <div className="relative w-full h-full bg-[var(--color-charcoal)] overflow-hidden">
      <Image
        src="/farm/hero.jpg"
        alt="Geumbit Farm Hero"
        fill
        priority
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[120px] leading-none opacity-15 text-[var(--color-gold)] font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          黃金
        </span>
        <span className="mt-2 label-section text-[var(--color-gold)] opacity-50">HERO IMAGE</span>
      </div>
    </div>
  );
}
