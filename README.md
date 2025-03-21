# Einsum.org

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)



## 🚀 Project Structure

Every page has its own subfolder, e.g. tenvexity for tenvexity.einsum.org. I
Inside these site folders project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   │   └── config.ts
│   └── env.d.ts
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, i.e. not in the site specific folder from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run sitenamehere:dev`             | Starts local dev server at `localhost:4321`      |
| `npm run sitenamehere:build`           | Build your production site to `./dist/`          |
| `npm run sitenamehere:preview`         | Preview your build locally, before deploying     |
| `npm run astro -- --root ./sitenamehere ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

So if you want change e.g. tenvexity locally you need to run  `npm run tenvexity:dev`. 

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).


The page is deployed via Cloudflare Pages.