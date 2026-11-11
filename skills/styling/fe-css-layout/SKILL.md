---
name: fe-css-layout
description: Builds and reviews page and component layout in CSS with grid, flexbox, gap, container queries and logical properties, with no float columns, no fixed heights on text and no magic offsets. Use when laying out a page, a grid of cards, a sidebar, a toolbar or a form, or when asked "fix this layout", "this overflows", "center this", "make these line up".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: CSS layout
  area: styling
  lane: A
  requires: web
  globs: "**/*.css **/*.scss **/*.less **/*.vue **/*.svelte **/*.astro"
  rules: "css/no-float-layout css/no-fixed-height-text css/container-type-size css/gap-over-margins css/logical-properties css/no-magic-numbers"
  version: 0.1.0
---

# CSS layout

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Lay out with grid (two dimensions, card grids, page regions) or flexbox (one row or column); never float columns or clearfixes (css/no-float-layout).
- Space items with `gap` on the container, not margins on children with `:last-child` resets (css/gap-over-margins).
- Let content set heights: `min-height`, never a fixed `height` with `overflow: hidden` on text (css/no-fixed-height-text).
- Prefer intrinsic grids, `repeat(auto-fit, minmax(min(18rem, 100%), 1fr))`, over breakpoint steps.
- Components that live in slots of different widths respond with `@container`; use `container-type: inline-size` (css/container-type-size).
- Align with `align-items`, `justify-content` and `place-items`, not with nudged offsets or negative margins (css/no-magic-numbers).
- Line up nested parts across siblings (card titles, footers) with `subgrid`, not fixed heights.
- Use logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) in new code, always in sites with right-to-left text (css/logical-properties).
- Never let a box be wider than its parent: `max-width: 100%`, `min-width: 0` on flex and grid children that hold long content.
- Keep source order equal to visual order; do not reorder with `order` or grid placement in a way that breaks reading and Tab order.

## Do this

1. Find the layout primitives the project already has (a `Stack`, `Cluster`, `Grid` component, layout utilities, a `.container` class) and use them before writing new CSS.
2. Decide the axis: content in one direction is flex, a grid with rows and columns is grid; nested parts that must align across cards are subgrid.
3. Write the narrow layout first, then widen it with `@container` for components or `@media (width >= 48em)` for page regions.
4. Spacing comes from tokens through `gap` and padding; outer spacing of a component is set by its parent, not by the component.
5. Test with long words, three times the text, an empty state and 320 CSS px of width.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports float columns and clearfixes, fixed heights on text, size containers without a height and offsets off the spacing scale.
- By hand: resize from 320 px to a wide screen and zoom to 400%: nothing overlaps, nothing scrolls sideways except data tables and code; check the reading order with Tab.

## References

- [references/layout.md](references/layout.md): recipes for the common layouts (stack, cluster, sidebar, card grid, holy grail, centring, sticky footer, full-bleed), container query patterns, subgrid, logical property map and Baseline dates. Read it when you build a layout from scratch.
