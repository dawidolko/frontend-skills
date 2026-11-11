# Performance: sources and candidate rules

Read on 2026-11-11. Primary sources:

- web.dev Web Vitals overview: https://web.dev/articles/vitals (page last updated 2024-10-31)
- web.dev LCP / INP / CLS / FCP / TTFB / TBT: https://web.dev/articles/lcp, https://web.dev/articles/inp, https://web.dev/articles/cls, https://web.dev/articles/fcp, https://web.dev/articles/ttfb, https://web.dev/articles/tbt
- web.dev optimisation guides: https://web.dev/articles/optimize-lcp, https://web.dev/articles/optimize-inp, https://web.dev/articles/optimize-cls, https://web.dev/articles/optimize-long-tasks, https://web.dev/articles/bfcache, https://web.dev/articles/fetch-priority, https://web.dev/articles/browser-level-image-lazy-loading, https://web.dev/articles/font-best-practices
- web.dev blog, experimental soft-navigation CWV in CrUX (2026-10-13): https://web.dev/blog/crux-experimental-soft-navs/
- Lighthouse source at tag v13.6.0: https://github.com/GoogleChrome/lighthouse/blob/v13.6.0/core/config/default-config.js, https://github.com/GoogleChrome/lighthouse/blob/v13.6.0/core/config/constants.js, metric audits under https://github.com/GoogleChrome/lighthouse/tree/v13.6.0/core/audits/metrics
- Lighthouse releases: https://github.com/GoogleChrome/lighthouse/releases (v13.6.0, v13.0.0, v12.0.0)
- Lighthouse scoring doc: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring and calculator https://googlechrome.github.io/lighthouse/scorecalc/
- Insights migration: https://developer.chrome.com/blog/moving-lighthouse-to-insights; insight docs: https://developer.chrome.com/docs/performance/insights
- DevTools insight source (thresholds): https://github.com/ChromeDevTools/devtools-frontend/tree/main/front_end/models/trace/insights; throttling presets: https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/models/trace/lantern/simulation/Constants.ts
- Speculation rules: https://developer.chrome.com/docs/web-platform/prerender-pages (last updated 2026-10-29)
- Baseline status: https://webstatus.dev (API `api.webstatus.dev/v1/features/<id>`), browser data: https://github.com/mdn/browser-compat-data
- npm registry (`registry.npmjs.org/<pkg>/latest`) and bundlephobia API (`bundlephobia.com/api/size?package=`) for versions, licences, sizes
- Framework docs: Next.js Image/Font/Script, Nuxt Image/Fonts, Angular image optimisation and `@defer`, Astro islands, SvelteKit link options (URLs in the framework table)

---

## 1. Core Web Vitals today

Stable set (unchanged in 2025–2026): **LCP, INP, CLS**. Pass = all three "good" at the **75th percentile** of page loads, measured separately for mobile and desktop (https://web.dev/articles/vitals). Stable metrics change at most once a year; new ones go experimental → pending (≥ 6 months) → stable.

| metric | good | needs improvement | poor | kind | source |
|---|---|---|---|---|---|
| LCP (loading) | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s | Core Web Vital, field + lab | https://web.dev/articles/lcp (updated 2025-09-04) |
| INP (responsiveness) | ≤ 200 ms | 200–500 ms | > 500 ms | Core Web Vital, field only | https://web.dev/articles/inp (updated 2025-09-02) |
| CLS (visual stability) | ≤ 0.1 | 0.1–0.25 | > 0.25 | Core Web Vital, field + lab | https://web.dev/articles/cls |
| FCP | ≤ 1.8 s | 1.8–3.0 s | > 3.0 s | supporting (diagnoses render-blocking) | https://web.dev/articles/fcp |
| TTFB | ≤ 0.8 s | 0.8–1.8 s | > 1.8 s | supporting, "rough guide" | https://web.dev/articles/ttfb (updated 2025-11-18) |
| TBT | < 200 ms on average mobile hardware (lab target) | – | – | lab proxy for INP; sum of long-task time over 50 ms after FCP | https://web.dev/articles/tbt (updated 2025-10-15) |

Facts a rule writer needs:

- INP replaced FID (FID only measured the input delay of the first interaction). INP counts clicks, taps and key presses, not hover, scroll or zoom; it has three phases: input delay, processing duration, presentation delay (https://web.dev/articles/inp).
- CLS = largest "session window" of shifts (gaps < 1 s, window ≤ 5 s); shifts within 500 ms of a discrete input are excluded (https://web.dev/articles/cls).
- LCP candidates: `<img>`, `<image>` inside `<svg>`, `<video>` poster/first frame, elements with a `url()` background image (not gradients), block elements with text (https://web.dev/articles/lcp).
- **What changed 2025–2026**: no threshold change and no new stable metric. On 2026-10-13 Chrome began publishing *experimental* soft-navigation variants in CrUX (`experimental_largest_contentful_paint_with_softnavs`, `experimental_interaction_to_next_paint_with_softnavs`, `experimental_cumulative_layout_shift_with_softnavs`), after the Soft Navigations API shipped in Chrome 151; not used by Search yet, target to graduate May 2027 (https://web.dev/blog/crux-experimental-soft-navs/).
- Browser support for measuring: Baseline "newly available" since 2025-12-12 for LCP entries and Event Timing entries; Layout Instability (CLS) is still "limited" (Chromium only) (webstatus.dev ids `largest-contentful-paint`, `event-timing`, `layout-instability`). web-vitals README: `onCLS` Chromium only; `onFCP`, `onINP`, `onLCP`, `onTTFB` in Chromium, Firefox and Safari (https://github.com/GoogleChrome/web-vitals).
- **Field vs lab**: field = real users (CrUX, PageSpeed Insights field section, Search Console CWV report, the `web-vitals` library); lab = Lighthouse / DevTools under fixed throttling. Lighthouse cannot measure INP in a navigation run and uses TBT; lab is not a substitute for field data (https://web.dev/articles/vitals).

---

## 2. How Lighthouse scores, current version

**Current release: Lighthouse 13.6.0, published 2026-10-27** (npm `latest` = 13.6.0; GitHub release v13.6.0; expected in Chrome 159 DevTools and in PSI "within a week" per the release notes). https://github.com/GoogleChrome/lighthouse/releases/tag/v13.6.0. Lighthouse 13.0.0 shipped 2025-10-10.

### Performance score

Weighted average of metric scores only; insights and diagnostics have weight 0 (https://github.com/GoogleChrome/lighthouse/blob/v13.6.0/core/config/default-config.js). Weights are the same as Lighthouse 10–12:

| metric | weight | mobile curve (p10 → score 0.9, median → 0.5) | desktop curve |
|---|---|---|---|
| FCP | 10 | 1800 ms / 3000 ms | 934 ms / 1600 ms |
| Speed Index | 10 | 3387 ms / 5800 ms | 1311 ms / 2300 ms |
| LCP | 25 | 2500 ms / 4000 ms | 1200 ms / 2400 ms |
| TBT | 30 | 200 ms / 600 ms | 150 ms / 350 ms |
| CLS | 25 | 0.1 / 0.25 | 0.1 / 0.25 |
| INP | 0 (only in timespan mode) | 200 ms / 500 ms | same |

(Curve control points read from `core/audits/metrics/*.js` at v13.6.0.)

- Each raw value maps to 0–100 on a **log-normal curve** built from HTTP Archive data; the docs describe the control points as the 25th percentile → 50 and the 8th percentile → 90; the region 50–92 is almost linear and points above ~96 are hard to earn (https://developer.chrome.com/docs/lighthouse/performance/performance-scoring). That page still labels its weight table "Lighthouse 10"; the v13.6.0 config confirms the same numbers.
- **Bands**: 0–49 poor (red), 50–89 needs improvement (orange), 90–100 good (green). Same doc.
- Scores vary run to run (ads, A/B tests, routing, extensions, antivirus, hardware); treat as a distribution. Calculator: https://googlechrome.github.io/lighthouse/scorecalc/.
- **Throttling** (`throttlingMethod: 'simulate'` by default, `core/config/constants.js`):
  - mobile (default): `mobileSlow4G` = RTT 150 ms, 1.6 Mbps down (1638.4 Kbps), 750 Kbps up, CPU slowdown 4×; screen 412×823 @ DPR 1.75 (Moto G Power).
  - desktop (`desktop-config.js`, CLI `--preset=desktop`): `desktopDense4G` = RTT 40 ms, 10 Mbps (10240 Kbps), CPU 1×; screen 1350×940 @ DPR 1.
  - Values from DevTools' Lantern `Constants.ts` (main branch; Lighthouse 13.6.0 bundles `@paulirish/trace_engine` 0.0.67) and Lighthouse `docs/throttling.md` at v13.6.0.

### Insights replaced opportunities (Lighthouse 13)

Confirmed: v12.6 added an insights toggle, v12.7 made insights the default view, and **v13.0.0 removed the audits replaced by insights** plus `preload-fonts`, `uses-rel-preload`, `font-size`, `offscreen-images`, `no-document-write`, `uses-passive-event-listeners`, `third-party-facades`, `first-meaningful-paint` (https://github.com/GoogleChrome/lighthouse/releases/tag/v13.0.0, https://developer.chrome.com/blog/moving-lighthouse-to-insights).

Insight audit ids in v13.6.0 (all weight 0, group `insights`), with what they flag for front-end code:

| audit id | old audits it absorbed | flags (threshold from DevTools source where read) | docs |
|---|---|---|---|
| `lcp-discovery-insight` | `prioritize-lcp-image`, `lcp-lazy-loaded` | LCP image: has `fetchpriority=high`, is discoverable in the initial HTML (or preload), is not `loading=lazy` | https://developer.chrome.com/docs/performance/insights/lcp-discovery |
| `lcp-breakdown-insight` | `largest-contentful-paint-element` | LCP subparts: TTFB, load delay, load duration, render delay | …/insights/lcp-breakdown |
| `render-blocking-insight` | `render-blocking-resources` | blocking CSS/JS in the critical path; reported when estimated saving ≥ 50 ms | …/insights/render-blocking |
| `image-delivery-insight` | `uses-webp-images`, `uses-optimized-images`, `efficient-animated-content`, `uses-responsive-images` | bytes per pixel above an AVIF-like target (modern format or compression), animated GIF > 100 KiB → video, oversized vs displayed size; savings < 4 KiB ignored (`ImageDelivery.ts`) | …/insights/image-delivery |
| `font-display-insight` | `font-display` | fonts that hide text while loading; advises `swap` or `optional` plus metric overrides | …/insights/font-display |
| `third-parties-insight` | `third-party-summary` | transfer size and main-thread time per third-party entity | …/insights/third-parties |
| `legacy-javascript-insight` | `legacy-javascript` | polyfills/transforms for Baseline features shipped to modern browsers; byte threshold 5000 | …/insights/legacy-javascript |
| `duplicated-javascript-insight` | `duplicated-javascript` | same module in several bundles | …/insights/duplicated-javascript |
| `document-latency-insight` | `redirects`, `server-response-time`, `uses-text-compression` | document redirects, server response > 600 ms, uncompressed HTML | …/insights/document-latency |
| `cls-culprits-insight` | `layout-shifts`, `non-composited-animations`, `unsized-images` | shift clusters and causes: unsized images, late web fonts, injected iframes/content, non-composited animations | …/insights/cls-culprit |
| `forced-reflow-insight` | – | JS reading layout after a style change (layout thrashing) | …/insights/forced-reflow |
| `dom-size-insight` | `dom-size` | large DOM, deep trees, big style recalc/layout (layout > 100 objects, recalc > 300 elements flagged in source) | …/insights/dom-size |
| `network-dependency-tree-insight` | `critical-request-chains`, `uses-rel-preconnect` | long critical request chains; missing or unused preconnects | …/insights/network-dependency-tree |
| `cache-insight` | `uses-long-cache-ttl` | cacheable fonts/images/media/scripts/styles with lifetime < 30 days | …/insights/cache |
| `modern-http-insight` | `uses-http2` | many requests over HTTP/1.1 | …/insights/modern-http |
| `viewport-insight` | `viewport` | missing/bad `<meta name=viewport>` (tap delay) | …/insights/viewport |
| `inp-breakdown-insight` | `work-during-interaction` | INP phases (timespan mode) | …/insights/inp-breakdown |

Note: the migration blog names some ids differently (`lcp-phases-insight`, `interaction-to-next-paint-insight`, `use-cache-insight`); the shipped v13.6.0 config uses the ids in the table above.

Diagnostics still present as classic audits in v13.6.0 (weight 0): `unminified-css`, `unminified-javascript`, `unused-css-rules`, `unused-javascript`, `total-byte-weight`, `user-timings`, `bootup-time`, `mainthread-work-breakdown`, `long-tasks`, `non-composited-animations`, `unsized-images`, `bf-cache`.

### Other categories (v13.6.0 config)

- **Accessibility**: axe-core based; audit weight from axe impact × tags: minor 1 / moderate 3 / serious 7 / critical 10 for WCAG A/AA rules; best-practice rules 0/3/7/10; experimental rules 0 (weights re-tuned in v13.0.0, PR #16624). Category text itself says automated checks find only a subset of issues and manual review is needed.
- **Best Practices**: weighted pass/fail, e.g. `is-on-https` 5, `deprecations` 5, `third-party-cookies` 5, `paste-preventing-inputs` 3, `image-aspect-ratio` 1, `image-size-responsive` 1, `doctype` 1, `charset` 1, `errors-in-console` 1, `inspector-issues` 1; `csp-xss`, `has-hsts`, `origin-isolation`, `clickjacking-mitigation`, `trusted-types-xss`, `baseline`, `js-libraries`, `valid-source-maps` at 0.
- **SEO**: `is-crawlable` weight 93/23 (so failing it alone fails the category), 1 each for `document-title`, `meta-description`, `http-status-code`, `link-text`, `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang`, `canonical`; `structured-data` manual.
- **PWA**: removed in Lighthouse 12.0.0 (2024-04-22) (https://github.com/GoogleChrome/lighthouse/releases/tag/v12.0.0).
- **New: Agentic Browsing** category, added to the default config in 13.3.0 (2026-05-07), score shown as a fraction, described by Lighthouse as "still under development and subject to change": `agent-accessibility-tree`, `webmcp-form-coverage`, `webmcp-registered-tools`, `webmcp-schema-validity`, `cumulative-layout-shift`, `llms-txt`, `ard-schema`. Not a performance concern; flag for the SEO/a11y researchers.

---

## 3. Candidate rules

Severity guide used below: **error** = directly harms a Core Web Vital in common cases and is cheap to fix; **warning** = usually harmful, context needed; **info** = advice or a progressive enhancement.

### 3.1 Images

| id | rule (own words, one sentence) | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/lcp-image-not-lazy` | Never put `loading="lazy"` on the image that is likely to be the LCP element (hero, first visible image). | Lazy loading delays the request and adds resource load delay to LCP. | web.dev Optimize LCP https://web.dev/articles/optimize-lcp ; lazy-loading https://web.dev/articles/browser-level-image-lazy-loading | plain HTML, any framework | static: first `<img>` in the main/hero region or with `fetchpriority=high` that also has `loading=lazy`; runtime: Lighthouse `lcp-discovery-insight` | `<img loading=lazy class=hero>` → no `loading` (eager) | – | error |
| `perf/lcp-image-priority` | Mark the one or two images most likely to be LCP with `fetchpriority="high"`. | Raises the request priority so the LCP image is not queued behind other images. | https://web.dev/articles/fetch-priority ; https://developer.chrome.com/docs/performance/insights/lcp-discovery | plain HTML | runtime: `lcp-discovery-insight`; static only as a hint (hero image without the attribute) | `<img src=hero.avif>` → `<img src=hero.avif fetchpriority=high>` | – | warning |
| `perf/fetchpriority-overuse` | Do not set `fetchpriority="high"` on many resources, because the hint only helps when it is selective. | Priority is relative; boosting everything boosts nothing. | https://web.dev/articles/optimize-lcp (only one or two images) | plain HTML | static: count of `fetchpriority=high` per page > 2 | 6 carousel slides `high` → first slide only | – | warning |
| `perf/lcp-discoverable` | Put the LCP image URL in the initial HTML (`src`/`srcset`), not only in JS or CSS; if it must be a CSS background, preload it with `fetchpriority="high"`. | The preload scanner cannot find URLs created by JS or hidden in CSS, adding load delay. | https://web.dev/articles/optimize-lcp ; https://web.dev/articles/fetch-priority | plain HTML, SSR frameworks | runtime: `lcp-discovery-insight`; static: hero section using `background-image:url()` with no matching `<link rel=preload as=image>` | JS-injected hero → `<img>` in server HTML | – | error |
| `perf/img-dimensions` | Give every `<img>` and `<video>` `width` and `height` attributes (or a CSS `aspect-ratio`) so space is reserved. | Unsized media shifts content when it loads (CLS) and defeats lazy-loading heuristics. | https://web.dev/articles/optimize-cls ; Lighthouse `unsized-images`, `cls-culprits-insight` | plain HTML, any | static: `<img>` without both `width` and `height` and no `fill`/aspect-ratio class | `<img src=a.jpg>` → `<img src=a.jpg width=800 height=600>` + `height:auto` | – | error |
| `perf/img-lazy-below-fold` | Add `loading="lazy"` to images (and iframes) that start outside the first viewport. | Saves bandwidth for above-the-fold resources. Baseline widely available since 2026-06-19 (webstatus `loading-lazy`). | https://web.dev/articles/browser-level-image-lazy-loading | plain HTML | static (heuristic, noisy): images after the first N in the document without `loading`; runtime check better | – → `loading=lazy` on gallery/footer images | – | info |
| `perf/img-modern-format` | Serve photos as AVIF or WebP (with `<picture>` fallback if older browsers matter). | Smaller bytes per pixel; AVIF Baseline widely since 2026-07-25, WebP since 2023-03-16 (webstatus `avif`, `webp`). | https://developer.chrome.com/docs/performance/insights/image-delivery | plain HTML, build pipelines | static: `.jpg/.png` photo `src` with no `<source type=image/avif|webp>`; runtime: `image-delivery-insight` | `hero.jpg` → `<picture><source type=image/avif srcset=hero.avif><img src=hero.jpg …></picture>` | – | warning |
| `perf/img-responsive` | Give large content images `srcset` with width descriptors and an accurate `sizes`. | Stops mobile devices downloading desktop-sized files; the insight flags oversized images. | https://developer.chrome.com/docs/performance/insights/image-delivery ; Lighthouse `image-size-responsive` (Best Practices) | plain HTML | static: `<img>` with `srcset` using `w` but no `sizes`; runtime: `image-delivery-insight` | `srcset="a-800.avif 800w, a-1600.avif 1600w"` without `sizes` → add `sizes="(min-width:60rem) 50vw, 100vw"` | – | warning |
| `perf/gif-to-video` | Replace large animated GIFs with muted, looping `<video>` (MP4/WebM). | GIF > 100 KiB is flagged; video is much smaller. | `ImageDelivery.ts` (GIF_SIZE_THRESHOLD 100 KiB) https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/models/trace/insights/ImageDelivery.ts | any | static: `.gif` larger than 100 KiB in assets | `<img src=demo.gif>` → `<video autoplay muted loop playsinline>` | – | warning |
| `perf/img-decoding` | Leave `decoding` at default; only consider `decoding="async"` for large non-LCP images. | Low impact; Angular sets `decoding=sync` on priority images, so a blanket rule would conflict. | https://angular.dev/guide/image-optimization | plain HTML | – (not worth a static rule) | – | – | info |

### 3.2 Fonts

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/font-display` | Set `font-display` in every `@font-face` (`swap` for brand/headings, `optional` for body text when CLS matters). | Without it text may be invisible while the font loads; `auto`/`block` hide text. | https://web.dev/articles/font-best-practices ; `font-display-insight` | CSS | static: `@font-face` without `font-display`, or with `block`/`auto`; Google Fonts URL without `&display=` | `@font-face{…}` → add `font-display:swap` | – | warning |
| `perf/font-woff2` | Ship fonts as WOFF2 only. | Best compression and broad support; extra formats are dead weight. | https://web.dev/articles/font-best-practices | CSS | static: `src:` listing `.ttf`, `.otf`, `.woff` (not woff2) or `.eot` | `url(a.ttf)` → `url(a.woff2) format("woff2")` | – | warning |
| `perf/font-subset` | Subset fonts to the scripts you use and split with `unicode-range`. | Smaller files; check the font licence allows subsetting. | https://web.dev/articles/font-best-practices | CSS | static: font file > ~100 KB (noisy) | full CJK font → per-script subsets | – | info |
| `perf/font-preload-critical` | Preload at most the one or two fonts used above the fold, with `as="font" type="font/woff2" crossorigin`. | Earlier discovery, but preload ignores `unicode-range` and steals bandwidth if overused. Lighthouse removed its `preload-fonts`/`uses-rel-preload` audits in v13. | https://web.dev/articles/font-best-practices | plain HTML | static: `<link rel=preload as=font>` missing `crossorigin`; > 2 font preloads | `<link rel=preload href=f.woff2 as=font>` → add `type=font/woff2 crossorigin` | – | warning (missing crossorigin = error: the preload is wasted) |
| `perf/font-fallback-metrics` | Tune the fallback font with `size-adjust` (and `ascent-override`/`descent-override`/`line-gap-override`) to match the web font. | Reduces layout shift when the web font swaps in. `size-adjust`: Chrome 92, Firefox 92, Safari 17; the `*-override` descriptors are not in a Safari release yet (BCD: Safari "preview"); webstatus `font-metric-overrides` = limited. | https://web.dev/articles/optimize-cls ; MDN BCD css/at-rules/font-face | CSS | static: `font-display:swap` with no fallback `@font-face` using `size-adjust` (info only) | – → fallback `@font-face{font-family:"X Fallback";src:local(Arial);size-adjust:…}` | – (frameworks do this: `next/font`, `@nuxt/fonts`) | info |
| `perf/font-self-host` | Prefer self-hosting fonts from your own origin; if a font CDN is used, `preconnect` to its file origin with `crossorigin`. | Saves a connection setup; web.dev notes self-hosting only wins with a CDN and HTTP/2, so measure. | https://web.dev/articles/font-best-practices | plain HTML | static: `fonts.googleapis.com` stylesheet without `preconnect` to `fonts.gstatic.com` with `crossorigin` | – | – | info |
| `perf/no-icon-font` | Use inline SVG icons instead of icon fonts. | Icon-font fallbacks differ greatly in size, causing shifts, and need the whole font. | https://web.dev/articles/font-best-practices | any | static: Font Awesome/icon-font CSS imports | `<i class="fa fa-x">` → `<svg>` | – | info |

### 3.3 CSS delivery

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/css-no-import` | Do not use `@import` in CSS loaded by the page; link or bundle the files. | Each `@import` is found only after the parent CSS downloads, making a chain of render-blocking requests. | `network-dependency-tree-insight`, `render-blocking-insight` https://developer.chrome.com/docs/performance/insights/render-blocking | CSS | static: `@import url(` in shipped CSS (not in Sass partials compiled away) | `@import "b.css"` → bundle or second `<link>` | – | warning |
| `perf/css-critical-inline` | Keep render-blocking CSS small; inline only small critical CSS and load the rest without blocking. | Big blocking CSS delays FCP/LCP; inlined CSS cannot be cached, so keep it small. | https://web.dev/articles/optimize-lcp | plain HTML | runtime: `render-blocking-insight`; static: total `<link rel=stylesheet>` bytes in `<head>` | – | – | info |
| `perf/css-media-attr` | Give print or breakpoint-only stylesheets a `media` attribute. | Non-matching `media` stylesheets do not block rendering. | `render-blocking-insight` https://developer.chrome.com/docs/performance/insights/render-blocking | plain HTML | static: stylesheet named `print*.css` without `media=print` | `<link rel=stylesheet href=print.css>` → add `media=print` | – | info |
| `perf/content-visibility` | Use `content-visibility:auto` with `contain-intrinsic-size` on long, off-screen sections. | Skips rendering work until needed (helps INP presentation delay). Baseline **newly available since 2025-09-15** (Chrome 85, Firefox 125, Safari 18). | https://web.dev/articles/optimize-inp ; webstatus `content-visibility` | CSS | – (opt-in advice; misuse hurts find-in-page/scroll anchoring) | – → `section{content-visibility:auto;contain-intrinsic-size:auto 800px}` | – | info |
| `perf/animate-composited` | Animate `transform` and `opacity`, not `top`/`left`/`width`/`height`/`margin`. | Layout-triggering animations cause shifts and jank. | https://web.dev/articles/optimize-cls ; Lighthouse `non-composited-animations` | CSS | static: `transition`/`@keyframes` on `top|left|right|bottom|width|height|margin` | `transition:left .3s` → `transition:transform .3s` | – | warning |

### 3.4 JavaScript

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/script-defer` | Load scripts in `<head>` with `defer`, `async` or `type="module"`; never as a plain blocking `<script src>`. | Parser-blocking scripts delay FCP and LCP. | https://web.dev/articles/optimize-lcp ; `render-blocking-insight` | plain HTML | static: `<script src>` in `<head>` without `defer`/`async`/`type=module` | `<script src=app.js>` → `<script src=app.js defer>` | – | error |
| `perf/code-split` | Split JavaScript by route and load rarely used features with dynamic `import()`. | Less script to download, parse and run on first load (TBT, INP input delay). | Lighthouse `unused-javascript`, `bootup-time`; https://web.dev/articles/optimize-inp | JS, any bundler | runtime: `unused-javascript`; static: bundle size budget (size-limit) | big modal lib imported at top → `await import()` on open | size-limit (below) | warning |
| `perf/no-legacy-js` | Do not ship polyfills or down-level transforms for features that are Baseline in your target browsers; set a modern browserslist/build target. | Wasted bytes; Lighthouse flags it via `legacy-javascript-insight` (≥ 5000 bytes). | https://developer.chrome.com/docs/performance/insights/legacy-javascript | build config | static: browserslist including IE/very old versions; `core-js` full import | `import "core-js"` → targeted/no polyfills | – | warning |
| `perf/no-duplicate-modules` | Make sure one library version is bundled once. | Duplicated modules add bytes; `duplicated-javascript-insight`. | https://developer.chrome.com/docs/performance/insights/duplicated-javascript | build | static: lockfile with two majors of the same package in the client bundle; bundle analyser | – | bundle analyser | info |
| `perf/tree-shake-imports` | Import named functions from ES-module builds instead of whole libraries. | Lets the bundler drop unused code. | Lighthouse `unused-javascript` (https://developer.chrome.com/docs/lighthouse/performance/unused-javascript) | JS | static: `import _ from "lodash"`, `import * as` of big libs | `import _ from "lodash"` → `import debounce from "lodash-es/debounce"` | – | warning |
| `perf/long-task-yield` | Break main-thread work longer than ~50 ms into chunks and yield between them, preferring `scheduler.yield()` with a `setTimeout` fallback. | Long tasks raise input delay and TBT. `scheduler.yield`: Chrome/Edge 129, Firefox 142, Safari no → **not Baseline (limited)**; must feature-detect. | https://web.dev/articles/optimize-long-tasks ; MDN BCD api/Scheduler | JS | runtime: Lighthouse `long-tasks`, `inp-breakdown-insight`; static: unconditional `scheduler.yield()` without a check | `scheduler.yield()` → `await globalThis.scheduler?.yield?.() ?? new Promise(r=>setTimeout(r,0))` (own pattern) | – | warning (missing feature detection = error) |
| `perf/no-forced-reflow` | Do not read layout (`offsetHeight`, `getBoundingClientRect`, …) right after writing styles in the same task; batch reads before writes. | Forces synchronous layout, slows interactions. | https://web.dev/articles/optimize-inp ; `forced-reflow-insight` | JS | static (heuristic): style write followed by a layout read inside a loop | interleaved read/write → read all, then write all | – | warning |
| `perf/handler-minimal-work` | Keep event handlers to the UI update only; move saving, analytics and other non-visual work to a later task. | Processing time is a direct part of INP. | https://web.dev/articles/optimize-inp | JS, frameworks | runtime: `inp-breakdown-insight`, field INP attribution (web-vitals) | sync analytics in `click` → after a yield | web-vitals attribution build | warning |
| `perf/dom-size` | Keep the DOM small and shallow; render long lists virtually or on demand. | Big DOM slows style, layout and presentation delay. | https://web.dev/articles/optimize-inp ; `dom-size-insight` | any | runtime: `dom-size-insight` | 5000-row table → paginated or virtual list | – | info |
| `perf/avoid-unneeded-hydration` | Do not hydrate static content: render it as HTML on the server and ship JS only for interactive parts (islands, server components, deferred/partial hydration). | Less JS to run on load, smaller input delay. | https://web.dev/articles/optimize-inp (limit client HTML rendering); https://docs.astro.build/en/concepts/islands/ ; https://angular.dev/guide/templates/defer | SSR frameworks | static (framework-specific): Astro `client:load` on components with no handlers; Next.js `"use client"` at layout/page root | `client:load` everywhere → `client:visible`/none | – | info |

### 3.5 Third-party scripts

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/third-party-async` | Load tags, analytics and widgets with `async`/`defer` (or a framework strategy like `afterInteractive`/`lazyOnload`), never blocking in `<head>`. | Third-party code competes for main thread and network; `third-parties-insight`. | https://developer.chrome.com/docs/performance/insights/third-parties ; https://nextjs.org/docs/app/api-reference/components/script | any | static: cross-origin `<script src>` without `async`/`defer`; runtime: `third-parties-insight` | `<script src=https://widget…>` → `async` or `lazyOnload` | – | error |
| `perf/third-party-facade` | Use a lightweight placeholder (facade) for heavy embeds such as video players, maps and chat, loading the real thing on interaction. | Removes large third-party JS from the initial load. Note: Lighthouse **removed** its `third-party-facades` audit in v13.0.0, so this is advice, not a Lighthouse check. | https://github.com/GoogleChrome/lighthouse/releases/tag/v13.0.0 | any | static: YouTube/Vimeo/Maps `<iframe>` above the fold without `loading=lazy` or a facade | iframe → poster image + button that injects the iframe | – (see Not verified) | info |
| `perf/partytown-caution` | Only move scripts to a web worker (Partytown) when they mainly send data in the background and have been tested there. | Documented limits: DOM access is proxied and slower, `event.preventDefault()` from the worker has no effect, exit events (`pagehide`, `visibilitychange`) are unreliable (e.g. GA4 `user_engagement` not sent), cross-origin iframe cookies do not persist, scripts may need CORS proxying; Next.js `worker` strategy is experimental and Pages-Router only. | https://partytown.qwik.dev/trade-offs ; https://nextjs.org/docs/app/api-reference/components/script | any | manual | – | `@qwik.dev/partytown@1.0.5`, MIT (npm); `@builder.io/partytown` is deprecated on npm ("Use @qwik.dev/partytown instead") | info |

### 3.6 Resource hints and speculative loading

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/preconnect-critical-origin` | Preconnect only to the 1–3 third-party origins needed for above-the-fold content, with `crossorigin` when the requests are CORS (fonts). | Saves DNS/TCP/TLS time; unused preconnects waste sockets. `<link rel=preconnect>` Baseline widely (webstatus). | `network-dependency-tree-insight` https://developer.chrome.com/docs/performance/insights/network-dependency-tree | plain HTML | static: > 4 preconnects; preconnect to the page's own origin; runtime: insight lists unused preconnects | – | – | info |
| `perf/dns-prefetch` | Use `dns-prefetch` only as a cheap hint for origins used later; it is now Baseline newly available (2025-09-15; Firefox 127). | Cheap, but lower value than preconnect for critical origins. | webstatus `link-rel-dns-prefetch`; MDN BCD | plain HTML | – | – | – | info |
| `perf/preload-sparingly` | Preload only late-discovered critical resources (CSS background LCP image, critical font); every preload must be used. | Preload competes for bandwidth; unused preloads trigger console warnings. `<link rel=preload>` Baseline widely. | https://web.dev/articles/fetch-priority ; https://web.dev/articles/optimize-lcp | plain HTML | static: preload of a URL not referenced elsewhere; `as` missing | `<link rel=preload href=x.css>` → add `as=style` or drop | – | warning |
| `perf/modulepreload` | Use `<link rel="modulepreload">` for critical ES-module dependencies of the entry (bundlers often inject these). | Fetches and parses the module graph early. Baseline widely since 2026-03-18. | webstatus `modulepreload` | plain HTML, Vite | – | – | – | info |
| `perf/speculation-rules` | For multi-page sites, consider Speculation Rules with document rules and `moderate`/`conservative` eagerness, excluding logout/cart/state-changing URLs. | Near-instant next navigations; only Chromium (Chrome/Edge 109+ prerender, 121+ document rules), Safari behind a flag, Firefox no → **Baseline limited**; progressive enhancement only. Over-speculation costs users data/CPU. | https://developer.chrome.com/docs/web-platform/prerender-pages ; webstatus `speculation-rules` | plain HTML, MPA frameworks | static: `immediate`/`eager` rules matching `/*` without exclusions | – | – | info |

### 3.7 Caching, bfcache, compression

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/cache-hashed-assets` | Serve fingerprinted (content-hashed) assets with `Cache-Control: public, max-age=31536000, immutable`. | Repeat visits skip the network; `cache-insight` flags cacheable assets under 30 days. `immutable`: Firefox 49, Safari 11, **not supported in Chrome** (harmless there). | https://developer.chrome.com/docs/performance/insights/cache ; MDN BCD http/headers/Cache-Control | server/host config | static: host config (`_headers`, `vercel.json`, `netlify.toml`, nginx) setting short TTL for `/assets/*`; runtime: `cache-insight` | `max-age=3600` on `app.3f9a.js` → 1 year + `immutable` | – | warning |
| `perf/html-not-immutable` | Do not cache HTML long-term; use `no-cache` (revalidate) rather than long `max-age`. | Users would keep stale HTML pointing to old asset hashes. | web.dev bfcache (no-cache keeps bfcache eligibility) https://web.dev/articles/bfcache | server config | static: long `max-age` on `*.html` or `/` | – | – | warning |
| `perf/bfcache-no-unload` | Never add `unload` listeners; use `pagehide` (or `visibilitychange`) instead. | `unload` blocks the back/forward cache and is deprecated in Chromium. | https://web.dev/articles/bfcache ; Lighthouse `bf-cache` | JS | static: `addEventListener('unload'` / `onunload=` / `window.onunload` | `unload` → `pagehide` | – | error |
| `perf/bfcache-no-store` | Avoid `Cache-Control: no-store` on pages that hold no sensitive data; use `no-cache` or `max-age=0`. | `no-store` has historically blocked bfcache (Chrome work to relax it is "underway", no version given). | https://web.dev/articles/bfcache (updated 2026-10-16) | server config | static: `no-store` on public HTML routes | `no-store` → `no-cache` | – | warning |
| `perf/bfcache-beforeunload` | Add `beforeunload` only while there are unsaved changes and remove it after saving. | It is unreliable and should be conditional. | https://web.dev/articles/bfcache | JS | static: unconditional `beforeunload` at module top level | – | – | info |
| `perf/text-compression` | Serve HTML, CSS, JS, SVG, JSON with Brotli (or gzip); zstd is optional. | `document-latency-insight` flags uncompressed HTML. Brotli Baseline widely; zstd Baseline **newly** since 2026-02-11 (Chrome 123, Firefox 126, Safari 26.3). | https://developer.chrome.com/docs/performance/insights/document-latency ; webstatus `brotli`, `zstd` | server/CDN config | runtime: `Content-Encoding` header missing on text responses | – → `Content-Encoding: br` | – | warning |
| `perf/no-document-redirects` | Link directly to the final URL (https, trailing slash, locale) so the document is not redirected. | Each redirect adds a round trip before TTFB. | https://developer.chrome.com/docs/performance/insights/document-latency | any | static: internal links to `http://` own-domain URLs | `http://site/a` → `/a/` | – | info |

### 3.8 CLS-specific

| id | rule | why | source | applies to | check | bad → good | light library | severity |
|---|---|---|---|---|---|---|---|---|
| `perf/reserve-embed-space` | Reserve space for ads, embeds and iframes with `min-height` or `aspect-ratio`, and keep it if the slot stays empty. | Late third-party content pushes text down. `aspect-ratio` Baseline widely. | https://web.dev/articles/optimize-cls | CSS/HTML | static: `<iframe>` without `width`/`height`/aspect class; ad slot div without min-height (heuristic) | – → `.ad{min-height:250px}` | – | warning |
| `perf/no-insert-above` | Do not insert banners, cookie notices or loaded content above existing content after load; overlay it or reserve space. | Content inserted near the top causes the largest shifts. | https://web.dev/articles/optimize-cls | any | manual / runtime (`cls-culprits-insight`) | top banner pushing page → fixed/overlay or reserved slot | – | warning |

### 3.9 INP-specific

Covered by `perf/long-task-yield`, `perf/handler-minimal-work`, `perf/no-forced-reflow`, `perf/dom-size`, `perf/content-visibility`, `perf/avoid-unneeded-hydration`. Phase map: input delay → long tasks and script evaluation at startup; processing → handler work; presentation delay → DOM size and client-side HTML rendering (https://web.dev/articles/optimize-inp). INP is field-only; in the lab use TBT and Lighthouse timespan `inp-breakdown-insight`.

### 3.10 What each framework offers (one row each)

| framework (version on npm 2026-11-11) | built-in feature | what it does for performance | docs |
|---|---|---|---|
| Next.js `next@16.4.6` | `next/image` | requires `width`/`height` or `fill`; lazy by default; `sizes`; default `formats: ['image/webp']` (AVIF opt-in); **`priority` deprecated in v16 in favour of `preload`**; docs say prefer `loading="eager"` or `fetchPriority="high"` for the LCP image; `qualities` config required since v16 (default `[75]`) | https://nextjs.org/docs/app/api-reference/components/image (updated 2026-11-06) |
| Next.js | `next/font` | downloads Google/local fonts at build time and self-hosts (browser makes no request to Google); `display` default `swap`; `preload` default true; `adjustFontFallback` generates metric-adjusted fallback | https://nextjs.org/docs/app/api-reference/components/font |
| Next.js | `next/script` | `strategy`: `beforeInteractive`, `afterInteractive` (default), `lazyOnload`, `worker` (experimental, Pages Router only) | https://nextjs.org/docs/app/api-reference/components/script |
| Nuxt `nuxt@4.6.4` | `@nuxt/image@2.2.1` (`<NuxtImg>`, `<NuxtPicture>`) | `format` (webp/avif), `sizes`, `densities`, `loading`, `preload` with `{ fetchPriority: 'high' }`, `placeholder` | https://nuxt.com/modules/image/usage/nuxt-img |
| Nuxt | `@nuxt/fonts@1.2.0` | detects `font-family` in CSS, downloads and self-hosts from providers with long cache headers, generates metric-matched fallbacks; 400/700 weights by default; subsetting opt-in | https://nuxt.com/modules/fonts |
| Angular `@angular/core@22.2.5` | `NgOptimizedImage` (`ngSrc`) | `priority` → `fetchpriority=high`, `loading=eager`, preload on SSR; requires width/height or `fill`; auto `srcset`; lazy by default; dev warnings for LCP image without `priority` and missing preconnect | https://angular.dev/guide/image-optimization |
| Angular | `@defer` blocks | split standalone components into lazy chunks; triggers `idle` (default), `viewport`, `interaction`, `hover`, `immediate`, `timer`, `when`; `prefetch on`; SSR renders placeholder unless incremental hydration (`hydrate` triggers); docs warn deferring initially visible content can raise CLS | https://angular.dev/guide/templates/defer |
| Astro `astro@7.4.10` | islands | zero client JS by default; hydrate per component with `client:load`/`client:idle`/`client:visible`/`client:media`/`client:only`; `server:defer` server islands | https://docs.astro.build/en/concepts/islands/ ; directives: https://docs.astro.build/en/reference/directives-reference/ |
| SvelteKit `@sveltejs/kit@3.2.0` | link preloading | `data-sveltekit-preload-data` (`hover` default in template, `tap`, `false`), `data-sveltekit-preload-code` (`eager`, `viewport`, `hover`, `tap`); skipped when Save-Data is on | https://svelte.dev/docs/kit/link-options |

---

## 4. Light libraries and tools (verified 2026-11-11)

| tool | version (date) | licence (where read) | size | what for |
|---|---|---|---|---|
| `web-vitals` | 6.2.3 (2026-10-05) | Apache-2.0 (npm `license` field) | **8.9 kB min, 3.3 kB min+gzip** (bundlephobia API: 8932 B / 3334 B), 0 dependencies; README says ~3K brotli, attribution build adds ~1.5K | field LCP/INP/CLS/FCP/TTFB in the page; `web-vitals/attribution` for debugging; `reportSoftNavs` option for soft navigations (Chromium 151+); send with `navigator.sendBeacon` on `visibilitychange` hidden |
| Lighthouse CI `@lhci/cli` | 0.16.0 (2026-11-02) | Apache-2.0 (npm) | CLI, not shipped to users (unpacked 99 kB, 14 deps) | run Lighthouse in CI with assertions/budgets per URL |
| `lighthouse` | 13.6.0 (2026-10-27) | Apache-2.0 (npm) | CLI (unpacked 19.4 MB) | local/CI audits; `--preset=desktop` for desktop throttling |
| `unlighthouse` | 0.19.1 (2026-10-03) | MIT (npm) | CLI | crawl a whole site and run Lighthouse on every route |
| `size-limit` | 14.3.0 (2026-10-22) | MIT (npm) | CLI (bundlephobia 1.9 kB gzip for its own entry; irrelevant to users) | fail CI when a bundle exceeds a byte/time budget |
| `rollup-plugin-visualizer` | 7.1.3 (2026-11-08) | MIT (npm) | dev plugin | treemap of Rollup/Vite bundles |
| `webpack-bundle-analyzer` | 5.4.2 (2026-11-06) | MIT (npm) | dev plugin | treemap of webpack bundles |
| `@next/bundle-analyzer` | 16.4.6 | MIT (npm) | dev plugin | Next.js wrapper around the webpack analyser |
| `source-map-explorer` | 2.5.3 (**2022-09-26**, unmaintained-looking) | Apache-2.0 (npm) | CLI | bundle composition from source maps; prefer the above |
| Lighthouse "treemap" | built into Lighthouse (`script-treemap-data`) | Apache-2.0 | – | bundle view without extra install |

---

## Notes for skill authors

- **Short skill** (always loaded): the CWV thresholds + 75th percentile line; the 10 high-value static rules: `perf/lcp-image-not-lazy`, `perf/lcp-image-priority`, `perf/lcp-discoverable`, `perf/img-dimensions`, `perf/script-defer`, `perf/third-party-async`, `perf/font-display`, `perf/bfcache-no-unload`, `perf/cache-hashed-assets`, `perf/long-task-yield` (with feature detection). Plus "use the framework's image/font/script component" pointers.
- **Reference file**: Lighthouse weights/curves/throttling, insight id table, framework table, resource hints, speculation rules, Partytown trade-offs.
- **Static vs runtime**: "which image is LCP" cannot be known from source reliably; static checks should only flag the obvious (first hero `<img>` with `loading=lazy`, `fetchpriority=high` + `lazy` together) and point to `lcp-discovery-insight` for proof. Lazy-loading "below the fold" is a runtime question; keep `perf/img-lazy-below-fold` as info.
- **Noisy/controversial**: `font-display: swap` vs `optional` (trade FOUT vs CLS); self-hosting vs font CDN (measure); `fetchpriority` gains vary by network/CDN; Partytown breaks some vendors; Speculation Rules cost data and can double-count analytics; `content-visibility` affects find-in-page and accessibility tree timing in edge cases; Lighthouse scores vary per run — never promise a score.
- **Never claim** a page "passes Core Web Vitals" from a lab run; only field data at p75 can show that.
- **Changes often, recheck before each release**: Lighthouse version and audit ids (13.x moved fast; insight ids differ from the migration blog), PSI's Lighthouse version, Baseline status (`fetch-priority` becomes widely available ~2027-04; `content-visibility`, `zstd`, `dns-prefetch` are newly available; `scheduler.yield` and `speculation-rules` limited), CrUX soft-navigation metrics (experimental, May 2027 target), Next.js image props (`priority` → `preload`), Chrome bfcache + `no-store` change.
- Lighthouse's new **Agentic Browsing** category (WebMCP, `llms.txt`, ARD) is labelled experimental by Lighthouse itself; hand to the SEO/a11y researcher, do not score it here.

---

## Not verified

- **Third-party facade library sizes** (e.g. `lite-youtube-embed`): not looked up on npm/bundlephobia in this pass; no library recommended.
- **Critical CSS tools** (e.g. `critters`/`beasties`): not checked; no library named.
- **The `decoding` attribute guidance** from a web.dev primary source: not fetched; rule kept as info only and based on Angular docs.
- **Exact desktop throttling as shipped in 13.6.0**: values read from DevTools `Constants.ts` on `main`, not from the exact `@paulirish/trace_engine@0.0.67` tarball; Lighthouse `docs/throttling.md` at v13.6.0 confirmed only the mobile values (150 ms, 1.6 Mbps/750 Kbps, 4×).
- **Whether PSI currently runs 13.6.0** and shows the Agentic Browsing category: release notes say PSI "within a week" of 2026-10-27 and v13.4.1 "enabled Agentic Browsing category via PSI API"; PSI itself was not checked.
- **Chrome version or date for bfcache with `Cache-Control: no-store`**: web.dev says only "work is underway".
- **Partytown maturity**: the trade-offs page does not state beta/stable; not otherwise confirmed.
