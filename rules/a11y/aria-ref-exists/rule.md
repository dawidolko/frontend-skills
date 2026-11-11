---
id: a11y/aria-ref-exists
title: Ids named in aria-labelledby, aria-describedby and aria-errormessage exist in the page and are unique.
severity: serious
check: static
applies:
  - html
wcag:
  - 1.3.1
  - 4.1.2
level: A
axe:
  - aria-valid-attr-value
  - duplicate-id-aria
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.3.1 Info and Relationships
    url: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
  - title: W3C, Accessible Name and Description Computation 1.2
    url: https://www.w3.org/TR/accname-1.2/
---

## Why

A reference to a missing id is dropped without a warning, so the hint, the error or the label is never read. When two elements share the id, the first one wins and the user may hear the wrong text.

## Fix

Correct the id or the reference, and make ids unique per page. In components, generate ids (`useId()` in React and Vue 3.5, `$props.id()` in Svelte 5) and pass them down instead of hard-coding them.

## Examples

```html
<!-- bad -->
<input id="email" aria-describedby="email-hint"><p id="emailhint">…</p>
<!-- good -->
<input id="email" aria-describedby="email-hint"><p id="email-hint">…</p>
```
