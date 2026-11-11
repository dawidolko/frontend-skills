---
id: sass/math-div
title: Divide with math.div() in Sass; a slash between Sass values is becoming a list separator, as it is in CSS.
severity: minor
check: static
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
  - title: Sass docs, Breaking change - slash as division
    url: https://sass-lang.com/documentation/breaking-changes/slash-div/
  - title: Sass docs, sass:math
    url: https://sass-lang.com/documentation/modules/math/
---

## Why

CSS uses `/` as a separator (`grid-area: 1 / 3`, `font: 1rem/1.5`, `aspect-ratio: 16 / 9`), so `$width / 2` means two different things to Sass and to CSS. Dart Sass warns on every division with `/` and will treat it as a separator in a future major version, at which point `$gutter / 2` silently compiles to `16px/2`, an invalid value the browser drops.

## Fix

`@use 'sass:math';` and write `math.div($gutter, 2)`; inside `calc()` the slash is CSS and stays. Where you really want a slash in the output, use `list.slash($a, $b)` or interpolation. `sass-migrator division src/**/*.scss` rewrites a whole code base.

## Examples

```scss
// bad
.col { padding-inline: $gutter / 2; width: (100% / 3); }
// good
@use 'sass:math';
.col { padding-inline: math.div($gutter, 2); width: math.div(100%, 3); }
```
