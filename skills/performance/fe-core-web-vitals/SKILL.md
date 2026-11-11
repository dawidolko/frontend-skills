---
name: fe-core-web-vitals
description: Improves Core Web Vitals in any stack - LCP 2.5 s, INP 200 ms and CLS 0.1 at the 75th percentile - with causes and fixes per framework (Next.js, Nuxt, Angular, Astro, SvelteKit, plain HTML), field measurement with web-vitals and the back/forward cache. Use when a page is slow to show, slow to respond or jumps, when PageSpeed or Search Console flags vitals, or when asked "why is LCP or INP bad".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Core Web Vitals
  area: performance
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.js **/*.vue **/*.svelte **/*.astro **/*.component.html **/*.css **/*.scss"
  rules: "perf/lcp-image perf/lcp-image-not-lazy perf/layout-shift perf/yield-long-tasks perf/bfcache-no-unload perf/img-dimensions perf/render-blocking-script perf/font-display"
  version: 0.1.0
---

# Core Web Vitals

Read `.frontend-skills/profile.json` (framework and its version) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Targets at the 75th percentile of real visits, mobile and desktop apart: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- The LCP image is in the server HTML with `fetchpriority="high"`; a CSS background LCP image is preloaded (perf/lcp-image).
- Never `loading="lazy"` on the hero or a high-priority image (perf/lcp-image-not-lazy).
- Images and videos have `width` and `height`; embeds and ad slots reserve their space (perf/img-dimensions, perf/layout-shift).
- Head scripts use `defer` or `type="module"`; fonts use `font-display` with a matched fallback (perf/render-blocking-script, perf/font-display).
- Handlers paint first and yield; work over 50 ms is split or moved to a worker (perf/yield-long-tasks).
- Never listen to `unload`; use `pagehide` or `visibilitychange` (perf/bfcache-no-unload).
- Insert late content (banners, toasts, cookie bars) over the page, never above existing content.
- Use the framework's image, font and script components before hand-written tags.
- Judge vitals on field data; a lab run (Lighthouse) only explains the causes.

## Do this

1. Find the slow metric in field data (PageSpeed Insights field section, Search Console, or `web-vitals` in the app) for the page type that fails.
2. LCP: find the LCP element in DevTools Performance; fix in order TTFB (cache the HTML, CDN), discovery (in HTML, not lazy, preload), priority (`fetchpriority`), size (AVIF or WebP, `srcset`), render delay (blocking CSS and JS).
3. CLS: open the layout shift culprits insight; size images, reserve slots, fix font fallbacks, stop inserting content above.
4. INP: record the slow interaction; shorten the handler, yield before non-visual work, avoid layout reads after writes, render less (virtualise long lists).
5. Use the framework: Next.js `next/image` (`preload` or `fetchPriority`), `next/font`, `next/script`; Nuxt `@nuxt/image` and `@nuxt/fonts`; Angular `NgOptimizedImage` with `priority` and `@defer`; Astro islands with `client:visible`; SvelteKit preloading.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds lazy hero images, unsized images, blocking head scripts, missing `font-display` and unload listeners.
- `audit --url <page>` runs Lighthouse (lab: LCP, CLS, TBT as the INP stand-in) and maps the LCP discovery and layout shift insights to rule ids.
- Field: add `web-vitals` with the attribution build for a week, or read the CrUX data in PageSpeed Insights.

## References

- [references/vitals.md](references/vitals.md): thresholds, LCP subparts, CLS and INP causes with fixes, per-framework table, web-vitals field code, bfcache. Read it when a metric fails or before a performance review.
