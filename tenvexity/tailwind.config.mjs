import colors from "tailwindcss/colors";
import starlightPlugin from "@astrojs/starlight-tailwind";
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: [
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      "../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
  },
  theme: {
    extend: {
      colors: {
        // Your preferred accent color. Indigo is closest to Starlight’s defaults.
        accent: colors.indigo,
        // Your preferred gray scale. Zinc is closest to Starlight’s defaults.
        gray: colors.zinc,
        success: {
          DEFAULT: "#12b886",
          foreground: "#fff",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [starlightPlugin(), nextui()],
};
