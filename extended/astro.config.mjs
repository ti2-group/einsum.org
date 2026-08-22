import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://extended.einsum.org',
  integrations: [
    starlight({
      title: 'Extended Einsum',
      logo: {
        light: './public/Extended_light.svg',
        alt: 'Extended Einsum',
        dark: './public/Extended_dark.svg',
        replacesTitle: true,
      },
      favicon: 'favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/ti2-group/extended_einsum',
        },
      ],
      customCss: ['./src/styles.css'],
      components: {
        PageTitle: './src/overrides/PageTitle.astro',
        Search: './src/overrides/Search.astro',
        PageFrame: './src/overrides/PageFrame.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/ti2-group/einsum.org/edit/main/extended/',
      },
      sidebar: [
        { label: 'Home', slug: '' },
        {
          label: 'Getting started',
          autogenerate: { directory: 'Getting Started' },
        },
        {
          label: 'How-to guides',
          autogenerate: { directory: 'Guides' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'Reference' },
        },
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
