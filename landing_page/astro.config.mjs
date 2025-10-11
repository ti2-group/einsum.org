import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://einsum.org',
  integrations: [react()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
