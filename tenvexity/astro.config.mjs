import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Tenvexity",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/styles.css"],
      components: {
        PageTitle: "./src/components/PageTitle.astro",
      },
    }),
    tailwind({
      applyBaseStyles: false,
      configFile: "./tenvexity/tailwind.config.mjs",
    }),
    react(),
  ],
  vite: {
    server: {
      proxy: {
        "/api": "http://127.0.0.1:5000",
      },
    },
  },
});
