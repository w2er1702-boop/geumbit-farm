import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const isProd = process.env.NODE_ENV === 'production';
const repo = 'geumbit-farm';
const useCustomDomain = false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd && !useCustomDomain ? `/${repo}` : '',
  assetPrefix: isProd && !useCustomDomain ? `/${repo}/` : '',
  trailingSlash: true,
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
