---
name: fe-fonts
description: Loads web fonts fast and without layout shift - self-hosted WOFF2, font-display, a correct preload with crossorigin, subsetting and unicode-range, variable fonts, metric-matched fallbacks, system font stacks, and next/font or @nuxt/fonts. Use when adding or changing fonts, when text is invisible or jumps while loading, or when Lighthouse flags fonts.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Web fonts
  area: performance
  lane: A
  requires: web
  globs: "**/*.css **/*.scss **/*.less **/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro"
  rules: "perf/font-display perf/font-woff2 perf/font-preload-crossorigin perf/font-preconnect perf/font-fallback-metrics css/asset-url"
  version: 0.1.0
---

# Web fonts

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Every `@font-face` and font CDN URL sets `font-display` (`swap`, or `optional` for body text when layout shift matters) (perf/font-display).
- Serve WOFF2 only (perf/font-woff2).
- Self-host fonts from your own origin; with a font CDN, preconnect to its file origin with `crossorigin` (perf/font-preconnect).
- Preload at most the one or two fonts used in the first view, with `as="font" type="font/woff2" crossorigin` (perf/font-preload-crossorigin).
- Match the fallback font's metrics with `size-adjust` so the swap does not shift the layout (perf/font-fallback-metrics).
- Reference font files by a relative path or alias the bundler resolves (css/asset-url).
- Subset to the scripts you use and split them with `unicode-range`; check that the licence allows it.
- One variable font file instead of one file per weight when you use three or more weights.
- Use the framework's font tool when there is one (`next/font`, `@nuxt/fonts`); it self-hosts, preloads and adjusts fallbacks.
- Icons are SVG, not icon fonts; consider the system font stack when brand type is not essential.

## Do this

1. Find where fonts are declared: a fonts stylesheet, the root layout (`next/font` call, `<link>` to a CDN), `nuxt.config` (`@nuxt/fonts`), Tailwind `@theme` `--font-*`.
2. Count the families, weights and styles actually used; drop the rest.
3. Self-host as WOFF2, subset, write `@font-face` with `font-display` and, for a variable font, a `font-weight` range (`100 900`).
4. Preload only the font of the first visible text (usually one weight of the body or heading font).
5. Add a metric-matched fallback `@font-face` and list it right after the web font in `font-family`.
6. Measure: the text is visible at first paint and the swap moves nothing (Performance panel, layout shift regions).

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports `@font-face` and Google Fonts URLs without `font-display`, non-WOFF2 fonts, preloads without `crossorigin` and a font CDN without preconnect.
- `audit --url <page>` adds Lighthouse's font display insight.
- By hand: throttle the network to Slow 4G and reload: the text appears at once and does not jump when the font arrives.

## References

- [references/fonts.md](references/fonts.md): `font-display` values compared, a complete self-hosted setup, preload rules, subsetting and `unicode-range`, variable fonts, fallback metrics, system font stacks, `next/font` and `@nuxt/fonts`. Read it when you set up or change the project's fonts.
