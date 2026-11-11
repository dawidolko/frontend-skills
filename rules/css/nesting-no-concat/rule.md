---
id: css/nesting-no-concat
title: In native CSS nesting, never build class names from "&" plus a suffix (&__title); write the full selector.
severity: serious
check: static
applies:
  - css
skill: fe-css-modern
since: 0.1.0
sources:
  - title: MDN, Using CSS nesting
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting
  - title: MDN, Nesting selector (&)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector
---

## Why

Sass taught a habit: `&__title` inside `.card` becomes `.card__title`. Native CSS nesting does not join text; `&` stands for the parent selector as a whole, so `&__title` is not a valid selector and the browser drops the whole rule. The styles silently disappear when a stylesheet moves from `.scss` to `.css`.

## Fix

Write the full class name as its own rule or nested with a space (`& .card__title` for a descendant), and use `&.modifier` for a compound selector. Keep suffix joining in `.scss` files only, or in a build that runs `postcss-nested`.

## Examples

```css
/* bad */
.card { &__title { font-size: 1.25rem; } }
/* good */
.card__title { font-size: 1.25rem; }
.card { &.card--featured { border-color: gold; } }
```
