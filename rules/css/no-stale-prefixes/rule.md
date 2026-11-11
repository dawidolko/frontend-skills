---
id: css/no-stale-prefixes
title: No hand-written vendor prefixes for features browsers support unprefixed (border-radius, transitions, transforms, flexbox, gradients).
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
  - title: MDN, Vendor prefix
    url: https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix
  - title: Autoprefixer (PostCSS), README
    url: https://github.com/postcss/autoprefixer
---

## Why

Prefixes such as `-webkit-border-radius` or `-ms-flexbox` were for browsers that are long gone. Written by hand they add bytes, go out of date, often carry an old syntax (`-webkit-linear-gradient(top, …)` has a different direction keyword) and hide the one prefix that is still needed.

## Fix

Write the standard property and value. If the project still supports a browser that needs a prefix, let Autoprefixer add it at build time from the project's browserslist. Keep the few prefixes that are still required, such as `-webkit-line-clamp` with `display: -webkit-box` and `-webkit-box-orient`.

## Examples

```css
/* bad */
.card { -webkit-border-radius: 8px; border-radius: 8px; -webkit-transition: transform .2s; }
/* good */
.card { border-radius: 8px; transition: transform 0.2s; }
```
