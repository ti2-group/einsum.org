# einsum.org logos

`logos.config.json` is the source of truth. `generate.mjs` turns Inter glyphs into
SVG paths and writes a transparent light- and dark-mode SVG for every configured
logo. The generated files do not require the font to be installed by the viewer.
Every logo uses the same 300 x 64 artboard and is centered from its complete
visible bounds, including dots. The initial uses Inter Semi Bold while the
remaining text uses Inter Medium. Dots are solid and use the darker brand stroke
color by default.

```sh
npm run logos:generate
npm run logos:check
npm run logos:guides -- --logo sql
node logos/generate.mjs --logo benchmark
```

## Adding a logo

Add an entry to the `logos` array:

```json
{
  "id": "example",
  "text": "Example",
  "colors": { "fill": "#9ecae1", "stroke": "#3182bd" },
  "dots": [
    { "relativeTo": "initial", "x": 0, "y": 0 },
    { "relativeTo": "initial", "x": 1, "y": 0.5 },
    { "relativeTo": "initial", "x": 0, "y": 1 }
  ]
}
```

Coordinates with `"relativeTo": "initial"` use the measured visible bounds of
the large first glyph: `(0, 0)` is its top-left and `(1, 1)` its bottom-right.
`dx` and `dy` add pixel offsets after that calculation. For fixed artboard
coordinates, use `"relativeTo": "canvas"`; those `x`/`y` values are pixels and
are not affected by horizontal logo centering.

## Placing dots visually

Generate an editable guide and open it in an SVG editor:

```sh
npm run logos:guides -- --logo sql
```

The result is `logos/guides/SQL.svg`. The cyan rectangle is the measured visible
box of the large initial, its magenta top-left marker is `(0, 0)`, and grid lines
are 5px apart. Each editable group is named `dot-1`, `dot-2`, and so on. Move a
dot group onto the stroke centerline, then read the two numbers from its
`transform="translate(x y)"`. Copy them directly into the config:

```json
{ "relativeTo": "initial-px", "x": 31, "y": 7 }
```

With `initial-px`, `x` and `y` are absolute pixels from that measured top-left
marker. They remain stable when the complete logo is re-centered or the common
artboard width changes. Running the guide command again regenerates the file, so
copy adjusted coordinates back into the config before doing that.

Per-dot `radius`, `strokeWidth`, `fill`, and `stroke` override the defaults.
Paint values can be `fill`, `stroke`, `text`, `none`, or a literal CSS color.
To vary a brand color by mode, add `fill` and/or `stroke` below that logo's
`modes.light` or `modes.dark` entry; otherwise both modes share `colors`.

## Custom initial paths

Set `initial.customPath` instead of relying on the first glyph:

```json
"initial": {
  "customPath": {
    "d": "M29 0H0L15 20 0 40H29",
    "viewBox": [0, 0, 29, 40],
    "height": 40,
    "top": 12
  },
  "fill": "none",
  "stroke": "stroke",
  "strokeWidth": 8,
  "lineJoin": "round"
}
```

`viewBox` describes the path's measured `[x, y, width, height]` bounds. The
generator scales that box to `height` and uses the resulting bounds for relative
dot placement. By default its geometric bottom meets the typography baseline.
Set `top` when stroke thickness requires optical alignment: with `top: 12`, this
40px path ends at y=52 and its 8px stroke visually ends at y=56 beside the y=57
text baseline. The first Unicode character of `text` is still omitted from the
smaller text.

The JSON Schema enables config validation and editor completion in editors that
support the `$schema` property. The generator also performs concise runtime
validation before writing files.

## Website integration

The SVG files in this directory are the only maintained logo outputs. Website
`public/` directories contain relative symlinks to these files, so regenerating
the central files updates every site without copying them by hand. Square
favicons remain separate because wordmarks are unsuitable for browser tabs.

Astro dereferences the symlinks when building. Real SVG copies inside ignored
`dist/` directories are therefore expected deployment artifacts, not additional
source files.
