---
id: css/icon-from-set
title: With a generated icon set, CSS uses its icon classes or mixin, never a url() hard-coded to an icon file.
severity: minor
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: MDN, mask-image
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image
  - title: MDN, SVG use element (sprites)
    url: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/use
  - title: Vite, Static Asset Handling
    url: https://vite.dev/guide/assets
---

## Why

When the build turns a folder of source SVGs into a sprite or into icon classes, that output is the one place where an icon is sized, coloured, optimised and renamed. A `url()` written by hand to one SVG file skips all of it: the icon is not optimised, does not take `currentColor`, keeps working only until the file moves, and a second copy of the icon starts to drift. The rule runs only when the project has such a set: the helper `icon-classes` or `icon-sprite` in the profile, or icon classes or an icons module in the file.

## Fix

Add the SVG to the icon source folder, rebuild, and use what the build generates: the class (`.icon-search`), the mixin (`@include icons.icon(search)`) or, in markup, the icon component or `<use href="#icon-search">` (see `html/project-icons` and `html/icon-from-set`). Illustrations and photos are not icons and keep their `url()`.

## Examples

```scss
// bad
.search-btn::before { mask: url('../assets/icons/search.svg'); }
// good
.search-btn::before { @include icons.icon(search); }
```
