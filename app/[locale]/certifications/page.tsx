import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import certificationsData from '@/data/certifications.json';
import { isLocale, locales, type Locale } from '@/i18n';
import { Section, Container, SectionLabel } from '@/components/Section';
import { GoldRule } from '@/components/GoldRule';
import { VerticalHanjaAccent } from '@/components/VerticalHanjaAccent';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type CertEntry = {
  id: string;
  name: Record<Locale, string>;
  issuer: Record<Locale, string>;
  issuedAt: string;
  image?: string;
  pdf?: string;
};

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
  const entries = certificationsData as CertEntry[];

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
              >
                準備中
              </span>
              <p className="mt-8 text-lg max-w-2xl mx-auto text-[var(--color-ink-muted)] leading-relaxed">
                {t('emptyState')}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <div key={entry.id} className="double-border bg-[var(--color-parchment-2)] p-6">
                  <div className="aspect-[4/3] bg-[var(--color-parchment)] mb-4 flex items-center justify-center">
                    {entry.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.image} alt={entry.name[locale]} className="max-h-full max-w-full" />
                    ) : (
                      <span className="label-section text-[var(--color-ink-muted)]">No image</span>
                    )}
                  </div>
                  <h3 className="display text-lg mb-2">{entry.name[locale]}</h3>
                  <p className="text-sm text-[var(--color-ink-muted)]">{entry.issuer[locale]}</p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1 mono">{entry.issuedAt}</p>
                  {entry.pdf && (
                    <a
                      href={entry.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block link-gold-underline label-section text-[var(--color-oxblood)]"
                    >
                      PDF ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
