---
id: tailwind/hover-only-reveal
title: "Content or controls revealed with hover: are also revealed on focus (focus-within:, group-focus-within:), never on hover alone."
severity: moderate
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 2.1.1
level: A
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, Upgrade guide (hover styles apply only on devices that support hover)
    url: https://tailwindcss.com/docs/upgrade-guide
  - title: Tailwind CSS docs, Hover, focus and other states (group and focus-within)
    url: https://tailwindcss.com/docs/hover-focus-and-other-states
  - title: WCAG 2.2, Understanding SC 2.1.1 Keyboard
    url: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
---

## Why

`opacity-0 group-hover:opacity-100` on a card's "Edit" and "Delete" buttons shows them only to a mouse. A keyboard user tabs onto controls they cannot see, and since Tailwind 4 wraps `hover:` in `@media (hover: hover)`, a phone user never sees them at all.

## Fix

Add the focus variant beside every hover reveal: `group-hover:opacity-100 group-focus-within:opacity-100` (or `focus-visible:` on the control itself). Better still, keep important actions visible and use hover only to emphasise them.

## Examples

```html
<!-- bad -->
<div class="opacity-0 group-hover:opacity-100"><button type="button">Edit</button></div>
<!-- good -->
<div class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"><button type="button">Edit</button></div>
```
