import colors from 'tailwindcss/colors';
import starlightPlugin from '@astrojs/starlight-tailwind';
import { lightLayout, heroui } from '@heroui/react';

const primaryColors = {
  100: '#C5E8F6',
  200: '#8FCEEE',
  300: '#529DCE',
  400: '#27699D',
  500: '#002F5D',
  600: '#00244F',
  700: '#001B42',
  800: '#001335',
  900: '#000D2C',
};

const invertedPrimaryColors = Object.fromEntries(
  Object.entries(primaryColors).map(([key, value]) => [1000 - key, value]),
);>

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: [
      './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
      '../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
  },
  theme: {
    extend: {
      colors: {
        // Your preferred accent color. Indigo is closest to Starlight’s defaults.
        accent: primaryColors,
        // Your preferred gray scale. Zinc is closest to Starlight’s defaults.
        gray: colors.zinc,
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [
    starlightPlugin(),
    heroui({
      themes: {
        light: {
          colors: {
            primary: { ...primaryColors, foreground: '#fff', DEFAULT: primaryColors['500'] },
          },
        },
        dark: {
          colors: {
            primary: {
              ...invertedPrimaryColors,
              foreground: '#000',
              DEFAULT: invertedPrimaryColors['800'],
            },
          },
        },
      },
    }),
  ],
};
