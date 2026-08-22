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

## Logos

The files in `logos/` are generated from `logos/logos.config.json`. The SVGs use
a common artboard, include light- and dark-mode variants, and contain converted
Inter glyph paths, so viewers do not need the font installed.

```sh
# Regenerate every light/dark SVG
npm run logos:generate

# Verify that committed SVGs match the config
npm run logos:check

# Generate only one logo
node logos/generate.mjs --logo sql
```

### Placing dots visually

Generate an editable placement guide for a logo:

```sh
npm run logos:guides -- --logo sql
```

Open `logos/guides/SQL.svg` in an SVG editor. The cyan rectangle is the measured
visible box of the large initial, the magenta top-left marker is coordinate
`(0, 0)`, and grid lines are 5px apart. Each movable dot group is named `dot-1`,
`dot-2`, and so on.

Move a dot group onto the desired stroke centerline. Its SVG transform will look
like `transform="translate(31.7 10.5)"`. Copy those two numbers into the logo
config using absolute coordinates relative to the initial's measured top-left:

```json
{ "relativeTo": "initial-px", "x": 31.7, "y": 10.5 }
```

For example, the two dots on the `S` in SQL are placed at the upper-right and
lower-left ends of its curve. Guide SVGs are temporary and Git-ignored; copy the
coordinates into `logos/logos.config.json` before regenerating a guide.

See [`logos/README.md`](logos/README.md) for the complete configuration reference,
including normalized coordinates, custom initial paths, colors, and per-mode
overrides.

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).


The page is deployed via Cloudflare Pages.
