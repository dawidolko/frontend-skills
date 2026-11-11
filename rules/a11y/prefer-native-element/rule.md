---
id: a11y/prefer-native-element
title: Use the native element instead of a role it already provides (button, a href, input, h1–h6, nav, main, ul, li).
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 4.1.2
level: A
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: W3C, ARIA in HTML (document conformance requirements for use of ARIA attributes)
    url: https://www.w3.org/TR/html-aria/
  - title: WAI-ARIA Authoring Practices, Read Me First (no ARIA is better than bad ARIA)
    url: https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/
---

## Why

A role changes only what is announced. A `div role="button"` still needs `tabindex`, Enter and Space handling, a disabled state and form behaviour written by hand, and each missing piece is a bug for keyboard and screen reader users.

## Fix

Swap the element: `<button type="button">`, `<a href>`, `<input type="checkbox">`, `<h2>`, `<nav>`, `<ul>`/`<li>`. Restyle it with CSS (`all: unset` or a reset) if the look is the reason for the `div`. Keep a role only where no native element exists (`tablist`, `switch` on a checkbox, `img` on an `svg`).

## Examples

```html
<!-- bad -->
<div role="button" tabindex="0" onclick="save()">Save</div>
<!-- good -->
<button type="button" onclick="save()">Save</button>
```
