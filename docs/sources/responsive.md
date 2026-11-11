# Responsive design: sources and candidate rules

Read on 2026-11-11. Primary sources:

- WCAG 2.2 Understanding docs: 1.4.4 Resize Text https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html; 1.4.10 Reflow https://www.w3.org/WAI/WCAG22/Understanding/reflow.html; 1.4.12 Text Spacing https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html; 1.3.4 Orientation https://www.w3.org/WAI/WCAG22/Understanding/orientation.html; 2.5.8 Target Size (Minimum) https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html; 2.5.5 Target Size (Enhanced) https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html; 1.4.13 Content on Hover or Focus https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html; 2.5.7 Dragging Movements https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html; 1.4.8 Visual Presentation https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html; failure F94 https://www.w3.org/WAI/WCAG22/Techniques/failures/F94
- MDN: Viewport meta tag https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag; env() https://developer.mozilla.org/en-US/docs/Web/CSS/env; hover https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover; pointer https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer; container-type https://developer.mozilla.org/en-US/docs/Web/CSS/container-type; Printing https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing; Responsive images https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images
- web.dev: Learn Responsive Design https://web.dev/learn/design (media queries, responsive images, interaction, typography); Viewport units https://web.dev/blog/viewport-units; Fluid type (Baseline in action, 2025-12-16) https://web.dev/articles/baseline-in-action-fluid-type; Accessible tap targets https://web.dev/articles/accessible-tap-targets
- Lighthouse 13.6.0 (npm, Apache-2.0, published 2026-10-27): changelog https://github.com/GoogleChrome/lighthouse/blob/main/changelog.md; default config https://github.com/GoogleChrome/lighthouse/blob/v13.6.0/core/config/default-config.js; Lighthouse 13 article https://developer.chrome.com/blog/lighthouse-13-0; viewport insight https://developer.chrome.com/docs/performance/insights/viewport
- axe-core rule pages (Deque, axe 4.11): meta-viewport https://dequeuniversity.com/rules/axe/4.11/meta-viewport; meta-viewport-large https://dequeuniversity.com/rules/axe/4.11/meta-viewport-large; target-size https://dequeuniversity.com/rules/axe/4.11/target-size; scrollable-region-focusable https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable
- web-features `3.45.0` (Apache-2.0, 2026-11-02) for Baseline: https://web-platform-dx.github.io/web-features-explorer/
- W3Schools Responsive pages: viewport https://www.w3schools.com/css/css_rwd_viewport.asp; media queries https://www.w3schools.com/css/css_rwd_mediaqueries.asp; images https://www.w3schools.com/css/css_rwd_images.asp

## Baseline status of features used here (web-features 3.45.0, read 2026-11-11)

| feature | id | status | Newly since | Widely since |
|---|---|---|---|---|
| Media queries | `media-queries` | Widely | 2015-07-29 | 2018-01-29 |
| Media query range syntax (`width >= 40em`) | `media-query-range-syntax` | Widely | 2023-03-27 | 2025-09-27 |
| Container size queries | `container-queries` | Widely | 2023-02-14 | 2025-08-14 |
| `min()`, `max()`, `clamp()` | `min-max-clamp` | Widely | 2020-07-28 | 2023-01-28 |
| Viewport units `vw/vh` | `viewport-units` | Widely | 2017-10-17 | 2020-04-17 |
| Small/large/dynamic viewport units (`svh/lvh/dvh`, plus `vi/vb`) | `viewport-unit-variants` | Widely | 2022-12-05 | 2025-06-05 |
| Interaction media queries (`hover`, `any-hover`, `pointer`, `any-pointer`) | `interaction` | Widely | 2018-12-11 | 2021-06-11 |
| `srcset` and `sizes` | `srcset` | Widely | 2017-03-27 | 2019-09-27 |
| `<picture>` | `picture` | Widely | 2016-03-21 | 2018-09-21 |
| `aspect-ratio` | `aspect-ratio` | Widely | 2021-09-20 | 2024-03-20 |
| `object-fit` | `object-fit` | Widely | 2020-01-15 | 2022-07-15 |
| Lazy-loading images/iframes | `loading-lazy` | Widely | 2023-12-19 | 2026-06-19 |
| `<img sizes="auto">` | `sizes-auto` | Limited | – | – |
| Safe-area `env()` variables | `safe-area-inset` | Widely | 2020-01-15 | 2022-07-15 |
| `lh` / `rlh` units | `lh`, `rlh` | Widely | 2023-11-21 | 2026-05-21 |
| Page breaks (`break-*`) | `page-breaks` | Widely | 2019-01-29 | 2021-07-29 |
| `@page` setup | `page-setup` | Newly | 2024-12-11 | – |
| `print-color-adjust` | `print-color-adjust` | Newly | 2025-05-01 | – |
| `text-size-adjust` | `text-size-adjust` | Limited | – | – |
| Responsive iframes (`frame-sizing`) | `frame-sizing` | Limited | – | – |

Re-read before each release; these dates move.

## Viewport and zoom

Severity: `responsive/viewport-meta` error, `responsive/no-zoom-block` error, `responsive/maximum-scale-5` info, `responsive/viewport-fit-safe-area` warning.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/viewport-meta | Every HTML page needs `<meta name="viewport" content="width=device-width, initial-scale=1">` in `<head>`. | Without it mobile browsers lay out a wide virtual page and zoom out; Lighthouse's viewport insight also links a missing tag to tap delay. | MDN Viewport meta tag; W3Schools RWD viewport https://www.w3schools.com/css/css_rwd_viewport.asp; Chrome viewport insight https://developer.chrome.com/docs/performance/insights/viewport | HTML / framework layout | static: no `meta[name=viewport]` or no `width=` in it (frameworks such as Next.js inject a default, so check the rendered HTML too); runtime: Lighthouse `viewport-insight` | missing tag → add it | – |
| responsive/no-zoom-block | Never set `user-scalable=no` (or `0`) or a `maximum-scale` below 2 in the viewport meta. | Blocks pinch zoom that low-vision users need; axe maps this to 1.4.4 Resize Text (AA). | WCAG 1.4.4; axe `meta-viewport`; MDN Viewport meta tag ("Accessibility concerns") | HTML | static: parse `content`; runtime: Lighthouse/axe `meta-viewport` | `maximum-scale=1, user-scalable=no` → remove both | – |
| responsive/maximum-scale-5 | If `maximum-scale` is set at all, keep it at 5 or more (better: omit it). | 500% zoom is Deque's best practice and MDN's recommendation; WCAG itself requires 200%. | axe `meta-viewport-large` (best practice, not WCAG); MDN Viewport meta tag | HTML | static | `maximum-scale=3` → omit | – |
| responsive/viewport-fit-safe-area | When you set `viewport-fit=cover`, pad fixed and edge-touching UI with `env(safe-area-inset-*)` (e.g. `padding-bottom: calc(1rem + env(safe-area-inset-bottom))`). | Otherwise notches, rounded corners or home indicators cover content; insets read 0 elsewhere so it is safe everywhere. | MDN Viewport meta tag (`viewport-fit`); MDN env() | HTML + CSS | static: `viewport-fit=cover` present and no `safe-area-inset` in CSS | – | – |
| responsive/interactive-widget | Choose `interactive-widget=resizes-content` only if you want the layout (and `vh` units) to shrink when the on-screen keyboard opens; the default resizes only the visual viewport. | Explains "my sticky footer jumps over the keyboard" bugs. | MDN Viewport meta tag (`interactive-widget`) | HTML | manual | – | – |

## Layout strategy and breakpoints

Severity: `responsive/no-fixed-wide-width` error; `responsive/content-breakpoints`, `responsive/mobile-first` info; `responsive/hide-not-remove` warning.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/mobile-first | Write the base styles for the narrowest screen and add layout with `min-width` (or `width >=`) queries. | Simple screens get the least CSS and overrides stay additive; W3Schools' own examples build upward with `min-width`. | W3Schools RWD media queries https://www.w3schools.com/css/css_rwd_mediaqueries.asp; MDN Using media queries https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries | CSS | static: ratio of `max-width` to `min-width` queries (info only) | desktop base + many `max-width` undo blocks → mobile base + `min-width` | – |
| responsive/content-breakpoints | Put breakpoints where the content breaks (line length, wrapping, crowding), not at device widths, and prefer `em` for text-driven breakpoints. | Device sizes change every year; em-based queries follow the user's font size. | web.dev Learn Design, Media queries https://web.dev/learn/design/media-queries | CSS | manual | `@media (max-width: 768px) /* iPad */` → `@media (width >= 50em)` where the layout needs it | – |
| responsive/container-queries | Use container queries for components that appear in containers of different widths; no polyfill is needed (Widely since 2025-08-14). | The component adapts to its slot, not the window. | MDN Container queries https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries; MDN container-type | CSS | manual | – | no polyfill (see css.md) |
| responsive/no-fixed-wide-width | Do not give layout elements a fixed `width`/`min-width` larger than 320 CSS px; use `max-width`, percentages, `fr`, `min()` or `minmax()`. | A wide fixed box forces horizontal scrolling and fails 1.4.10 Reflow (AA) at 320 px. | WCAG 1.4.10; W3Schools RWD viewport ("avoid large fixed widths") | CSS | static: `width`/`min-width` ≥ 321px on non-media, non-table elements, excluding inside `@media (min-width…)`; runtime: at 320×256 check `scrollWidth > clientWidth` | `.wrap{width:960px}` → `.wrap{max-width:60rem; margin-inline:auto}` | – |
| responsive/fluid-grid | Prefer intrinsic grids such as `repeat(auto-fit, minmax(min(15rem, 100%), 1fr))` over many breakpoint steps. | Fewer queries; `min()` stops the track from overflowing on very narrow screens. | MDN clamp/min https://developer.mozilla.org/en-US/docs/Web/CSS/clamp; web-features `min-max-clamp` (Widely 2023-01-28) | CSS | manual | – | – |
| responsive/hide-not-remove | Do not hide content or functions on small screens with `display:none`; reorganise them (menu, disclosure) instead. | Mobile users need the same information; hidden controls can mean a missing function. | W3Schools RWD media queries (shows hiding as an option); WCAG 1.4.10 (no loss of content or functionality) | CSS | static: `display:none` inside a narrow `max-width` query on nav/content selectors (warning, manual confirm) | – | – |
| responsive/measure | Limit text line length with `max-inline-size` in `ch`/`em` (WCAG AAA suggests at most 80 characters). | Very long lines are hard to read on wide screens. | WCAG 1.4.8 Visual Presentation (AAA) | CSS | manual | `p{}` full width at 1920 px → `p{max-inline-size:70ch}` | – |

## Fluid type, spacing and units

Severity: `responsive/no-vw-only-type` error; `responsive/clamp-rem-bounds` warning; `responsive/relative-units` warning.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/no-vw-only-type | Never size text with viewport units alone (`font-size: 4vw`, `calc(2vw + 2vh)`). | Zoom and browser text settings do not change viewport units, so text may not reach 200% (failure F94 of 1.4.4 AA). | WCAG F94; web.dev fluid type article | CSS | static: `font-size` whose value contains only `vw/vh/vi/vb/vmin/vmax/cqi` units | `font-size:5vw` → `font-size:clamp(1.75rem, 1.2rem + 2vw, 3rem)` | – |
| responsive/clamp-rem-bounds | In fluid `clamp()` type, set min and max in `rem`/`em`, keep the viewport term small, and keep the max no more than about 2.5 times the min. | rem bounds follow user font settings; web.dev cites the 2.5× ratio as keeping 1.4.4 reachable in modern browsers. | web.dev "Baseline in action: fluid type" (2025-12-16) | CSS | static: `clamp()` in `font-size` with px bounds, or max/min ratio > 2.5; runtime: zoom to 200% and compare | `clamp(14px, 3vw, 48px)` → `clamp(1rem, 0.9rem + 0.5vw, 1.25rem)` | – |
| responsive/fluid-spacing | Use `clamp()` with `rem` bounds for spacing that should scale with the viewport, sharing the same tokens as type. | Smooth spacing without breakpoint jumps. | MDN clamp() | CSS | manual | – | – |
| responsive/relative-units | Use `rem` for type and most spacing, `em` for component-internal spacing that should follow its font size, `%`/`fr` for layout, and `px` mainly for borders and hairlines. | Layout follows the user's font size and zoom. | W3Schools CSS Accessibility #2 https://www.w3schools.com/css/css_accessibility.asp; WCAG 1.4.4 | CSS | static: share of `px` in `font-size` declarations | – | – |

## Viewport-height units

Severity: `responsive/no-100vh-mobile` warning.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/no-100vh-mobile | For full-height sections use `100svh` (always fits with browser toolbars shown) or `100dvh` (tracks toolbars), usually as `min-height`, not `height: 100vh`. | `vh` equals the large viewport, so content hides under mobile toolbars; the variants are Widely since 2025-06-05. | web.dev Viewport units https://web.dev/blog/viewport-units; web-features `viewport-unit-variants` | CSS | static: `height: 100vh` / `min-height: 100vh` | `height:100vh` → `min-height:100svh` | – |
| responsive/dvh-not-for-heavy-layout | Avoid `dvh` on large layout boxes whose resize is costly; prefer `svh`/`lvh` for stable sizes. | `dvh` changes while toolbars move (updates are throttled, not every frame), which can resize content during scrolling. | web.dev Viewport units (update behaviour) | CSS | manual | – | – |
| responsive/no-fixed-height-viewport-text | Do not combine a viewport-based `height` with `overflow:hidden` on text content. | At zoom or in landscape the text is clipped (1.4.10, 1.4.12). | WCAG 1.4.10, 1.4.12 | CSS | static: `height: *vh` + `overflow:hidden` on same rule | – | – |

## Images, media, tables and wide content

Severity: `responsive/img-max-width` warning, `responsive/img-dimensions` warning, `responsive/srcset-needs-sizes` warning, `responsive/table-scroll-region` warning, `responsive/long-words` info, others info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/img-max-width | Give images, video and iframes `max-inline-size: 100%` (or `max-width: 100%`) with `block-size: auto`; avoid `width: 100%` for images that may be smaller than their container. | They never overflow, keep proportions, and are not upscaled beyond natural size. | web.dev Responsive images https://web.dev/learn/design/responsive-images; W3Schools RWD images https://www.w3schools.com/css/css_rwd_images.asp | CSS | static: no global `img{max-width:100%}`-type rule in base CSS | `img{width:100%}` → `img{max-width:100%;height:auto}` | – |
| responsive/img-dimensions | Put `width` and `height` attributes (the intrinsic ratio) on every `<img>`, then let CSS scale it. | The browser reserves space before load, preventing layout shift. | web.dev Responsive images | HTML | static: `<img>` without both attributes (framework image components may add them) | – | – |
| responsive/srcset-needs-sizes | When `srcset` uses `w` descriptors, add a `sizes` attribute that matches the CSS display width; do not mix `w` and `x` descriptors. | Without `sizes` the browser assumes `100vw` and downloads too large a file. | web.dev Responsive images; MDN Responsive images https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images | HTML | static: `srcset` containing `\d+w` and no `sizes`; runtime: Lighthouse `image-delivery-insight` | – | – |
| responsive/picture-art-direction | Use `<picture>` with `media` sources only for art direction or format switching, and always include the inner `<img>` (it carries `alt` and is what renders). | `<picture>` alone shows nothing; W3Schools calls the `<img>` a fallback for old browsers, but it is required in all browsers. | MDN picture https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture; W3Schools RWD images | HTML | static: `<picture>` without `<img>` child | – | – |
| responsive/aspect-object-fit | Use `aspect-ratio` to fix a media box's shape and `object-fit: cover`/`contain` (with `object-position`) to fill it, instead of padding hacks or background images for content images. | Native, Widely available; content images keep `alt`. | web.dev Responsive images; MDN aspect-ratio https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio, object-fit https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit | CSS | static: `padding-top: 56.25%` hacks | padding-top hack → `aspect-ratio:16/9` | – |
| responsive/lazy-below-fold | Use `loading="lazy"` only for images below the first screen and never on the LCP image; mark that one `fetchpriority="high"`. | Lazy-loading the hero delays LCP. | web.dev Responsive images | HTML | static: first `<img>` in main/hero with `loading=lazy`; runtime: Lighthouse LCP insights | – | – |
| responsive/table-scroll-region | Let wide data tables scroll horizontally inside their own wrapper (`overflow-x: auto`) instead of making the whole page scroll, and make that wrapper keyboard-reachable (`tabindex="0"` plus a role and accessible name). | Reflow excepts a data table as a whole but not the page around it; Safari does not put scroll boxes in the tab order. | WCAG 1.4.10 (two-dimensional exception); axe `scrollable-region-focusable` (2.1.1 A) | HTML + CSS | static: `<table>` not inside an overflow wrapper; runtime: axe `scrollable-region-focusable`, 320 px overflow check | – | – |
| responsive/long-words | Let long unbroken strings (URLs, codes) wrap with `overflow-wrap: anywhere` (or `break-word`) and do not set `white-space: nowrap` on running text. | One long token can force horizontal scrolling at 320 px. | MDN overflow-wrap https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap; WCAG 1.4.10 | CSS | static: `white-space:nowrap` on paragraphs/containers | – | – |
| responsive/embeds-fluid | Size iframes and video embeds with `inline-size: 100%` and `aspect-ratio`, not fixed pixel width/height attributes alone. | Fixed embeds overflow narrow screens; auto-sizing iframes (`frame-sizing`) is Limited. | web.dev Responsive images (same rule applies to video/iframes); web-features `frame-sizing` | HTML + CSS | static: `<iframe width="560">` with no CSS override | – | – |

## Touch, pointer and hover

Severity: `responsive/target-size-24` error (it is AA), `responsive/no-hover-only` error, `responsive/target-size-44` info, others warning/info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/target-size-24 | Make every pointer target at least 24×24 CSS px, or space it so a 24 px circle centred on it touches no other target or circle; exceptions: an equivalent control that passes, links inside a sentence, unmodified browser controls, and cases where the size is essential or legally required. | Small, crowded targets cause mis-taps for people with tremor or large fingers; this is 2.5.8 (AA, new in 2.2). | WCAG 2.5.8 Understanding; axe `target-size`; Lighthouse a11y audit `target-size` | any | runtime: axe/Lighthouse `target-size`; static hint: icon buttons with `width/height` < 24px and no padding | 16 px icon button → `min-inline-size:24px; min-block-size:24px` (or padding) | – |
| responsive/target-size-44 | Aim for 44×44 CSS px on primary touch controls where you can. | 2.5.5 (AAA) asks 44×44 with the same exceptions minus spacing; web.dev suggests about 48 px with about 8 px gaps. | WCAG 2.5.5 Understanding; web.dev Accessible tap targets https://web.dev/articles/accessible-tap-targets | any | runtime (bounding boxes) | – | – |
| responsive/hit-area-padding | Enlarge a small visual target with padding (or a positioned pseudo-element) rather than scaling the icon, and do it at least under `(any-pointer: coarse)`. | Bigger hit area, same look. | web.dev Accessible tap targets; MDN pointer https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer | CSS | manual | – | – |
| responsive/no-hover-only | Never put information or controls behind hover alone; anything shown on hover must also show on focus and on tap. | Touch and keyboard users cannot hover. | web.dev Learn Design, Interaction https://web.dev/learn/design/interaction; WCAG 1.4.13 (AA) | CSS / JS | static: `:hover` rule that changes `display/visibility/opacity` of a child with no matching `:focus`/`:focus-within`/`:focus-visible` rule | `.card:hover .actions{display:flex}` → add `.card:focus-within .actions` | – |
| responsive/hover-media-guard | Wrap purely decorative hover effects in `@media (hover: hover)` (or `any-hover`) so touch devices do not get "sticky" hover states. | Many touch devices emulate hover on tap. | MDN hover https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover; web-features `interaction` (Widely 2021-06-11) | CSS | static: hover-only transforms/colour changes outside a hover query (info) | – | – |
| responsive/hover-content-1413 | Content that appears on hover or focus (tooltips, menus) must be dismissible without moving the pointer (Esc), hoverable, and persistent until dismissed. | 1.4.13 Content on Hover or Focus (AA). | WCAG 1.4.13 Understanding | CSS / JS | manual | – | – |
| responsive/no-pointer-size-shrink | Do not make targets smaller for `pointer: fine`; only enlarge them for `coarse`. | Small targets are hard for everyone, including mouse users with tremor. | web.dev Learn Design, Interaction | CSS | static: size reductions inside `(pointer: fine)` | – | – |
| responsive/drag-alternative | Any drag interaction (sliders, sortable lists, map panning) needs a single-pointer alternative such as buttons or tap-to-select. | 2.5.7 Dragging Movements (AA, new in 2.2). | WCAG 2.5.7 Understanding | JS | manual | – | – |
| responsive/input-keyboards | Use the right `type` and `inputmode` on inputs so mobile shows the right keyboard. | Fewer typing errors on touch. | web.dev Learn Design, Interaction | HTML | static: phone/email/number fields with `type=text` and no `inputmode` | `<input type=text name=phone>` → `type=tel` | – |

## Reflow, zoom, text spacing, orientation

Severity: `responsive/reflow-320` error, `responsive/text-spacing` error, `responsive/no-orientation-lock` error, `responsive/zoom-400` warning.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/reflow-320 | Content must read without two-direction scrolling at 320 CSS px wide (vertical-scrolling languages) and at 256 CSS px tall (horizontal-scrolling languages); only parts that truly need 2D layout (maps, diagrams, data tables as a whole, video, games, editing toolbars) are excepted. | 1.4.10 Reflow (AA); equals a 1280×1024 window at 400% zoom. | WCAG 1.4.10 Understanding | any | runtime: Playwright/Puppeteer set viewport 320×256 (and 1280×1024 at 400% zoom), assert `documentElement.scrollWidth <= clientWidth`, list overflowing elements; manual review of excepted parts | – | – |
| responsive/zoom-400 | Test at 200% and 400% browser zoom that nothing is cut off, overlapping or hidden behind sticky headers/footers. | Sticky bars that take half the zoomed viewport make pages unusable; 1.4.4 and 1.4.10. | WCAG 1.4.4, 1.4.10 | any | runtime + manual | large `position:sticky` header → make it static under `(max-height: 30em)` | – |
| responsive/text-spacing | The page must survive user overrides of line height 1.5×, paragraph spacing 2×, letter spacing 0.12× and word spacing 0.16× the font size, with no clipped or overlapping text. | 1.4.12 Text Spacing (AA); fixed heights and `overflow:hidden` are the usual cause (F104). | WCAG 1.4.12 Understanding | CSS | runtime: inject the four overrides with `!important` and check for `scrollHeight > clientHeight` on elements with `overflow:hidden`; manual visual check | see `css/fixed-height-text` | – |
| responsive/no-orientation-lock | Do not force portrait or landscape (no "rotate your device" walls, no CSS rotation tricks, no locked manifest orientation) unless the orientation is essential. | 1.3.4 Orientation (AA); devices mounted on wheelchairs may be fixed in one orientation. | WCAG 1.3.4 Understanding | CSS / JS / manifest | static: `@media (orientation: portrait)` rule that hides `body`/main or shows a rotate message; `screen.orientation.lock(`; web app manifest `orientation` | – | – |
| responsive/short-viewports | Test landscape phones and short windows; reduce fixed/sticky chrome with height queries (e.g. `(max-height: 30em)`). | Short viewports are where sticky UI covers content. | web.dev Learn Design, Media queries (height breakpoints) | CSS | manual | – | – |

## Print

Severity: info.

| id | rule (own words, one sentence) | why | source (name, URL, section/criterion) | applies to | check | bad → good | light library |
|---|---|---|---|---|---|---|---|
| responsive/print-styles | For content people print (articles, receipts, docs), add an `@media print` block that hides navigation and interactive chrome and uses readable dark-on-light text. | Saves paper and makes printouts usable. | MDN Printing https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing | CSS | static: content site with no `@media print` (info) | – | – |
| responsive/print-breaks | Use `break-inside: avoid` on figures, cards and table rows that should not split across pages. | Widely since 2021-07-29 (`page-breaks`). | MDN break-inside https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside | CSS | manual | legacy `page-break-inside` → `break-inside` | – |
| responsive/print-page | Set page margins with `@page` only as enhancement (Newly since 2024-12-11). | Not all engines honoured it until recently. | MDN @page https://developer.mozilla.org/en-US/docs/Web/CSS/@page; web-features `page-setup` | CSS | manual | – | – |

## What Lighthouse checks here (Lighthouse 13.6.0, read 2026-11-11)

| Lighthouse id | category | status today | what it checks |
|---|---|---|---|
| `viewport-insight` | Performance → Insights (weight 0, diagnostic) | present; replaced the old `viewport` audit in 13.0.0 (2025-10-10) | a viewport meta exists at first render, sets a width, and an initial scale ≥ 1 (ties a bad viewport to tap delay) |
| `meta-viewport` | Accessibility (weight 10, axe rule) | present | `user-scalable=no` or `maximum-scale` < 2 in the viewport meta |
| `target-size` | Accessibility (weight 7, axe rule, tagged wcag22aa) | present; replaced `tap-targets` | 2.5.8 24 px size/spacing check |
| `tap-targets` | was SEO | **removed** in 12.0.0 (2024-04-22), replaced by `target-size` | – |
| `font-size` | was SEO, then Best Practices | **removed** in 13.0.0, no replacement | – |
| `uses-responsive-images` | was Performance | replaced in 13.0.0 by `image-delivery-insight` | oversized/poorly delivered images |

Sources: Lighthouse changelog (12.0.0 "SEO Category Reorganization"; 13.0.0 "Notable Changes"), `core/config/default-config.js` at tag v13.6.0, Chrome "Lighthouse 13" article. Lighthouse does **not** test reflow at 320 px, text spacing, orientation, hover-only content or zoom; those need the runtime scripts above or a person.

## Notes for skill authors

- **Short skill:** viewport meta + no zoom block, mobile-first and content breakpoints, `no-fixed-wide-width`, `no-vw-only-type` + `clamp-rem-bounds`, `img-max-width` + `img-dimensions` + `srcset-needs-sizes`, `target-size-24`, `no-hover-only`, `reflow-320`, `text-spacing`, `no-100vh-mobile`, `no-orientation-lock`.
- **Reference file:** Baseline table, Lighthouse table, the 2.5.8 spacing-circle explanation and exceptions, the runtime reflow/text-spacing scripts, print and safe-area recipes.
- **Noisy:** `no-fixed-wide-width` (exclude tables, `pre`, carousels, things inside `min-width` queries); `hide-not-remove` (often fine for decorative parts); `target-size-24` static hints (inline links are excepted; only runtime measurement is reliable); `mobile-first` (style preference, info only).
- **Controversial:** whether `initial-scale=1` is needed (MDN calls it usually unnecessary; W3Schools and Lighthouse's insight expect it; keep it, it is harmless); W3Schools' device breakpoints (600/768/992/1200 px) are a simplification, flag as dated; `only screen` prefix in W3Schools examples is unnecessary today.
- **Recheck often:** Lighthouse audit ids (two reorganisations in 18 months); Baseline rows; axe rule versions (4.11 pages read today).
- **Tool limits:** automated tools catch the viewport meta, some target sizes and overflow at a fixed width; zoom behaviour, text-spacing breakage, hover/focus content and orientation need runtime scripts plus a person. Automated checks find only part of the problems.
- No runtime library is needed for anything in this file; everything is native CSS/HTML and Widely available except the items marked Newly/Limited.

## Not verified

- Whether axe's `target-size` rule is enabled by default in axe-core itself (the Deque page did not say); it is listed in Lighthouse 13.6.0's accessibility category.
- A candidate rule "never set `text-size-adjust: none`" was dropped: MDN (read today) describes `none` only as turning off automatic text inflation and says nothing about blocking user zoom, so the harm claim is unconfirmed. The property is Limited in web-features.
- MDN `break-inside` and `@page` page content: Baseline dates are from web-features; the page text itself was not read.
- The `a[href]::after { content: attr(href) }` print pattern and `print-color-adjust` usage: MDN Printing excerpt did not cover them; left out of the rules.
- iOS ignoring `user-scalable`/`maximum-scale` by default: stated on MDN Viewport meta tag, but not tested on a device; the rule is still needed for other browsers and for audits.
- Whether Chrome now puts scroll containers in the tab order by default (which would reduce the need for `tabindex="0"`): not checked; axe still flags Safari.
- Exact pixel figures for W3Schools device breakpoints are from their page (read today) and are not a standard.
