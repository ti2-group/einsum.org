import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://tenvexity.einsum.org',
  integrations: [
    starlight({
      title: 'Tenvexity',
      logo: {
        src: './public/favicon.svg',
        alt: 'Tenvexity',
      },
      social: {
        github: 'https://github.com/ti2-group/einsum.org',
      },
      customCss: ['./src/styles.css'],
      components: {
        PageTitle: './src/overrides/PageTitle.astro',
        Search: './src/overrides/Search.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/ti2-group/einsum.org/edit/main/tenvexity/',
      },
    }),
    tailwind({
      applyBaseStyles: false,
      configFile: './tenvexity/tailwind.config.mjs',
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
