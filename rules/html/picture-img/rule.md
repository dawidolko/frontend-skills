---
id: html/picture-img
title: Every picture element ends with an img that has src, alt, width and height; source elements alone render nothing.
severity: serious
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
skill: fe-images
since: 0.1.0
sources:
  - title: HTML Standard, the picture element
    url: https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element
  - title: MDN, the picture element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
---

## Why

`<picture>` only chooses a file; the `<img>` inside it is the element that is displayed, has the accessible name and reserves the space. A picture with sources and no img shows nothing in any browser, and screen readers announce nothing.

## Fix

Put an `<img>` last inside the picture with the fallback `src`, the `alt`, `width` and `height`; `<source type="image/avif">` and `<source media="…">` before it offer the alternatives.

## Examples

```html
<!-- bad -->
<picture><source type="image/avif" srcset="hero.avif"></picture>
<!-- good -->
<picture>
  <source type="image/avif" srcset="hero.avif">
  <img src="hero.jpg" alt="Autumn collection" width="1600" height="900">
</picture>
```
