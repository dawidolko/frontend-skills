# JavaScript, CSS and asset delivery reference

Depth for the `fe-perf-delivery` skill. Rule ids in brackets: `frontend-skills explain <id>`. Versions from the npm registry on 2026-11-11: Lighthouse 13.6.0, Vite 8.3.8, `size-limit` 14.3.0, `rollup-plugin-visualizer` 7.1.3, `@next/bundle-analyzer` 16.4.6.

## Script loading [perf/render-blocking-script, perf/third-party-async]

| Attribute | Downloads | Runs | Use for |
| --- | --- | --- | --- |
| none | Blocks parsing | Immediately | Almost never |
| `defer` | In parallel | After parsing, in order | Your scripts, ordered third parties |
| `async` | In parallel | As soon as loaded, any order | Independent tags (analytics, chat) |
| `type="module"` | In parallel | Deferred by default | Modern bundles |
| On interaction | When needed | When needed | Chat, video, maps, comments |

| Framework | Third-party loader |
| --- | --- |
| Next.js | `<Script strategy="afterInteractive">` (default), `"lazyOnload"`, `"beforeInteractive"` only for must-run-first |
| Nuxt | `useScript()` with a trigger (`onNuxtReady`, element visible) |
| Astro | `<script>` is bundled and deferred; `is:inline` opts out |
| Angular | Load in `afterNextRender` or with `@defer (on idle)` |

## Splitting and hydration [perf/code-split]

| Stack | Route splitting | On-demand part | Less hydration |
| --- | --- | --- | --- |
| Next.js (App Router) | Automatic | `next/dynamic`, `React.lazy` | Server Components by default; `"use client"` only on leaves |
| Nuxt | Automatic | `Lazy` component prefix, `defineAsyncComponent` | Server components, `<ClientOnly>` sparingly |
| SvelteKit | Automatic | `await import()` | SSR plus small runtime; `csr = false` for static pages |
| Angular | `loadComponent` in routes | `@defer` blocks | Incremental hydration (`hydrate on viewport`) |
| Astro | Per page | Islands: `client:visible`, `client:idle`, `client:media` | Zero JS unless a directive asks for it |
| React + Vite | `lazy()` in the router | `React.lazy`, `import()` | – |

## CSS delivery [perf/css-no-import]

- One or two stylesheets via `<link>` in `<head>`; inline only small critical CSS for the first screen when measured to help.
- `media="print"` on print styles so they do not block rendering.
- Avoid `@import` in shipped CSS; Sass `@use` and bundler imports are fine because they are resolved at build time.

## Resource hints

| Hint | When |
| --- | --- |
| `<link rel="preconnect" href="https://cdn.example.com" crossorigin>` | 1–3 origins needed for the first screen |
| `<link rel="dns-prefetch">` | Origins used later; cheap |
| `<link rel="preload" as="image" fetchpriority="high">` | LCP image found late (CSS background) |
| `<link rel="preload" as="font" type="font/woff2" crossorigin>` | One or two above-the-fold fonts |
| `<link rel="modulepreload">` | Critical module dependencies (bundlers often add it) |
| Speculation Rules (`<script type="speculationrules">`) | Multi-page sites: prefetch or prerender likely next pages with `moderate` eagerness; exclude logout and cart actions |

A preload that is not used within a few seconds is wasted bandwidth and shows a console warning.

## Third parties [perf/third-party-cost]

Keep a table in the repository: name, owner, purpose, pages, loading strategy, last review. Facades: a poster image and a button that injects the iframe on click for YouTube, Vimeo and maps; load chat after the first interaction or a delay. Self-host fonts and small libraries.

## Caching [perf/cache-static-assets]

| Resource | Cache-Control |
| --- | --- |
| `/assets/app.3f9a1c.js`, hashed CSS, fonts, images | `public, max-age=31536000, immutable` |
| HTML documents | `no-cache` (revalidate with ETag) |
| API JSON | Depends; `private, no-cache` for user data |
| Sensitive pages | `no-store` (it may block the back/forward cache) |

Compress text responses with Brotli or gzip; check `content-encoding` in the network panel.

## Browser targets [perf/no-legacy-javascript]

Declare targets once in `browserslist` (`"baseline widely available"`) or the bundler's `build.target`; tools that read browserslist (Babel, Autoprefixer, Lightning CSS) then agree. Remove `import 'core-js/stable'` from entries; add a single polyfill only for a feature you use outside your targets.

## Budgets

In `package.json`, with size-limit:

```json
"size-limit": [{ "path": "dist/assets/index-*.js", "limit": "150 kB" }]
```

Run it in CI so a pull request that crosses the budget fails with the size difference.

## Sources

- web.dev, Efficiently load third-party JavaScript: https://web.dev/articles/efficiently-load-third-party-javascript
- web.dev, Code splitting: https://web.dev/articles/reduce-javascript-payloads-with-code-splitting
- web.dev, HTTP cache: https://web.dev/articles/http-cache
- Chrome for Developers, Third-party facades: https://developer.chrome.com/docs/lighthouse/performance/third-party-facades
- MDN, Speculation Rules API: https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API
- Lighthouse insights: https://developer.chrome.com/docs/performance/insights
- Next.js Script: https://nextjs.org/docs/app/api-reference/components/script
- Angular defer: https://angular.dev/guide/templates/defer
- Astro islands: https://docs.astro.build/en/concepts/islands/
- size-limit: https://github.com/ai/size-limit
- Moment.js project status (maintenance mode): https://momentjs.com/docs/#/-project-status/
