---
name: fe-images
description: Delivers images that are light, sharp and stable - AVIF or WebP, srcset and sizes, picture for formats and art direction, width and height against layout shift, an eager high-priority LCP image, lazy loading below the fold, video instead of GIF, SVG for icons and logos, and the framework image components. Use when adding or reviewing images, a hero, a gallery, or when LCP or CLS is poor.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Images and media delivery
  area: performance
  lane: A
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "perf/img-dimensions perf/lcp-image-priority perf/srcset-sizes html/picture-img perf/img-modern-format perf/large-image perf/gif-to-video a11y/img-alt"
  version: 0.1.0
---

# Images and media delivery

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Every `<img>` has `width` and `height` (or a CSS `aspect-ratio`) so space is reserved (perf/img-dimensions).
- The likely LCP image is eager with `fetchpriority="high"`; never `loading="lazy"` on it (perf/lcp-image-priority).
- Images below the first screen get `loading="lazy"`; only one or two images get `fetchpriority="high"`.
- A `srcset` with `w` descriptors always has a matching `sizes` (perf/srcset-sizes).
- `<picture>` ends with an `<img>` carrying `src`, `alt`, `width` and `height` (html/picture-img).
- Photos are AVIF or WebP at the size they are shown, not large JPEG or PNG (perf/img-modern-format).
- No image file over the budget, 250 KB by default (perf/large-image); no GIF over 100 KiB, use a muted looping video (perf/gif-to-video).
- Every image has `alt`: the meaning, or `alt=""` when decorative (a11y/img-alt).
- Use the framework's image component when there is one; it writes `srcset`, sizes and formats for you.
- Logos and icons are SVG; the LCP image is in the HTML, not injected by JavaScript or hidden in a CSS background.

## Do this

1. Find the image pipeline first: `next/image`, `@nuxt/image`, Astro `<Image>` from `astro:assets`, Angular `NgOptimizedImage`, SvelteKit `enhanced:img`, or a build plugin. Use it instead of raw `<img>`.
2. For each image decide: LCP candidate (eager, `fetchpriority="high"`), in first view (eager), or below (lazy).
3. Write `width`/`height` from the file's intrinsic size and let CSS scale it: `img { max-width: 100%; height: auto; }`.
4. Generate widths that match the layout (for example 400, 800, 1200, 1600) and describe the rendered width in `sizes`.
5. Encode photos as AVIF (WebP or JPEG fallback in `<picture>` only if the targets need it); keep PNG for sharp screenshots if smaller, SVG for vector art.
6. For a CSS background that is the LCP element, preload it with `<link rel="preload" as="image" fetchpriority="high">` or turn it into an `<img>`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports images without size, a lazy LCP candidate, `srcset` without `sizes`, a picture without img, oversized files and GIFs.
- `audit --url <page>` adds Lighthouse's image delivery and LCP discovery insights for the rendered page.
- By hand: DevTools Network filtered to images on a mobile profile; the Performance panel names the LCP element.

## References

- [references/images.md](references/images.md): format choice, `srcset` and `sizes` recipes, art direction with `<picture>`, lazy loading and priority, framework image components with their current props, SVG handling, video instead of GIF, budgets. Read it when you add a hero, a gallery or an image component.
