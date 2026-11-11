# CSS layout reference

Depth for the `fe-css-layout` skill. Rule ids in brackets: `frontend-skills explain <id>`. Baseline status from web-features 3.45.0, read 2026-11-11 (`docs/sources/css.md`).

## Choosing the tool

| Need | Use | Not |
| --- | --- | --- |
| Items in one row or column, sizes from content | `display: flex` + `gap` | floats, inline-block [css/no-float-layout] |
| Rows and columns, cards that wrap | `display: grid` + `repeat(auto-fit, minmax(…))` | percentage widths per breakpoint |
| Parts of sibling cards that must line up | `grid-template-rows: subgrid` | fixed heights on titles |
| A component that sits in slots of different widths | `container-type: inline-size` + `@container` | viewport media queries |
| Page regions at different screen sizes | `@media (width >= 48em)` | device-named breakpoints |
| Text wrapped around an image | `float: inline-start` on the image | grid |

## Recipes

```css
/* Stack: vertical rhythm between blocks */
.stack { display: flex; flex-direction: column; gap: var(--space-4); }

/* Cluster: tags, buttons, a toolbar that wraps */
.cluster { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }

/* Card grid that needs no breakpoint */
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); gap: var(--space-6); }

/* Sidebar that drops below the content when the space runs out */
.with-sidebar { display: flex; flex-wrap: wrap; gap: var(--space-6); }
.with-sidebar > :first-child { flex: 1 1 16rem; }
.with-sidebar > :last-child { flex: 999 1 30rem; min-width: 0; }

/* Page shell: header, main, footer; the footer stays at the bottom on short pages */
body { min-height: 100svh; display: grid; grid-template-rows: auto 1fr auto; }

/* Centre anything */
.center { display: grid; place-items: center; }

/* Readable column with full-bleed children */
.content { display: grid; grid-template-columns: 1fr min(65ch, 100% - 2rem) 1fr; }
.content > * { grid-column: 2; }
.content > .full-bleed { grid-column: 1 / -1; }

/* Cards whose title, body and footer line up across a row */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--space-4); }
.card { display: grid; grid-row: span 3; grid-template-rows: subgrid; }
```

`min()` inside `minmax()` stops a track from overflowing a container narrower than the minimum. `min-width: 0` lets a flex or grid child shrink below the width of a long word or a `<pre>`.

## Container queries

```css
.card-slot { container: card / inline-size; }
.card { display: grid; gap: var(--space-3); }
@container card (width >= 30rem) {
  .card { grid-template-columns: 10rem 1fr; }
}
```

- `inline-size` is almost always right; `size` collapses an element that has no height of its own [css/container-type-size].
- Container query units (`cqi`) size things relative to the container: `font-size: clamp(1rem, 0.8rem + 2cqi, 1.5rem)`.
- Size queries are Baseline Widely available (since 2025-08-14); style queries are Newly available (2026-05-19): use them as enhancement.

## Heights and overflow

- Let content set the height. Use `min-height` and padding; a fixed `height` with `overflow: hidden` clips enlarged or spaced text [css/no-fixed-height-text].
- Truncate on purpose with `line-clamp` (with `display: -webkit-box; -webkit-box-orient: vertical`) and give a way to read the rest.
- Wide content (code, data tables) scrolls in its own wrapper (`overflow-x: auto`), never the page.

## Logical properties

| Physical | Logical |
| --- | --- |
| `margin-left`, `margin-right` | `margin-inline-start`, `margin-inline-end` (`margin-inline` for both) |
| `padding-top`, `padding-bottom` | `padding-block-start`, `padding-block-end` (`padding-block`) |
| `left`, `right` | `inset-inline-start`, `inset-inline-end` |
| `width`, `height` | `inline-size`, `block-size` |
| `text-align: left` | `text-align: start` |
| `border-left` | `border-inline-start` |

Logical properties follow `dir` and `writing-mode` [css/logical-properties]; they are Baseline Widely available.

## Baseline (web-features 3.45.0, 2026-11-11)

| Feature | Status |
| --- | --- |
| Flexbox, grid, `gap` in flexbox | Widely available |
| Subgrid | Widely available since 2026-03-15 |
| Container size queries | Widely available since 2025-08-14 |
| Container style queries | Newly available since 2026-05-19 |
| Logical properties | Widely available since 2024-03-20 |
| `aspect-ratio` | Widely available since 2024-03-20 |
| `min()`, `max()`, `clamp()` | Widely available since 2023-01-28 |

## Sources

- MDN, CSS grid layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- MDN, Subgrid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid
- MDN, CSS flexible box layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
- MDN, gap: https://developer.mozilla.org/en-US/docs/Web/CSS/gap
- MDN, CSS container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- MDN, CSS logical properties and values: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- web.dev, Learn CSS (layout, grid, flexbox): https://web.dev/learn/css
- WCAG 2.2, Understanding 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- web-features explorer: https://web-platform-dx.github.io/web-features-explorer/
