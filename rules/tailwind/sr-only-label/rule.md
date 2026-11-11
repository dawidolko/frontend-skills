---
id: tailwind/sr-only-label
title: The only text of a button or link is never hidden with hidden; use sr-only (with md:not-sr-only to show it on wider screens).
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
  - button-name
  - link-name
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, display (sr-only and not-sr-only)
    url: https://tailwindcss.com/docs/display
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
---

## Why

`hidden` is `display: none`, which removes the text from the accessibility tree as well as from the screen. In `<button><svg/><span class="hidden md:inline">Menu</span></button>` the button has no name at all on phones: a screen reader announces only "button", and voice control users cannot say its name.

## Fix

Use `sr-only` for text that should be read but not seen, and `md:not-sr-only` where it should also be seen on wider screens: `<span class="sr-only md:not-sr-only">Menu</span>`. Alternatively give the control `aria-label`. Mark the icon itself `aria-hidden="true"`.

## Examples

```html
<!-- bad -->
<button type="button"><svg aria-hidden="true">…</svg><span class="hidden md:inline">Menu</span></button>
<!-- good -->
<button type="button"><svg aria-hidden="true">…</svg><span class="sr-only md:not-sr-only">Menu</span></button>
```
