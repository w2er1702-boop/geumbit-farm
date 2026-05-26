import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import {
  Noto_Serif_KR,
  Noto_Sans_KR,
  Cinzel,
  Noto_Serif_SC,
  Noto_Sans_SC,
  EB_Garamond,
  JetBrains_Mono,
} from 'next/font/google';
import { locales, isLocale, type Locale } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});
const notoSerifSc = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});
const notoSansSc = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const fontVariables = [
  notoSerifKr.variable,
  notoSansKr.variable,
  cinzel.variable,
  notoSerifSc.variable,
  notoSansSc.variable,
  ebGaramond.variable,
  jetbrainsMono.variable,
].join(' ');

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

  const t = await getTranslations({ locale, namespace: 'home' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://w2er1702-boop.github.io/geumbit-farm';

  const titleByLocale: Record<Locale, string> = {
    ko: '금빛농원 · GEUMBIT FARM',
    en: 'GEUMBIT FARM · 금빛농원',
    zh: '金光农园 · GEUMBIT FARM',
  };

  return {
    metadataBase: new URL(siteUrl),
    title: { default: titleByLocale[locale as Locale], template: `%s · ${titleByLocale[locale as Locale]}` },
    description: t('heroSlogan'),
    openGraph: {
      title: titleByLocale[locale as Locale],
      description: t('heroSlogan'),
      images: ['/og-default.jpg'],
      siteName: titleByLocale[locale as Locale],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    other: { company: tFooter('company') },
  };
}

const htmlLangMap: Record<Locale, string> = { ko: 'ko', en: 'en', zh: 'zh-CN' };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={htmlLangMap[locale]} className={fontVariables}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="bg-[var(--color-parchment)] text-[var(--color-ink)] antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
