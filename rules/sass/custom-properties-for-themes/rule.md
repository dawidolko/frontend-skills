---
id: sass/custom-properties-for-themes
title: Values that change at run time (themes, dark mode, user settings) are CSS custom properties; Sass variables are for build-time constants.
severity: minor
check: manual
applies:
  - scss
  - vue
  - svelte
  - astro
stack:
  - sass
skill: fe-sass
since: 0.1.0
sources:
  - title: Sass docs, Variables (Sass variables compared with CSS variables)
    url: https://sass-lang.com/documentation/variables/
  - title: MDN, Using CSS custom properties
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
---

## Why

A Sass variable is replaced by its value when the stylesheet compiles; the browser never sees it. A dark theme built from `$bg` needs a second copy of every rule (or a second stylesheet), a user's font-size or contrast setting cannot reach it, and JavaScript cannot change it.

## Fix

Declare the themeable values as custom properties on `:root` (and override them under `[data-theme='dark']` or `@media (prefers-color-scheme: dark)`), and read them with `var(--color-surface)`. Keep Sass variables, maps and functions for what is fixed at build time: breakpoints in media queries, loops that generate classes, the base of the px-to-rem helper. A Sass map can still generate the custom properties in one loop. If the profile records `custom-properties` or `design-tokens` helpers, use those names.

## Examples

```scss
// bad
$surface: #fff;
.card { background: $surface; }
.dark .card { background: #111; }
// good
:root { --color-surface: #fff; }
[data-theme='dark'] { --color-surface: #111; }
.card { background: var(--color-surface); }
```
