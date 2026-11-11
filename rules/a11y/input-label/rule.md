---
id: a11y/input-label
title: Every form field has a programmatic label (label element, aria-label or aria-labelledby); a placeholder is not a label.
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
  - 1.3.1
  - 3.3.2
  - 4.1.2
level: A
axe:
  - label
  - select-name
skill: fe-a11y-forms
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 3.3.2 Labels or Instructions
    url: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
  - title: WCAG 2.2, Understanding SC 1.3.1 Info and Relationships
    url: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
  - title: WAI Forms Tutorial, labeling controls
    url: https://www.w3.org/WAI/tutorials/forms/labels/
  - title: MDN, the label element
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label
---

## Why

A field without a programmatic label is announced only as "edit text": the user does not know what to type. A placeholder disappears on input, often has low contrast and is not reliably used as the accessible name.

## Fix

Pair a visible `<label for="email">` with `<input id="email">`, or wrap the field in the label. When the design has no visible label (a search field next to its button), use `aria-label` or `aria-labelledby`; keep a visible label wherever you can.

## Examples

```html
<!-- bad -->
<input type="email" placeholder="Email">
<!-- good -->
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email">
```
