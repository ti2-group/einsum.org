import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://benchmark.einsum.org',
  integrations: [
    starlight({
      title: 'Einsum Benchmark',
      logo: {
        light: './public/favicon.svg',
        alt: 'Sigma',
        dark: './public/favicon-dark.svg',
        replacesTitle: true,
      },
      // Set main and additional favicons
      favicon: 'favicon.svg',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon/favicon-48x48.png',
            sizes: '48x48',
          },
        },
        { tag: 'link', attrs: { rel: 'shortcut icon', href: '/favicon.ico' } },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/favicon/apple-touch-icon.png',
          },
        },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: 'Benchmark' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/favicon/site.webmanifest' } },
      ],
      social: {
        github: 'https://github.com/ti2-group/einsum_benchmark',
      },
      customCss: ['./src/styles.css'],
      components: {
        PageTitle: './src/overrides/PageTitle.astro',
        Search: './src/overrides/Search.astro',
        PageFrame: './src/overrides/PageFrame.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/ti2-group/einsum.org/edit/main/benchmark/',
      },
      sidebar: [
        { label: 'Home', slug: '' },
        {
          label: 'Guides',
          autogenerate: { directory: 'Documentation/Guides' },
        },
        { label: 'Reference', autogenerate: { directory: 'Documentation/Reference' } },
        { label: 'Experiments', slug: 'experiments' },
        { label: 'Team', slug: 'team', attrs: { class: 'sm:hidden' } },
      ],
    }),
    tailwind({
      applyBaseStyles: false,
      configFile: './benchmark/tailwind.config.mjs',
    }),
    react(),
  ],
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: 'Reference', href: '/reference' },
    { label: 'Experiments', href: '/experiments' },
    { label: 'Team', href: '/team' },
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
  vite: {
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:5000',
      },
    },
  },
});
