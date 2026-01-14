import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tensor-optimization.pages.dev/',
  integrations: [react()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
  vite: {
    server: {
      proxy: {
        // '/api': 'http://127.0.0.1:5000',
        '/api': {
          target: 'http://127.0.0.1:5000',
          bypass: (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, code: 'implementation in progress' }));
            return false;
          },
        },
      },
    },
    plugins: [tailwindcss()],
  },
});
