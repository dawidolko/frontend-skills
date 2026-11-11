---
id: a11y/img-alt
title: Every img and area element has an alt attribute; a decorative image has alt="".
severity: critical
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 1.1.1
level: A
axe:
  - image-alt
  - area-alt
skill: fe-html
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.1.1 Non-text Content
    url: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
  - title: MDN, the img element (alt)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img
  - title: WAI Images Tutorial, decorative images
    url: https://www.w3.org/WAI/tutorials/images/decorative/
---

## Why

Without `alt`, a screen reader announces the file name or nothing, and the image's meaning is lost; when the image fails to load, nothing replaces it.

## Fix

Describe what the image says in this context (`alt="Revenue grew 20% in 2026"`), not what it looks like. For an image that only decorates, write `alt=""` so assistive technology skips it. An image inside a link that has no other text needs the link's purpose as its alt.

## Examples

```html
<!-- bad -->
<img src="chart.png">
<!-- good -->
<img src="chart.png" alt="Revenue grew 20% in 2026">
<img src="divider.svg" alt="">
```
