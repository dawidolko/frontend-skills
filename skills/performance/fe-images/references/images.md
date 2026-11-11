# Images reference

Depth for the `fe-images` skill. Rule ids in brackets: `frontend-skills explain <id>`. Checked on 2026-11-11 (`docs/sources/performance.md`, framework docs linked below).

## Formats

| Content | Format | Notes |
| --- | --- | --- |
| Photos, complex images | AVIF, else WebP | AVIF Baseline Widely available since 2026-07-25, WebP since 2023-03-16 (webstatus.dev) [perf/img-modern-format] |
| Screenshots, flat UI with text | PNG or lossless WebP/AVIF | compare sizes; lossy formats blur text |
| Logos, icons, illustrations | SVG | optimise (strip metadata); icons from the project's icon set |
| Animation | MP4/WebM `<video>` | GIF over 100 KiB is flagged [perf/gif-to-video] |

Budget: a single image above `audit.budgets.imageKB` (250 KB by default) is reported [perf/large-image].

## Sizing and layout shift

```html
<img src="card-800.avif" alt="Wool scarf" width="800" height="600">
```

```css
img { max-width: 100%; height: auto; }
.thumb { aspect-ratio: 1; object-fit: cover; }
```

`width` and `height` give the browser the aspect ratio before the file arrives, so the layout does not jump [perf/img-dimensions].

## srcset and sizes

```html
<img src="card-800.avif"
     srcset="card-400.avif 400w, card-800.avif 800w, card-1200.avif 1200w"
     sizes="(width >= 64rem) 25vw, (width >= 40rem) 50vw, 100vw"
     alt="Wool scarf" width="800" height="600" loading="lazy">
```

- `sizes` describes the rendered width at each layout; without it the browser assumes `100vw` [perf/srcset-sizes].
- `x` descriptors only for fixed-size images (`logo.png 1x, logo@2x.png 2x`); never mix `w` and `x`.
- `sizes="auto"` with lazy images is not Baseline yet; write the widths.

## picture

```html
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="100vw">
  <source media="(width < 40rem)" srcset="hero-portrait.avif">
  <img src="hero-1600.jpg" alt="Autumn collection" width="1600" height="900" fetchpriority="high">
</picture>
```

Sources offer formats (`type`) or crops (`media`); the `<img>` renders and carries `alt` and size [html/picture-img].

## Loading priority

| Image | Attributes |
| --- | --- |
| The LCP image (hero, first large image) | no `loading` (eager), `fetchpriority="high"` [perf/lcp-image-priority] |
| Other images in the first view | no `loading` |
| Below the first view | `loading="lazy"` (Baseline Widely available since 2026-06-19) |
| Carousel slides after the first | `loading="lazy"`, `fetchpriority="low"` |

- At most one or two `fetchpriority="high"` per page; boosting everything boosts nothing.
- The LCP image must be in the server HTML. A CSS background or JavaScript-injected hero is found late; if it must stay, preload it.

## Framework components (checked 2026-11-11)

| Stack | Component | LCP image | Notes |
| --- | --- | --- | --- |
| Next.js 16 | `next/image` | `fetchPriority="high"` or `loading="eager"` | lazy by default; `priority` deprecated in v16 for `preload`; needs `width`/`height` or `fill`; set `sizes` |
| Nuxt 4 | `<NuxtImg>`, `<NuxtPicture>` (`@nuxt/image`) | `:preload="{ fetchPriority: 'high' }"` | `format="avif,webp"`, `sizes`, `densities` |
| Angular 22 | `<img ngSrc>` (`NgOptimizedImage`) | `priority` | lazy by default; requires `width`/`height` or `fill`; builds `srcset` |
| Astro 7 | `<Image>`, `<Picture>` from `astro:assets` | `priority` (sets eager, sync decoding, `fetchpriority="high"`) | lazy by default; images in `src/` are optimised at build |
| SvelteKit 3 | `<enhanced:img>` (`@sveltejs/enhanced-img`) | `fetchpriority="high"` | generates AVIF/WebP and sizes at build |

## SVG

- As `<img src="logo.svg" alt="Shop">` for logos and illustrations: cached, no script, needs `alt`.
- Inline `<svg>` when it must take `currentColor` or be animated; decorative: `aria-hidden="true"`; meaningful: `role="img"` and `<title>`.
- Icons come from the project's generated icon set, not hand-copied files (`css/icon-from-set`, `html/icon-from-set`).

## Video instead of GIF

```html
<video autoplay muted loop playsinline width="640" height="360" poster="demo.avif">
  <source src="demo.webm" type="video/webm">
  <source src="demo.mp4" type="video/mp4">
</video>
```

Do not autoplay under `prefers-reduced-motion: reduce`; give a pause button when it runs longer than five seconds.

## Sources

- web.dev, Optimize LCP: https://web.dev/articles/optimize-lcp
- web.dev, Fetch Priority: https://web.dev/articles/fetch-priority
- web.dev, Browser-level image lazy loading: https://web.dev/articles/browser-level-image-lazy-loading
- web.dev, Responsive images: https://web.dev/learn/design/responsive-images
- web.dev, Optimize CLS: https://web.dev/articles/optimize-cls
- Chrome for Developers, Image delivery insight: https://developer.chrome.com/docs/performance/insights/image-delivery
- HTML Standard, images: https://html.spec.whatwg.org/multipage/images.html
- MDN, Responsive images: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- Next.js, Image component: https://nextjs.org/docs/app/api-reference/components/image
- Nuxt Image, NuxtImg: https://image.nuxt.com/usage/nuxt-img
- Angular, Image optimization: https://angular.dev/guide/image-optimization
- Astro, Images: https://docs.astro.build/en/guides/images/
- Astro, astro:assets reference (priority): https://docs.astro.build/en/reference/modules/astro-assets/
- SvelteKit, Images: https://svelte.dev/docs/kit/images
