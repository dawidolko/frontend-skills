---
name: fe-css-architecture
description: Organises and reviews stylesheets (CSS, SCSS, Less, component styles) around the project's own tokens, helpers and icon set - cascade layers, specificity, rem sizing, unitless line-height, z-index scale, no magic numbers or hard-coded asset paths. Use when writing or refactoring CSS, adding a component's styles, or asked "clean up this CSS", "why does this style not apply", "use our tokens".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: CSS architecture and tokens
  area: styling
  lane: A
  requires: web
  globs: "**/*.css **/*.scss **/*.less **/*.vue **/*.svelte **/*.astro"
  rules: "css/design-tokens css/no-magic-numbers css/z-index-scale css/rem-helper css/rem-units css/unitless-line-height css/no-important css/no-id-selectors css/icon-from-set css/asset-url css/no-stale-prefixes"
  version: 0.1.0
---

# CSS architecture and tokens

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Take colours and spacing from the project's tokens; a literal used three times becomes a custom property (css/design-tokens).
- No hand-tuned offsets (`top: -7px`): use a step of the spacing scale or derive it from layout (css/no-magic-numbers).
- `z-index` comes from a named scale; inside a component use `isolation: isolate` and small values (css/z-index-scale).
- Sizes go through the project's px-to-rem function when it has one, `rem-calc(16px)` (css/rem-helper); otherwise font sizes are `rem` (css/rem-units).
- `line-height` is unitless, such as `1.5` (css/unitless-line-height).
- Order the cascade once with `@layer reset, base, components, utilities;`; `!important` only in utilities (css/no-important).
- Style classes, not ids; keep selectors to one or two classes and wrap resets in `:where()` (css/no-id-selectors).
- Icons come from the generated set (class, mixin or sprite), never a `url()` to an icon file (css/icon-from-set).
- Images and fonts by a relative path or alias the bundler resolves, never `/images/…` (css/asset-url).
- No hand-written vendor prefixes; Autoprefixer adds what the browserslist needs (css/no-stale-prefixes).
- Follow the naming convention the project already uses (BEM, CSS Modules, utilities); never mix two in one component.

## Do this

1. Find the project's conventions before writing a value: `helpers` in the profile (`rem-function`, `icon-classes`, `icon-sprite`, `custom-properties`, `design-tokens`), the tokens file (`:root` custom properties, `_tokens.scss`, Tailwind `@theme`), the layer order statement and the naming pattern of existing components.
2. Look every colour, space, radius, shadow and layer up in the tokens. A new value gets a token named by role (`--color-text-muted`, `--space-3`), not by hue or size.
3. Structure: layer order once at the top of the entry stylesheet; resets and base styles in `:where()`; a component is one class plus modifiers; utilities last.
4. Units: `rem` (or the project's helper) for type, space and breakpoints; `em` for spacing that follows the component's font; `px` only for borders, hairlines and shadows; unitless `line-height`.
5. Icons: add the SVG to the icon source folder and rebuild; use the generated class, mixin or component. Assets: keep them in `src/assets` and reference them relatively or by alias.
6. A finding you keep on purpose gets `fs-ignore <rule id>` and the reason on the same line.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports literals that have a token, values off the spacing scale, ad hoc `z-index`, px sizes beside the rem function, unit line heights, `!important`, id selectors, icon and asset paths, stale prefixes.
- By hand: change one token (the brand colour, the base spacing) and see the whole interface follow; run the project's Stylelint when it has one.

## References

- [references/architecture.md](references/architecture.md): token tiers and naming, spacing and z-index scales, units, cascade layers, naming conventions, the profile's `helpers` and how the checks adapt, icon and asset pipelines per bundler. Read it when you set up or refactor a stylesheet structure.
