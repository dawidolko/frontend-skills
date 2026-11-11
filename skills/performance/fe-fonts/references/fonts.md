# Web fonts reference

Depth for the `fe-fonts` skill. Rule ids in brackets: `frontend-skills explain <id>`. Checked on 2026-11-11 (`docs/sources/performance.md`).

## font-display

| Value | Before the font arrives | When it arrives late | Use |
| --- | --- | --- | --- |
| `swap` | fallback text at once | swaps in (text may reflow) | brand and heading fonts [perf/font-display] |
| `optional` | fallback text at once | kept if the font is not there almost at once | body text when layout shift matters |
| `fallback` | invisible very briefly, then fallback | swaps only within a short window | a middle ground |
| `block`, `auto` | invisible for up to about 3 s | swaps | avoid for text |

## A self-hosted setup

```css
@font-face {
  font-family: "Inter";
  src: url("../fonts/inter-var-latin.woff2") format("woff2");
  font-weight: 100 900;          /* variable font: one file for every weight */
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212;
}
@font-face {
  font-family: "Inter Fallback";  /* metric-matched fallback [perf/font-fallback-metrics] */
  src: local("Arial");
  size-adjust: 107%;
}
:root { --font-sans: "Inter", "Inter Fallback", system-ui, sans-serif; }
body { font-family: var(--font-sans); }
```

```html
<link rel="preload" href="/assets/inter-var-latin.woff2" as="font" type="font/woff2" crossorigin>
```

- WOFF2 only [perf/font-woff2]; the path goes through the bundler [css/asset-url] (a preload in HTML must point at the final URL, which framework font tools handle).
- Preload one or two files at most; a preload ignores `unicode-range` and competes with the LCP image. Without `crossorigin` the font is fetched twice [perf/font-preload-crossorigin].
- Find the `size-adjust` value by comparing the two fonts' average character widths, or let a framework compute it; `ascent-override`, `descent-override` and `line-gap-override` refine it where supported.

## Subsetting and languages

- Subset to the scripts the site uses (Latin, Latin Extended for Polish, Cyrillic…) and declare one `@font-face` per subset with `unicode-range`: the browser downloads only the subsets the page's text needs.
- Polish needs Latin Extended-A characters (`ą ć ę ł ń ó ś ź ż`); check them in the subset.
- Check the font licence for web use and modification (subsetting and conversion).

## Font CDN

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap">
```

Files come from a second origin; preconnect to it with `crossorigin` and add `display=swap` [perf/font-preconnect, perf/font-display]. Self-hosting removes both connections and is usually simpler with a framework tool.

## System font stack

```css
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
code { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
```

No download, no shift; a good default for apps and admin interfaces.

## Framework tools

| Stack | Tool | What it does |
| --- | --- | --- |
| Next.js | `next/font/google`, `next/font/local` | downloads at build time and self-hosts (no request to Google from the browser), `display` defaults to `swap`, preloads, `adjustFontFallback` generates a metric-matched fallback |
| Nuxt | `@nuxt/fonts` | finds `font-family` in your CSS, downloads and self-hosts from providers, generates metric-matched fallbacks; subsetting is opt-in |
| Any Vite project | `@font-face` with relative `url()` | the bundler hashes the file; preload the hashed URL through the framework |

## Icon fonts

Icon fonts download whole sets, render as letters when the font fails, and are read as random characters by screen readers. Use SVG icons from the project's icon set (`css/icon-from-set`).

## Sources

- web.dev, Best practices for fonts: https://web.dev/articles/font-best-practices
- web.dev, Optimize CLS (web fonts): https://web.dev/articles/optimize-cls
- MDN, @font-face: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face
- MDN, font-display: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- MDN, unicode-range: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
- MDN, size-adjust: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
- MDN, Variable fonts guide: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
- Next.js, Font: https://nextjs.org/docs/app/api-reference/components/font
- Nuxt Fonts: https://fonts.nuxt.com/
