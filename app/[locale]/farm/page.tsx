import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import brandData from '@/data/brand.json';
import { isLocale, locales, type Locale } from '@/i18n';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function FarmPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'farm' });
  const location = brandData.farm.location[locale];
  const description = brandData.farm.description[locale];

  const galleryImages = Array.from({ length: 6 }, (_, i) => `/farm/farm-${i + 1}.jpg`);

  return (
    <>
      <Section tone="onyx" className="relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block z-10">
          <VerticalHanjaAccent chars="韓灘江" size="lg" />
        </div>
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-[var(--color-charcoal)] overflow-hidden">
          <Image
            src="/farm/hero.jpg"
            alt="Geumbit Farm"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-onyx)] to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <Container className="pb-12 lg:pb-20">
              <SectionLabel>
                <span className="opacity-60">Ⅰ</span>
                <span className="gold-divider" />
                {t('title')}
              </SectionLabel>
              <h1 className="display display-1 mt-4 text-[var(--color-parchment)]">
                {t('subtitle')}
              </h1>
            </Container>
          </div>
        </div>
      </Section>

      <Section tone="parchment" noise className="py-24">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <SectionLabel>{t('locationLabel')}</SectionLabel>
              <div className="mt-2 display text-xl">{location}</div>
              <a
                href="https://map.naver.com/?query=연천+한탄강"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block link-gold-underline text-sm text-[var(--color-oxblood)]"
              >
                지도에서 보기 ↗
              </a>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <GoldRule />
              <p className="mt-8 text-lg leading-relaxed">{description}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="parchment-2" className="py-20">
        <Container>
          <SectionLabel>
            <span className="opacity-60">Ⅱ</span>
            <span className="gold-divider" />
            {t('galleryHeading')}
          </SectionLabel>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((src, i) => (
              <div key={i} className="relative aspect-[4/5] bg-[var(--color-parchment)] overflow-hidden border border-[var(--color-rule)]">
                <Image src={src} alt={`Farm ${i + 1}`} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="label-section text-[var(--color-gold-deep)] opacity-40">
                    GALLERY · {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
