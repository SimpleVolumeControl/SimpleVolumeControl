import bundleAnalyzer from '@next/bundle-analyzer';
import nextIntl from 'next-intl/plugin';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = nextIntl();

/** @type {import('next').NextConfig} */
export default withBundleAnalyzer(
  withNextIntl({
    reactStrictMode: true,
  }),
);
