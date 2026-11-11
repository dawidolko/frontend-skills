---
id: a11y/option-no-interactive
title: Options in a listbox or combobox popup hold only text and images, never links, buttons or fields.
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
  - nested-interactive
skill: fe-a11y-combobox
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Listbox pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
  - title: W3C, WAI-ARIA 1.2, option role (children presentational)
    url: https://www.w3.org/TR/wai-aria-1.2/#option
---

## Why

An option's content is presentational: assistive technology reads it as one piece of text. A "Remove" button inside cannot be reached with the listbox keys and may be read as part of the option's name.

## Fix

Keep the option to text, icons and images. Put row actions outside the list (a toolbar that acts on the selected option), or switch to the grid pattern when each row needs its own controls.

## Examples

```html
<!-- bad -->
<li role="option">Anna <button>Remove</button></li>
<!-- good -->
<li role="option" aria-selected="true">Anna</li>
<button type="button">Remove selected recipient</button>
```
