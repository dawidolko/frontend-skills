---
id: responsive/no-hover-only
title: Nothing is revealed on hover alone; content and controls shown on hover also show on keyboard focus and are reachable on touch.
severity: serious
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
  - jsx
  - angular
wcag:
  - 2.1.1
level: A
skill: fe-responsive
since: 0.1.0
sources:
  - title: web.dev, Learn Responsive Design, Interaction
    url: https://web.dev/learn/design/interaction
  - title: WCAG 2.2, Understanding SC 2.1.1 Keyboard
    url: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
  - title: WCAG 2.2, Understanding SC 1.4.13 Content on Hover or Focus
    url: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
  - title: MDN, :focus-within
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within
---

## Why

Touch screens have no hover, and keyboard users never hover. Edit buttons, submenus or details that appear only under the mouse are missing for them, or appear only by accident on a tap.

## Fix

Reveal the same content on `:focus-within` of the container (or `:focus-visible` of the trigger), and on touch show it by default or behind a button. With Tailwind, pair `group-hover:` with `group-focus-within:`. A menu that opens on hover also needs a button that opens it, and content that appears must stay until dismissed (Escape).

## Examples

```css
/* bad */
.card:hover .card__actions { display: flex; }
/* good */
.card:hover .card__actions,
.card:focus-within .card__actions { display: flex; }
```
