# Core Web Vitals reference

Depth for the `fe-core-web-vitals` skill. Rule ids in brackets: `frontend-skills explain <id>`. Thresholds from web.dev, read on 2026-11-11; the stable set is unchanged since INP replaced FID in 2024. Versions from the npm registry on the same day: `web-vitals` 6.2.3, Next.js 16.4.6, Nuxt 4.6.4, Angular 22.2.5, Astro 7.4.10, SvelteKit 3.2.0.

## Thresholds (75th percentile, mobile and desktop apart)

| Metric | Good | Needs improvement | Poor | Measured |
| --- | --- | --- | --- | --- |
| LCP, loading | ≤ 2.5 s | ≤ 4.0 s | > 4.0 s | field and lab |
| INP, responsiveness | ≤ 200 ms | ≤ 500 ms | > 500 ms | field only (lab uses TBT) |
| CLS, visual stability | ≤ 0.1 | ≤ 0.25 | > 0.25 | field and lab |
| FCP (supporting) | ≤ 1.8 s | ≤ 3.0 s | > 3.0 s | field and lab |
| TTFB (supporting) | ≤ 0.8 s | ≤ 1.8 s | > 1.8 s | field and lab |

A page passes only when all three Core Web Vitals are good at p75. Lighthouse cannot show a pass: it is one simulated visit.

## LCP subparts [perf/lcp-image, perf/lcp-image-not-lazy]

| Subpart | Typical cause | Fix |
| --- | --- | --- |
| Time to first byte | Uncached server rendering, redirects | Cache HTML at the edge, link to final URLs |
| Resource load delay | Image found late (JS, CSS background, lazy) | In HTML, `fetchpriority="high"`, preload backgrounds |
| Resource load duration | Large file | AVIF/WebP, `srcset` + `sizes`, CDN |
| Element render delay | Blocking CSS/JS, client rendering, font hiding text | Defer scripts, inline small critical CSS, SSR |

## CLS causes [perf/layout-shift]

| Cause | Fix |
| --- | --- |
| Image or video without size | `width` + `height`, or `aspect-ratio` [perf/img-dimensions] |
| Embed, iframe, ad slot | `min-height` / `aspect-ratio` on the container, kept when empty |
| Web font swap | `font-display: optional`, or a fallback with `size-adjust` [perf/font-display] |
| Content inserted above | Overlay it, or reserve space before it loads |
| Animation of layout properties | `transform` and `opacity` only |

Shifts within 500 ms after a click or key press are expected and not counted.

## INP causes [perf/yield-long-tasks]

| Phase | Cause | Fix |
| --- | --- | --- |
| Input delay | Long tasks already running (hydration, third parties) | Split work, defer third parties, less hydration |
| Processing | Heavy handler, big state update, synchronous storage | Paint first, then `await yieldToMain()`, workers |
| Presentation delay | Huge DOM, layout thrashing, large re-render | Smaller DOM, `content-visibility: auto`, batch reads before writes |

```js
const yieldToMain = () => (globalThis.scheduler?.yield ? scheduler.yield() : new Promise((r) => setTimeout(r, 0)))
async function processAll(items) {
  for (let i = 0; i < items.length; i++) {
    process(items[i])
    if (i % 50 === 49) await yieldToMain()
  }
}
```

`scheduler.yield()` is not Baseline on 2026-11-11; keep the fallback.

## Field measurement

```js
import { onCLS, onINP, onLCP } from 'web-vitals/attribution'
const send = (metric) => navigator.sendBeacon('/vitals', JSON.stringify({
  name: metric.name, value: metric.value, rating: metric.rating, id: metric.id,
  target: metric.attribution?.interactionTarget || metric.attribution?.target
}))
onLCP(send); onINP(send); onCLS(send)
```

`onCLS` reports in Chromium only; LCP and INP report in Chromium, Firefox and Safari (web-vitals README).

## Per framework

| Stack | LCP | CLS | INP |
| --- | --- | --- | --- |
| Next.js 16 | `next/image` with `preload` or `fetchPriority="high"` (`priority` is deprecated); `next/font` | `next/image` needs size or `fill` | Server Components ship less JS; `next/script` `lazyOnload` for tags |
| Nuxt 4 | `<NuxtImg preload>`, `@nuxt/fonts` | `<NuxtImg>` with `width`/`height` | Lazy components (`Lazy` prefix), server components |
| Angular 22 | `NgOptimizedImage` with `priority` | `ngSrc` needs size or `fill` | `@defer`, zoneless change detection, signals |
| Astro 7 | `astro:assets` `<Image>` / `<Picture>` | Sizes are inferred for local images | Zero JS by default; `client:visible` or `client:idle` islands |
| SvelteKit 3 | SSR by default, preload data on hover | Size images | Small runtime; avoid large `$effect` work |
| Plain HTML | `<img fetchpriority="high">`, preload backgrounds | `width`/`height` | `defer` scripts, few third parties |

## Back/forward cache [perf/bfcache-no-unload]

Blockers: `unload` listeners, `Cache-Control: no-store` on HTML (in some browsers), open IndexedDB transactions or WebSocket connections at the moment of leaving, `window.opener` references. Check in DevTools > Application > Back/forward cache. Restore state on `pageshow` with `event.persisted`.

## Sources

- web.dev, Web Vitals: https://web.dev/articles/vitals
- web.dev, LCP, INP, CLS: https://web.dev/articles/lcp, https://web.dev/articles/inp, https://web.dev/articles/cls
- web.dev, Optimize LCP / CLS / long tasks: https://web.dev/articles/optimize-lcp, https://web.dev/articles/optimize-cls, https://web.dev/articles/optimize-long-tasks
- web.dev, Back/forward cache: https://web.dev/articles/bfcache
- web-vitals library: https://github.com/GoogleChrome/web-vitals
- Next.js Image: https://nextjs.org/docs/app/api-reference/components/image
- Angular image optimization: https://angular.dev/guide/image-optimization
- Astro images: https://docs.astro.build/en/guides/images/
