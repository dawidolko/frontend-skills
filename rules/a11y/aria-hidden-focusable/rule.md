---
id: a11y/aria-hidden-focusable
title: aria-hidden="true" is never on a focusable element or on an element that contains one.
severity: serious
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
axe:
  - aria-hidden-focus
lighthouse:
  - aria-hidden-focus
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
  - title: W3C, ARIA in HTML (aria-hidden)
    url: https://www.w3.org/TR/html-aria/
  - title: MDN, the inert global attribute
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
---

## Why

`aria-hidden` removes an element from what a screen reader announces but not from the Tab order. Keyboard focus then lands on something that has no name and no role: the user hears silence or "blank".

## Fix

Hide content from everyone with `hidden` or `inert` (inert also removes it from focus and from pointer use), or take the controls out of the hidden part. Use `aria-hidden="true"` only on decoration such as icons and duplicated visuals with nothing focusable inside.

## Examples

```html
<!-- bad: an off-screen drawer hidden only from screen readers -->
<nav aria-hidden="true"><a href="/">Home</a></nav>
<!-- good -->
<nav inert><a href="/">Home</a></nav>
<svg aria-hidden="true" focusable="false">…</svg>
```
