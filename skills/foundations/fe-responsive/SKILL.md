---
name: fe-responsive
description: Makes pages and components work from 320 CSS px phones to wide screens and at 400% zoom - viewport meta, fluid type and space, content breakpoints and container queries, no fixed wide boxes, dvh units, touch targets, no hover-only content, orientation and print. Use when building or fixing a layout for mobile, or asked "make this responsive", "it breaks on mobile", "it scrolls sideways".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Responsive design
  area: foundations
  lane: A
  requires: web
  globs: "**/*.html **/*.css **/*.scss **/*.less **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro"
  rules: "responsive/viewport-meta a11y/zoom-not-blocked responsive/dynamic-viewport-units responsive/no-viewport-font-size responsive/no-fixed-wide-width responsive/no-hover-only responsive/reflow responsive/orientation css/rem-units"
  version: 0.1.0
---

# Responsive design

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Every document has `<meta name="viewport" content="width=device-width, initial-scale=1">` (responsive/viewport-meta).
- Never block zoom: no `user-scalable=no`, no `maximum-scale` below 2 (a11y/zoom-not-blocked).
- Write the narrow layout first and widen it with `min-width` queries placed where the content breaks, in `em`, not device widths.
- Components react to their slot with `@container`; media queries are for page regions.
- No box wider than 320 CSS px without a cap: `max-width` or `min(100%, …)` (responsive/no-fixed-wide-width).
- Fluid type mixes `rem` into the formula, `clamp(1rem, 0.9rem + 1vw, 1.5rem)`, never viewport units alone (responsive/no-viewport-font-size).
- Font sizes in `rem` (the project's helper when it has one) (css/rem-units).
- Full-height sections use `min-height: 100svh` or `100dvh`, not `100vh` (responsive/dynamic-viewport-units).
- Pointer targets are at least 24×24 CSS px, primary touch controls about 44×44.
- Nothing is revealed on hover alone: show it on `:focus-within` and make it reachable on touch (responsive/no-hover-only).
- The page reads at 320 CSS px and 400% zoom without sideways scrolling, in both orientations (responsive/reflow, responsive/orientation).

## Do this

1. Fix the document shell once (root layout, `index.html`, `app.html`): viewport meta, no zoom block. Frameworks such as Next.js add a viewport tag; check the rendered HTML.
2. Set base styles for the narrowest screen; add `@media (width >= 48em)` steps only where the content needs them, and `@container` for components.
3. Make media fluid: `img, video, iframe { max-width: 100%; height: auto; }`, `aspect-ratio` for embeds, wide tables in a scrolling wrapper.
4. Size type and space with `rem` and `clamp()`; give long strings `overflow-wrap: anywhere`.
5. Give touch targets padding rather than larger icons; enlarge under `(any-pointer: coarse)`, never shrink under `fine`.
6. Add `@media print` for content people print: hide navigation, show link URLs where useful.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports a missing or wrong viewport, blocked zoom, `100vh`, viewport-only font sizes, fixed wide boxes and hover-only content.
- `audit --url <page>` adds Lighthouse and axe results (`meta-viewport`, `target-size`).
- By hand: DevTools device mode at 320×640 and 640×320, browser zoom 200% and 400%, Tab through every control, try the menu on a touch device.

## References

- [references/responsive.md](references/responsive.md): breakpoint strategy, fluid type and space formulas, container query patterns, viewport units, target size rules with the WCAG 2.5.8 exceptions, the reflow test script, safe areas, print, and what Lighthouse checks. Read it when you plan a responsive layout or fix a mobile bug.
