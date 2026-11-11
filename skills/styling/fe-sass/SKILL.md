---
name: fe-sass
description: Writes and reviews Sass (SCSS) for Dart Sass - the module system with @use and @forward, sass:math and sass:color, division, placeholders, the project's px-to-rem helper - and says when plain CSS now does the job. Use when editing .scss files or scss style blocks, removing @import or deprecation warnings, or asked to review Sass.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Sass (SCSS)
  area: styling
  lane: B
  requires: sass
  globs: "**/*.scss **/*.sass **/*.vue **/*.svelte **/*.astro"
  rules: "sass/no-import sass/no-global-builtins sass/no-legacy-color-functions sass/math-div sass/rem-helper css/rem-helper sass/no-extend-class sass/no-node-sass sass/custom-properties-for-themes"
  version: 0.1.0
---

# Sass (SCSS)

Read `.frontend-skills/profile.json` (above all `helpers`: the rem function, tokens, custom properties) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Load files with `@use` and re-export with `@forward`; never `@import` (sass/no-import).
- Call built-ins through their modules: `map.get`, `math.percentage`, `string.index` (sass/no-global-builtins).
- Change colours with `color.scale` or `color.adjust`, never `darken`, `lighten` or `fade-out` (sass/no-legacy-color-functions).
- Divide with `math.div()`; a bare `/` between Sass values is deprecated (sass/math-div).
- Write sizes with the project's px-to-rem function, never raw px (css/rem-helper) or a hand-made `math.div(24px, 16px) * 1rem` (sass/rem-helper).
- `@extend` only `%placeholders`; otherwise use a mixin (sass/no-extend-class).
- Compile with Dart Sass (`sass` or `sass-embedded`), never `node-sass` (sass/no-node-sass).
- Themeable values are CSS custom properties; Sass variables are build-time constants (sass/custom-properties-for-themes).
- Keep nesting shallow (about three levels) and put declarations before nested rules.

## Do this

1. Check the profile's `helpers`: with a `rem-function`, every size goes through it (`rem-calc(24px)`); with `custom-properties` or `design-tokens`, use those names instead of new variables.
2. Structure: partials per concern (`_tokens.scss`, `_functions.scss`, `_mixins.scss`), an `_index.scss` that `@forward`s them, and `@use 'abstracts'` at the top of each file. Use namespaces (`tokens.$space-4`); `as *` only for a small file you own.
3. Configure a library with `@use 'lib' with ($primary: ...)`; give your own module's settings `!default`.
4. Migrate a code base with the official tool: `npx sass-migrator module --migrate-deps src/main.scss`, then `npx sass-migrator division 'src/**/*.scss'`. Run the build and fix the remaining deprecation warnings, one kind at a time.
5. Prefer plain CSS where it is now enough: native nesting, `var()`, `color-mix()`, `clamp()`, `@layer` and `@container` need no Sass. In a Tailwind 4 project, do not add Sass at all (tailwind/no-preprocessor).
6. Plain CSS concerns (line height, `!important`, `z-index`, tokens) follow the `fe-css-architecture` skill.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports `@import`, global built-ins, deprecated colour functions, slash division, sizes that bypass the rem helper, `@extend` of classes and `node-sass`.
- Build once and read the warnings: Dart Sass names each deprecation (`import`, `global-builtin`, `slash-div`, `color-functions`); `--fatal-deprecation=<name>` in CI keeps a fixed one fixed.
- Lint with `stylelint-scss` where the project uses Stylelint.

## References

- [references/sass.md](references/sass.md): module system, built-in modules and their old global names, colour and division migration, the rem helper, deprecation timeline, what plain CSS replaces. Read it when migrating, adding a helper or reviewing a large stylesheet.
