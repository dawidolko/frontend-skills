---
id: perf/render-blocking-script
title: A script in the head loads with defer, async or type="module", never as a plain blocking script.
severity: moderate
check: static
applies:
  - html
lighthouse:
  - render-blocking-insight
skill: fe-html
since: 0.1.0
sources:
  - title: MDN, the script element (defer and async)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script
  - title: Chrome for Developers, Eliminate render-blocking resources
    url: https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources
---

## Why

A classic `<script src>` in the head stops HTML parsing until the file is downloaded and run, which delays the first paint and the Largest Contentful Paint.

## Fix

Add `defer` (runs in order after parsing; the usual choice) or `async` (runs as soon as it arrives; for independent scripts such as analytics), or load it as `type="module"`, which defers by default.

## Examples

```html
<!-- bad -->
<script src="/app.js"></script>
<!-- good -->
<script src="/app.js" defer></script>
```
