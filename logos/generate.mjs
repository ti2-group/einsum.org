#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

function parseArguments(argv) {
  const result = { config: path.join(scriptDirectory, "logos.config.json"), ids: [], check: false, guides: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") result.check = true;
    else if (argument === "--guides") result.guides = true;
    else if (argument === "--config") result.config = path.resolve(argv[++index] ?? "");
    else if (argument === "--logo") result.ids.push(argv[++index] ?? "");
    else if (argument === "--help" || argument === "-h") result.help = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return result;
}

function usage() {
  return `Usage: node logos/generate.mjs [options]\n\n` +
    `  --config PATH  Use another configuration file\n` +
    `  --logo ID      Generate one logo (repeatable)\n` +
    `  --guides       Write editable dot-placement SVGs\n` +
    `  --check         Fail if an output is missing or stale\n`;
}

function assertNumber(value, label, { positive = false } = {}) {
  if (!Number.isFinite(value) || (positive && value <= 0)) {
    throw new Error(`${label} must be ${positive ? "a positive" : "a finite"} number`);
  }
}

function validate(config) {
  if (!config || typeof config !== "object" || !Array.isArray(config.logos)) {
    throw new Error("The config must contain a logos array");
  }
  const ids = new Set();
  for (const logo of config.logos) {
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(logo.id ?? "")) throw new Error(`Invalid logo id: ${logo.id}`);
    if (ids.has(logo.id)) throw new Error(`Duplicate logo id: ${logo.id}`);
    ids.add(logo.id);
    if (typeof logo.text !== "string" || !logo.text.length) throw new Error(`${logo.id}.text must not be empty`);
    if (!logo.colors?.fill || !logo.colors?.stroke) throw new Error(`${logo.id}.colors needs fill and stroke`);
    if (!Array.isArray(logo.dots)) throw new Error(`${logo.id}.dots must be an array`);
    for (const [index, dot] of logo.dots.entries()) {
      assertNumber(dot.x, `${logo.id}.dots[${index}].x`);
      assertNumber(dot.y, `${logo.id}.dots[${index}].y`);
      if (dot.relativeTo && !["initial", "initial-px", "canvas"].includes(dot.relativeTo)) {
        throw new Error(`${logo.id}.dots[${index}].relativeTo must be initial, initial-px, or canvas`);
      }
    }
    const custom = logo.initial?.customPath;
    if (custom) {
      if (typeof custom.d !== "string" || custom.d.length === 0) throw new Error(`${logo.id}.initial.customPath.d is required`);
      if (!Array.isArray(custom.viewBox) || custom.viewBox.length !== 4) throw new Error(`${logo.id}.initial.customPath.viewBox needs four numbers`);
      custom.viewBox.forEach((value, index) => assertNumber(value, `${logo.id}.initial.customPath.viewBox[${index}]`));
      assertNumber(custom.viewBox[2], `${logo.id} custom path width`, { positive: true });
      assertNumber(custom.viewBox[3], `${logo.id} custom path height`, { positive: true });
      if (custom.top !== undefined) assertNumber(custom.top, `${logo.id}.initial.customPath.top`);
    }
  }
}

function mergeLogo(defaults, logo) {
  return {
    ...logo,
    canvas: { ...defaults.canvas, ...logo.canvas },
    fonts: { ...defaults.fonts, ...logo.fonts },
    typography: { ...defaults.typography, ...logo.typography },
    initial: { ...defaults.initial, ...logo.initial },
    dotDefaults: { ...defaults.dots },
    modes: Object.fromEntries(
      Object.entries(defaults.modes).map(([name, mode]) => [name, { ...mode, ...logo.modes?.[name] }]),
    ),
    outputDirectory: defaults.outputDirectory ?? ".",
  };
}

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function n(value) {
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function union(boxes) {
  return boxes.reduce(
    (box, item) => ({
      minX: Math.min(box.minX, item.minX), minY: Math.min(box.minY, item.minY),
      maxX: Math.max(box.maxX, item.maxX), maxY: Math.max(box.maxY, item.maxY),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

function layoutGlyphs(font, text, size, originX, baseline, className) {
  if (!text) return { elements: [], box: null, width: 0 };
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  let cursor = 0;
  const elements = [];
  const boxes = [];
  for (let index = 0; index < run.glyphs.length; index += 1) {
    const glyph = run.glyphs[index];
    const position = run.positions[index];
    const x = originX + (cursor + position.xOffset) * scale;
    const y = baseline - position.yOffset * scale;
    const glyphBox = glyph.bbox;
    boxes.push({
      minX: x + glyphBox.minX * scale,
      minY: y - glyphBox.maxY * scale,
      maxX: x + glyphBox.maxX * scale,
      maxY: y - glyphBox.minY * scale,
    });
    elements.push(`<path class="${className}" d="${glyph.path.toSVG()}" transform="translate(${n(x)} ${n(y)}) scale(${n(scale)} ${n(-scale)})"/>`);
    cursor += position.xAdvance;
  }
  return { elements, box: union(boxes), width: cursor * scale };
}

function createInitial(logo, configDirectory) {
  const baseline = logo.typography.baseline;
  const custom = logo.initial.customPath;
  if (custom) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = custom.viewBox;
    const targetHeight = custom.height ?? logo.typography.initialSize;
    const scale = targetHeight / sourceHeight;
    const targetTop = custom.top ?? baseline - targetHeight;
    const transformX = -sourceX * scale;
    const transformY = targetTop - sourceY * scale;
    return {
      element: `<path class="logo-initial" d="${escapeXml(custom.d)}" transform="translate(${n(transformX)} ${n(transformY)}) scale(${n(scale)})"/>`,
      box: { minX: 0, minY: targetTop, maxX: sourceWidth * scale, maxY: targetTop + targetHeight },
    };
  }

  const fontPath = path.resolve(configDirectory, logo.initial.font ?? logo.fonts.initial);
  const font = fontkit.openSync(fontPath);
  const glyph = font.layout([...logo.text][0]).glyphs[0];
  const scale = logo.typography.initialSize / font.unitsPerEm;
  const glyphBox = glyph.bbox;
  const x = -glyphBox.minX * scale;
  return {
    element: `<path class="logo-initial" d="${glyph.path.toSVG()}" transform="translate(${n(x)} ${n(baseline)}) scale(${n(scale)} ${n(-scale)})"/>`,
    box: {
      minX: 0,
      minY: baseline - glyphBox.maxY * scale,
      maxX: (glyphBox.maxX - glyphBox.minX) * scale,
      maxY: baseline - glyphBox.minY * scale,
    },
  };
}

function resolvePaint(value, colors, fallback) {
  const token = value ?? fallback;
  return token === "none" ? "none" : (colors[token] ?? token);
}

function render(logo, mode, configDirectory, { guides = false } = {}) {
  const { width, height } = logo.canvas;
  const colors = { ...logo.colors, ...mode };
  const initial = createInitial(logo, configDirectory);
  const textFont = fontkit.openSync(path.resolve(configDirectory, logo.fonts.text));
  const remainingText = [...logo.text].slice(1).join("");
  const textX = initial.box.maxX + logo.typography.gap;
  const text = layoutGlyphs(textFont, remainingText, logo.typography.textSize, textX, logo.typography.baseline, "logo-text");

  const dots = logo.dots.map((entry) => {
    const dot = { ...logo.dotDefaults, ...entry };
    const radius = dot.radius;
    const strokeWidth = dot.strokeWidth;
    const extent = radius + strokeWidth / 2;
    const relativeTo = dot.relativeTo ?? "initial";
    const isCanvas = relativeTo === "canvas";
    const isPixels = relativeTo === "initial-px";
    const cx = (isCanvas ? dot.x : initial.box.minX + (isPixels ? dot.x : dot.x * (initial.box.maxX - initial.box.minX))) + (dot.dx ?? 0);
    const cy = (isCanvas ? dot.y : initial.box.minY + (isPixels ? dot.y : dot.y * (initial.box.maxY - initial.box.minY))) + (dot.dy ?? 0);
    return {
      cx, cy, radius, strokeWidth, relativeTo,
      fill: resolvePaint(dot.fill, colors, "fill"), stroke: resolvePaint(dot.stroke, colors, "stroke"),
      box: { minX: cx - extent, minY: cy - extent, maxX: cx + extent, maxY: cy + extent },
    };
  });

  const relativeDots = dots.filter((dot) => dot.relativeTo !== "canvas");
  const canvasDots = dots.filter((dot) => dot.relativeTo === "canvas");
  const contentBox = union([initial.box, ...(text.box ? [text.box] : []), ...relativeDots.map((dot) => dot.box)]);
  const contentWidth = contentBox.maxX - contentBox.minX;
  if (contentWidth > width) {
    throw new Error(`${logo.id} is ${n(contentWidth)}px wide but its canvas is ${n(width)}px; reduce typography.textSize or dot extents`);
  }
  const shiftX = (width - (contentBox.maxX - contentBox.minX)) / 2 - contentBox.minX;
  const initialFill = resolvePaint(logo.initial.fill, colors, "fill");
  const initialStroke = resolvePaint(logo.initial.stroke, colors, "stroke");
  const lineJoin = logo.initial.lineJoin ?? "round";
  const makeDot = (dot) =>
    `<circle cx="${n(dot.cx)}" cy="${n(dot.cy)}" r="${n(dot.radius)}" fill="${escapeXml(dot.fill)}" stroke="${escapeXml(dot.stroke)}" stroke-width="${n(dot.strokeWidth)}"/>`;
  const initialWidth = initial.box.maxX - initial.box.minX;
  const initialHeight = initial.box.maxY - initial.box.minY;
  const grid = [];
  for (let x = 0; x <= initialWidth; x += 5) grid.push(`<line x1="${n(x)}" y1="0" x2="${n(x)}" y2="${n(initialHeight)}"/>`);
  for (let y = 0; y <= initialHeight; y += 5) grid.push(`<line x1="0" y1="${n(y)}" x2="${n(initialWidth)}" y2="${n(y)}"/>`);
  const editableDots = relativeDots.map((dot, index) => {
    const x = dot.cx - initial.box.minX;
    const y = dot.cy - initial.box.minY;
    return `<g id="dot-${index + 1}" data-config-relative-to="initial-px" transform="translate(${n(x)} ${n(y)})">
        <circle cx="0" cy="0" r="${n(dot.radius)}" fill="${escapeXml(dot.fill)}" stroke="${escapeXml(dot.stroke)}" stroke-width="${n(dot.strokeWidth)}"/>
        <path d="M-3 0H3M0 -3V3" fill="none" stroke="#ff006e" stroke-width="0.75" pointer-events="none"/>
      </g>`;
  });
  const relativeDotElements = guides ? [] : relativeDots.map(makeDot);
  const canvasDotElements = canvasDots.map(makeDot);
  const guideElements = guides ? `<g id="initial-coordinate-system" transform="translate(${n(initial.box.minX)} ${n(initial.box.minY)})">
      <g fill="none" stroke="#00a6fb" stroke-width="0.35" stroke-opacity="0.55" pointer-events="none">
        ${grid.join("\n        ")}
        <rect x="0" y="0" width="${n(initialWidth)}" height="${n(initialHeight)}" stroke-width="0.8" stroke-dasharray="2 1"/>
      </g>
      <circle cx="0" cy="0" r="1.5" fill="#ff006e" pointer-events="none"/>
      ${editableDots.join("\n      ")}
    </g>` : "";
  const title = `${logo.text} logo (${guides ? "dot placement guide" : `${mode.name} mode`})`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(width)} ${n(height)}" width="${n(width)}" height="${n(height)}" role="img" aria-labelledby="title">
  <title id="title">${escapeXml(title)}</title>
  <!-- Generated by generate.mjs from logos.config.json. Do not edit by hand. -->
  <g transform="translate(${n(shiftX)} 0)">
    <g fill="${escapeXml(initialFill)}" stroke="${escapeXml(initialStroke)}" stroke-width="${n(logo.initial.strokeWidth)}" stroke-linejoin="${lineJoin}" paint-order="stroke fill">
      ${initial.element}
    </g>
    <g fill="${escapeXml(mode.text)}">
      ${text.elements.join("\n      ")}
    </g>
    ${relativeDotElements.join("\n    ")}
    ${guideElements}
  </g>
  ${canvasDotElements.join("\n  ")}
</svg>
`;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage());
    return;
  }
  const configPath = path.resolve(args.config);
  const configDirectory = path.dirname(configPath);
  const config = JSON.parse(await readFile(configPath, "utf8"));
  validate(config);
  const selected = args.ids.length ? config.logos.filter((logo) => args.ids.includes(logo.id)) : config.logos;
  const missing = args.ids.filter((id) => !selected.some((logo) => logo.id === id));
  if (missing.length) throw new Error(`Unknown logo id(s): ${missing.join(", ")}`);

  let stale = false;
  for (const entry of selected) {
    const logo = mergeLogo(config.defaults, entry);
    if (args.guides) {
      const modeConfig = logo.modes.light ?? Object.values(logo.modes)[0];
      const svg = render(logo, { name: "light", ...modeConfig }, configDirectory, { guides: true });
      const outputName = entry.output ?? entry.id[0].toUpperCase() + entry.id.slice(1);
      const guideDirectory = path.resolve(configDirectory, "guides");
      const outputPath = path.join(guideDirectory, `${outputName}.svg`);
      await mkdir(guideDirectory, { recursive: true });
      await writeFile(outputPath, svg, "utf8");
      process.stdout.write(`Wrote ${path.relative(process.cwd(), outputPath)}\n`);
      continue;
    }
    for (const [modeName, modeConfig] of Object.entries(logo.modes)) {
      const svg = render(logo, { name: modeName, ...modeConfig }, configDirectory);
      const outputName = entry.output ?? entry.id[0].toUpperCase() + entry.id.slice(1);
      const outputPath = path.resolve(configDirectory, logo.outputDirectory, `${outputName}_${modeName}.svg`);
      if (args.check) {
        const current = await readFile(outputPath, "utf8").catch(() => null);
        if (current !== svg) {
          stale = true;
          process.stderr.write(`Stale or missing: ${path.relative(process.cwd(), outputPath)}\n`);
        }
      } else {
        await writeFile(outputPath, svg, "utf8");
        process.stdout.write(`Wrote ${path.relative(process.cwd(), outputPath)}\n`);
      }
    }
  }
  if (stale) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
