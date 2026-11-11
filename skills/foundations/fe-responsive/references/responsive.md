# Responsive design reference

Depth for the `fe-responsive` skill. Rule ids in brackets: `frontend-skills explain <id>`. Checked on 2026-11-11 (`docs/sources/responsive.md`; Baseline from web-features 3.45.0, Lighthouse 13.6.0).

## The viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- Without it a phone lays the page out about 980 px wide and zooms out [responsive/viewport-meta].
- Never add `user-scalable=no` or `maximum-scale=1`: zoom is how many people read [a11y/zoom-not-blocked].
- `viewport-fit=cover` (edge-to-edge on notched phones) only with `env(safe-area-inset-*)` padding on fixed and edge UI:

```css
.bottom-bar { padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom)); }
```

- `interactive-widget=resizes-content` makes the layout, and `vh`, shrink when the on-screen keyboard opens; the default resizes only the visual viewport.

## Breakpoints

| Do | Avoid |
| --- | --- |
| Base styles for the narrowest screen, then `@media (width >= 48em)` | a desktop base undone by many `max-width` blocks |
| Breakpoints where the content breaks (line length, crowding) | device widths (`768px /* iPad */`) |
| `em` in media queries, which follow the browser's text size | `px` breakpoints |
| `@container` for components in slots of different widths | viewport queries inside reusable components |
| Intrinsic grids, `repeat(auto-fit, minmax(min(18rem, 100%), 1fr))` | a breakpoint per column count |

Range syntax (`width >= 48em`) is Baseline Widely available (since 2025-09-27); `min-width: 48em` means the same.

## Fluid type and space

```css
:root {
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --step-3: clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem);
  --space-fluid: clamp(1rem, 0.6rem + 2vw, 2.5rem);
}
```

- Bounds in `rem`, a small viewport term, the maximum at most about 2.5 times the minimum, so 200% zoom still doubles the text [responsive/no-viewport-font-size].
- `font-size: 5vw` alone does not grow with zoom (WCAG failure F94).
- Line length: `max-inline-size: 65ch` on running text.

## Viewport units

| Unit | Is | Use for |
| --- | --- | --- |
| `vh` | the large viewport (toolbars hidden) | nothing new; content hides under mobile toolbars |
| `svh` | the small viewport (toolbars shown) | `min-height` of a hero that must fit on first view |
| `dvh` | follows the toolbars as they move | full-screen app shells; it resizes while scrolling |
| `lvh` | the large viewport | backgrounds that may extend under toolbars |

Write `min-height: 100svh` (or `100dvh`), not `height: 100vh` [responsive/dynamic-viewport-units]. With Tailwind: `min-h-svh`, `min-h-dvh`.

## Media, tables and long content

```css
img, video, iframe { max-width: 100%; height: auto; }
.embed { inline-size: 100%; aspect-ratio: 16 / 9; }
.table-wrap { overflow-x: auto; }
.prose { overflow-wrap: anywhere; }
```

- `width` and `height` attributes on images reserve space; CSS scales them (see `fe-images`).
- A wide data table scrolls in its own wrapper; give the wrapper `tabindex="0"`, `role="region"` and an `aria-label` so keyboard users can scroll it.

## Touch and pointer

| Requirement | Size | Source |
| --- | --- | --- |
| Minimum (AA) | 24×24 CSS px, or spacing so a 24 px circle centred on the target touches no other target | WCAG 2.2 SC 2.5.8 |
| Enhanced (AAA) | 44×44 CSS px | WCAG 2.2 SC 2.5.5 |

Exceptions to 2.5.8: links inside a sentence, an equivalent control elsewhere on the page that passes, unmodified browser controls, and sizes that are essential or legally required. Enlarge the hit area with padding or a pseudo-element, not by scaling the icon:

```css
@media (any-pointer: coarse) { .icon-button { min-inline-size: 44px; min-block-size: 44px; } }
```

- Do not shrink targets for `pointer: fine`; mouse users with tremor need size too.
- Hover effects that only decorate go inside `@media (hover: hover)`; anything that reveals content also responds to focus and tap [responsive/no-hover-only].
- Dragging (sliders, sortable lists) needs a single-pointer alternative such as buttons (WCAG 2.5.7).
- Inputs: `type="email"`, `type="tel"`, `inputmode="numeric"` bring up the right keyboard (see `fe-forms`).

## Reflow, zoom and orientation

- At 320 CSS px wide (400% zoom of a 1280 px window), nothing scrolls sideways except data tables, maps, diagrams, video and code [responsive/reflow].
- Sticky headers and footers shrink or become static on short screens: `@media (max-height: 30em) { .site-header { position: static; } }`.
- Both orientations work; no rotate-your-device screens [responsive/orientation].

Quick check in the console at 320 px wide:

```js
[...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
```

## Print

```css
@media print {
  .site-nav, .site-footer, .cookie-banner, button { display: none; }
  body { color: #000; background: #fff; }
  a[href^="http"]::after { content: " (" attr(href) ")"; }
  figure, tr, .card { break-inside: avoid; }
}
```

## What tools check

| Check | Tool | Notes |
| --- | --- | --- |
| Viewport meta present, width set | Lighthouse 13 `viewport-insight` | diagnostic, weight 0 |
| Zoom blocked | axe / Lighthouse `meta-viewport` | accessibility category |
| Target size 24 px | axe / Lighthouse `target-size` | replaced the old `tap-targets` (removed in Lighthouse 12) |
| Reflow at 320 px, text spacing, orientation, hover-only content | none | a person, or a script like the one above |

Automated checks find only part of the problems; resize, zoom and use a touch device.

## Sources

- MDN, Viewport meta tag: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Viewport_meta_element
- web.dev, Learn Responsive Design: https://web.dev/learn/design
- web.dev, The large, small, and dynamic viewport units: https://web.dev/blog/viewport-units
- web.dev, Baseline in action, fluid type: https://web.dev/articles/baseline-in-action-fluid-type
- web.dev, Accessible tap targets: https://web.dev/articles/accessible-tap-targets
- WCAG 2.2, Understanding 1.4.4, 1.4.10, 1.3.4, 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/
- WCAG 2.2, Failure F94: https://www.w3.org/WAI/WCAG22/Techniques/failures/F94
- MDN, env(): https://developer.mozilla.org/en-US/docs/Web/CSS/env
- MDN, Printing: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing
- Lighthouse changelog: https://github.com/GoogleChrome/lighthouse/blob/main/changelog.md
