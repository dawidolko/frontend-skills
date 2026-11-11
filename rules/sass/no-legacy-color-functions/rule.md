---
id: sass/no-legacy-color-functions
title: Adjust colours with color.scale or color.adjust (and read channels with color.channel), not darken, lighten, fade-out and the like.
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
  - title: Sass docs, Breaking change - color functions
    url: https://sass-lang.com/documentation/breaking-changes/color-functions/
  - title: MDN, color-mix()
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
---

## Why

`darken`, `lighten`, `saturate`, `desaturate`, `adjust-hue`, `opacify`, `fade-in`, `transparentize`, `fade-out` and the single-channel getters (`red()`, `hue()`, `lightness()`...) assume one sRGB colour space. They were deprecated in Dart Sass 1.79.0 and are removed in Dart Sass 2.0.0. `darken($c, 20%)` subtracts a fixed amount, so a dark colour turns black while a light one barely changes.

## Fix

`@use 'sass:color';` then `color.scale($brand, $lightness: -20%)` for a relative change (or `color.adjust` for an absolute one), with `$space: oklch` for perceptually even steps, and `color.channel($c, 'lightness', $space: hsl)` to read a channel. For colours that change at run time (themes, dark mode), use CSS `color-mix(in oklch, var(--brand) 80%, black)` instead.

## Examples

```scss
// bad
.btn:hover { background: darken($brand, 10%); border-color: fade-out($brand, 0.5); }
// good
@use 'sass:color';
.btn:hover { background: color.scale($brand, $lightness: -10%, $space: oklch); border-color: color.change($brand, $alpha: 0.5); }
```
