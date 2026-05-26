import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, locales, type Locale } from '@/i18n';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  // TODO(legal): 운영주 확인 후 정식 개인정보처리방침 본문 게시.
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <>
      <Section tone="onyx" className="py-20">
        <Container size="reading">
          <SectionLabel>{t('privacySubtitle')}</SectionLabel>
          <h1 className="display display-2 mt-4 text-[var(--color-gold)]">
            {t('privacyTitle')}
          </h1>
          <GoldRule className="mt-8" />
        </Container>
      </Section>
      <Section tone="parchment" noise className="py-20">
        <Container size="reading">
          <p className="text-base leading-relaxed text-[var(--color-ink-muted)]">
            {t('privacyPlaceholder')}
          </p>
        </Container>
      </Section>
    </>
  );
}
