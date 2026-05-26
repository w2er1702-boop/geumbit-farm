import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import certificationsData from '@/data/certifications.json';
import { isLocale, locales, type Locale } from '@/i18n';
import { buildPageMetadata } from '@/lib/seo';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';
import { CertificationCard, type Certification } from '@/components/CertificationCard';

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
    path: '/certifications',
    title: t('certificationsTitle'),
    description: t('certificationsDescription'),
  });
}

// TODO(certs): 운영주가 실제 보유 인증(유기농·GAP·HACCP·β-glucan 시험성적서 등)을
// 확정한 뒤 data/certifications.json 채우기. 확인 전엔 빈 배열 유지(허위표시 방지).
export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'certifications' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const entries = certificationsData as Certification[];

  return (
    <>
      <Section tone="onyx" className="py-24 relative overflow-hidden">
        <div className="absolute top-8 right-8 hidden md:block">
          <VerticalHanjaAccent chars="認證" size="lg" />
        </div>
        <Container>
          <SectionLabel>
            <span className="opacity-60">Ⅰ</span>
            <span className="gold-divider" />
            {t('title')}
          </SectionLabel>
          <h1 className="display display-1 mt-6 text-[var(--color-gold)]">
            {t('subtitle')}
          </h1>
          <GoldRule className="mt-10" />
        </Container>
      </Section>

      <Section tone="parchment" noise className="py-24">
        <Container>
          {entries.length === 0 ? (
            <div className="double-border bg-[var(--color-parchment-2)] p-12 lg:p-20 text-center">
              <span
                className="text-7xl text-[var(--color-gold)] opacity-40 font-bold"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
                aria-hidden="true"
              >
                準備中
              </span>
              <p className="mt-8 text-lg max-w-2xl mx-auto text-[var(--color-ink-muted)] leading-relaxed">
                {t('emptyState')}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {entries.map((entry) => (
                <CertificationCard
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  newTabLabel={tFooter('openInNewTab')}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
