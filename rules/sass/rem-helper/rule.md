---
id: sass/rem-helper
title: Sizes are converted with the project's {{rem-function.name|px-to-rem function}}, never by dividing by a hard-coded base by hand.
severity: minor
check: static
applies:
  - scss
  - vue
  - svelte
  - astro
stack:
  - sass
requires:
  - rem-function
skill: fe-sass
since: 0.1.0
sources:
  - title: Foundation for Sites 6 docs, Sass functions (rem-calc)
    url: https://get.foundation/sites/docs/sass-functions.html
  - title: Sass docs, @function
    url: https://sass-lang.com/documentation/at-rules/function/
  - title: Sass docs, sass:math (math.div)
    url: https://sass-lang.com/documentation/modules/math/
---

## Why

A project that has a conversion function (Foundation's `rem-calc()`, or its own `rem()` or `to-rem()`) has one place that knows the root font size. A hand-written `math.div(24px, 16px) * 1rem`, `#{24 / 16}rem` or `calc(24rem / 16)` copies that base into the stylesheet: when the base changes, or a reviewer looks for every size, the copies are missed and spacing drifts.

## Fix

Call the project's helper with the design value in pixels: `{{rem-function.call|rem-calc(16px)}}` (the helper is `{{rem-function.name|rem-calc}}`, defined in `{{rem-function.file|the project's Sass functions}}`). The rule runs only when the profile records the helper (`profile.helpers["rem-function"]`) and no build step converts px for you; raw `px` sizes are reported by `css/rem-helper`, this rule reports conversions written by hand.

## Examples

```scss
// bad
.card { padding: math.div(24px, 16px) * 1rem; font-size: #{18 / 16}rem; }
// good
@use 'functions' as *;
.card { padding: rem-calc(24px); font-size: rem-calc(18px); }
```
