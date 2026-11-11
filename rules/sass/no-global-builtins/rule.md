---
id: sass/no-global-builtins
title: Call Sass built-in functions through their module (map.get, math.div, string.index) after @use "sass:...", not as globals.
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
  - title: Sass docs, Breaking change - @import and global built-in functions
    url: https://sass-lang.com/documentation/breaking-changes/import/
  - title: Sass docs, Built-in modules
    url: https://sass-lang.com/documentation/modules/
---

## Why

The global names of Sass's built-in functions (`map-get`, `nth`, `unit`, `str-index`, `percentage`...) were deprecated together with `@import` in Dart Sass 1.80.0 and go away in Dart Sass 3.0.0. Until then every call prints a deprecation warning, which buries the warnings that matter in the build log.

## Fix

Load the module once at the top of the file and call the namespaced function: `@use 'sass:map';` then `map.get($theme, primary)`; `sass:math` for `math.div`, `math.percentage`, `math.unit`; `sass:list`, `sass:string`, `sass:meta`, `sass:selector` for the rest. `sass-migrator module --built-in-only src/main.scss` rewrites the calls without touching `@import`.

## Examples

```scss
// bad
.alert { color: map-get($colors, danger); width: percentage(1 / 3); }
// good
@use 'sass:map';
@use 'sass:math';
.alert { color: map.get($colors, danger); width: math.percentage(math.div(1, 3)); }
```
