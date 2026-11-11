---
name: fe-css-modern
description: Uses current CSS features where they replace JavaScript or preprocessor work - native nesting, :has(), @scope, color-mix() and oklch, light-dark(), @starting-style, @property, text-wrap, anchor positioning - each with its Baseline status and a fallback. Use when modernising a stylesheet, replacing a JS-driven style, or asked "can I use this CSS feature", "do we still need Sass for this".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Modern CSS features
  area: styling
  lane: A
  requires: web
  globs: "**/*.css **/*.scss **/*.less **/*.vue **/*.svelte **/*.astro"
  rules: "css/baseline-check css/nesting-no-concat css/light-dark-color-scheme css/limited-needs-supports"
  version: 0.1.0
---

# Modern CSS features

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Check a feature's Baseline status against the project's browser targets before relying on it (css/baseline-check).
- Native nesting never joins `&` to a suffix (`&__title`); write the full selector or `&.modifier` (css/nesting-no-concat).
- With `light-dark()`, declare `color-scheme: light dark` on `:root` (css/light-dark-color-scheme).
- Anchor positioning and scroll-driven animations go in `@supports` with a working fallback (css/limited-needs-supports).
- Use `:has()` for parent and sibling state (`.field:has(:user-invalid)`) instead of classes toggled by JavaScript.
- Build palettes in `oklch()` and derive states with `color-mix(in oklch, …)`; still check contrast of every text pair.
- Animate entry and `display` changes with `@starting-style` and `transition-behavior: allow-discrete`, not timeouts.
- Register a custom property with `@property` when it must animate or needs a type.
- `text-wrap: balance` for headings, `pretty` for body text: both fail safe.
- Use `@scope` only as enhancement until it is Widely available; keep the class naming that works without it.

## Do this

1. Read the project's browser targets (`browserslist` in `package.json` or `.browserslistrc`, or the framework default) before choosing a feature.
2. Look the feature up in the table in the reference (date-stamped) or on the web-features explorer; Widely available features need no fallback.
3. For a Newly available feature, make sure the page still works without it; for a feature that is not Baseline, write the fallback first and the feature inside `@supports`.
4. Replace JavaScript that only toggles a style (parent highlight, open state, theme) with `:has()`, `:user-invalid`, `[open]`, `light-dark()`.
5. In a Sass project, keep Sass for loops and maps; native nesting, custom properties and `color-mix()` now cover what Sass was often used for.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports joined nesting suffixes, `light-dark()` without a colour scheme and anchor or scroll-timeline CSS outside `@supports`.
- By hand: open the page in the oldest browser of the project's targets (or disable the feature in DevTools) and confirm the fallback works.

## References

- [references/modern-css.md](references/modern-css.md): the Baseline table with dates, patterns for `:has()`, nesting, `@scope`, colour functions, `light-dark()`, `@starting-style`, `@property`, popover and anchor positioning. Read it when you choose or replace a feature.
