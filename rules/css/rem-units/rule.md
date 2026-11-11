---
id: css/rem-units
title: Font sizes are in rem, and in a project with a px-to-rem helper (such as rem-calc) spacing and breakpoints go through it, not raw px.
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
  - title: MDN, CSS values and units (relative length units)
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units
  - title: Foundation for Sites, Sass functions (rem-calc)
    url: https://get.foundation/sites/docs/sass-functions.html#rem-calc
  - title: WCAG 2.2, Understanding SC 1.4.4 Resize Text
    url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
  - title: web.dev, Learn Responsive Design, Media queries
    url: https://web.dev/learn/design/media-queries
---

## Why

A `px` font size ignores the text size the person set in their browser, so text that is comfortable for the designer stays small for someone who needs it larger. In a project that converts sizes with a helper (Foundation's `rem-calc()`, its own `to-rem()` or a token), raw `px` beside the helper mixes two systems: those values do not follow the base size and the next change of the scale misses them.

## Fix

Write font sizes in `rem` (or `em` inside a component that should follow its parent). When the project has a helper, use it for font sizes, spacing and breakpoints: `padding: rem-calc(16)`, `@media (min-width: rem-calc(768))`. The profile names the helper under `conventions.remHelper`; borders and hairlines stay in `px`.

## Examples

```scss
// bad: the project uses rem-calc()
.card { margin-bottom: 24px; font-size: 18px; }
// good
.card { margin-bottom: rem-calc(24); font-size: rem-calc(18); }
```
