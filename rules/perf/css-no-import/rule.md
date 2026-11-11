---
id: perf/css-no-import
title: Shipped CSS does not chain stylesheets with @import; link them in the HTML or combine them in a build.
severity: moderate
check: static
applies:
  - css
  - html
stack:
  - html
skill: fe-perf-delivery
since: 0.1.0
sources:
  - title: Chrome for Developers, Network dependency tree insight
    url: https://developer.chrome.com/docs/performance/insights/network-dependency-tree
  - title: MDN, @import
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@import
  - title: Chrome for Developers, Render blocking requests insight
    url: https://developer.chrome.com/docs/performance/insights/render-blocking
---

## Why

The browser finds an `@import` only after it has downloaded and parsed the stylesheet that contains it, so each import adds a round trip before the page can render. On a mobile connection that is easily several hundred milliseconds of blank screen.

## Fix

List each stylesheet with `<link rel="stylesheet">` in `<head>` so they download in parallel, or let a build tool inline the imports into one file. Cascade layers work with links too: `@layer reset, components;` in the first file, then `@layer components { … }` in the others.

## Examples

```css
/* bad: main.css */
@import url("reset.css");
```

```html
<!-- good -->
<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/main.css">
```
