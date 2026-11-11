---
id: perf/font-woff2
title: Web fonts are served as WOFF2; TTF, OTF, EOT and plain WOFF files are dead weight for current browsers.
severity: moderate
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
skill: fe-fonts
since: 0.1.0
sources:
  - title: web.dev, Best practices for fonts (font compression)
    url: https://web.dev/articles/font-best-practices
  - title: MDN, src descriptor of @font-face
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
---

## Why

WOFF2 is the best-compressed font format and every current browser reads it. A TTF or OTF file of the same font is often two or three times larger, and EOT and SVG fonts exist only for browsers that are long gone, so they cost download time on the text the page is waiting for.

## Fix

Convert the font to WOFF2 (check that its licence allows web use and conversion) and list only `url("font.woff2") format("woff2")` in `src`. Subset it to the characters you use while you are at it.

## Examples

```css
/* bad */
@font-face { font-family: "Brand"; src: url("brand.ttf") format("truetype"); font-display: swap; }
/* good */
@font-face { font-family: "Brand"; src: url("brand.woff2") format("woff2"); font-display: swap; }
```
