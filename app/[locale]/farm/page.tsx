import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import brandData from '@/data/brand.json';
import { isLocale, locales, type Locale } from '@/i18n';
import { buildPageMetadata, getSiteUrl, pageUrl } from '@/lib/seo';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'seo' });
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/farm',
    title: t('farmTitle'),
    description: t('farmDescription'),
  });
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
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const location = brandData.farm.location[locale];
  const description = brandData.farm.description[locale];

  // FIXME(unverified): farm/hero.jpg, farm-1..6.jpg 자산 부재 — 운영주 촬영본 입수 후
  // 각 placeholder를 next/image 로 교체.
  const galleryCount = 6;

  // TODO(legal): 정식 주소·연락처·좌표는 운영주 확인 후 채울 것. addressLocality 외에는
  // 검증되지 않은 정보를 LocalBusiness 구조화 데이터에 노출하지 않는다.
  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${getSiteUrl()}#farm`,
    name: 'GEUMBIT FARM',
    legalName: tFooter('company'),
    description,
    url: pageUrl('/farm', locale),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressRegion: 'Gyeonggi-do',
      addressLocality: 'Yeoncheon-gun',
    },
  };

  return (
    <>
      <Section tone="onyx" className="relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block z-10">
          <VerticalHanjaAccent chars="韓灘江" size="lg" />
        </div>
        <div
          className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden"
          style={{
            background:
              'radial-gradient(120% 80% at 30% 20%, var(--color-onyx-soft) 0%, var(--color-charcoal) 55%, var(--color-onyx) 100%)',
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-[200px] md:text-[280px] leading-none opacity-15 text-[var(--color-gold)] font-bold"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              韓灘江
            </span>
          </div>
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
                href="https://map.naver.com/?query=%EC%97%B0%EC%B2%9C+%ED%95%9C%ED%83%84%EA%B0%95"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block link-gold-underline text-sm text-[var(--color-oxblood)]"
              >
                지도에서 보기 <span aria-hidden="true">↗</span>
                <span className="sr-only"> {tFooter('openInNewTab')}</span>
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
            {Array.from({ length: galleryCount }, (_, i) => (
              <div
                key={i}
                className="relative aspect-[4/5] overflow-hidden border border-[var(--color-rule)]"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-parchment) 0%, var(--color-parchment-2) 100%)',
                }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span
                    className="text-[88px] leading-none opacity-15 text-[var(--color-gold-deep)] font-bold"
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                  >
                    桑黃
                  </span>
                  <span className="mt-3 label-section text-[var(--color-gold-deep)] opacity-40">
                    GALLERY · {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
    </>
  );
}
