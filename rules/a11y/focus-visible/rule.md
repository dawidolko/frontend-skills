---
id: a11y/focus-visible
title: Never remove the focus outline without drawing a visible replacement for keyboard focus.
severity: serious
check: static
applies:
  - css
  - scss
  - less
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 2.4.7
level: AA
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.4.7 Focus Visible
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
  - title: MDN, the :focus-visible pseudo-class
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
  - title: Tailwind CSS, outline-style (outline-hidden and outline-none)
    url: https://tailwindcss.com/docs/outline-style
---

## Why

Keyboard users see where they are only through the focus indicator. `outline: none` on `:focus` with nothing in its place leaves them lost on the page.

## Fix

Style `:focus-visible` instead of removing focus styles: `button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }`. If the design needs no ring for mouse clicks, `:focus:not(:focus-visible) { outline: none; }` is acceptable. With Tailwind, pair `outline-none` with a `focus-visible:ring-*` or `focus-visible:outline-*` class.

## Examples

```css
/* bad */
button:focus { outline: none; }
/* good */
button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```
