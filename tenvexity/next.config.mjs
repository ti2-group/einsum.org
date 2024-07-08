/** @type {import('next').NextConfig} */

import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
});

const nextConfig = withNextra({
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => [
    {
      source: '/api',
      destination: 'http://tenvexity.api.einsum.org/api/',
    },
  ],
  output: 'export',
  images: {
    unoptimized: true,
  },
});

export default nextConfig;
