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
          autogenerate: { directory: 'Guides' },
        },
        { label: 'Reference', autogenerate: { directory: 'Reference' } },
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
