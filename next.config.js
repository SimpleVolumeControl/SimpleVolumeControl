const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer(
  withNextIntl({
    reactStrictMode: true,
    eslint: {
      dirs: ['.'],
    },
  }),
);
