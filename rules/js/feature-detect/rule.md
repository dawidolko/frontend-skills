---
id: js/feature-detect
title: Test for the feature you need (in, CSS.supports, matchMedia), not the browser name in navigator.userAgent.
severity: minor
check: static
applies:
  - jsx
  - html
  - vue
  - svelte
  - astro
skill: fe-javascript
since: 0.1.0
sources:
  - title: MDN, Implementing feature detection
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing/Feature_detection
  - title: MDN, Navigator.userAgent
    url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
---

## Why

User-agent strings are long, spoofed, frozen in parts and change with every release. Code that branches on them breaks for the next browser version or for a browser it did not know, and keeps old workarounds alive long after the bug is fixed.

## Fix

Check the capability itself: `'share' in navigator`, `CSS.supports('container-type: inline-size')`, `matchMedia('(pointer: coarse)')`, or `@supports` in CSS. Read the user agent only for logging or analytics, and mark that line with `fs-ignore js/feature-detect`.

## Examples

```js
// bad
if (/iPhone|Android/.test(navigator.userAgent)) enableTouchMenu()
// good
if (matchMedia('(pointer: coarse)').matches) enableTouchMenu()
```
