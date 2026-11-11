---
id: responsive/viewport-meta
title: Every HTML document has <meta name="viewport" content="width=device-width, initial-scale=1">.
severity: serious
check: static
applies:
  - html
  - astro
lighthouse:
  - viewport-insight
skill: fe-responsive
since: 0.1.0
sources:
  - title: MDN, the viewport meta tag
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
  - title: W3Schools, Responsive web design viewport
    url: https://www.w3schools.com/css/css_rwd_viewport.asp
---

## Why

Without it, mobile browsers lay the page out at a desktop width (usually 980 px) and shrink it, so text is tiny and media queries never match.

## Fix

Put `<meta name="viewport" content="width=device-width, initial-scale=1">` in the head of every document. Next.js and Nuxt add it for you; plain HTML, Astro layouts and SvelteKit's `app.html` need it written.

## Examples

```html
<!-- bad -->
<head><title>Shop</title></head>
<!-- good -->
<head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shop</title></head>
```
