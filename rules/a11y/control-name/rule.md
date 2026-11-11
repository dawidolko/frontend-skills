---
id: a11y/control-name
title: Every button and link has an accessible name; icon-only controls get visually hidden text or aria-label.
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
  - 4.1.2
  - 2.4.4
level: A
axe:
  - button-name
  - link-name
  - input-button-name
lighthouse:
  - button-name
  - link-name
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 4.1.2 Name, Role, Value
    url: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html
  - title: WCAG 2.2, Understanding SC 2.4.4 Link Purpose (In Context)
    url: https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html
  - title: W3C, Accessible Name and Description Computation 1.2
    url: https://www.w3.org/TR/accname-1.2/
---

## Why

A button with only an icon is announced as "button" and nothing else. Screen reader and voice control users cannot tell what it does or say its name to activate it.

## Fix

Prefer visible text. For an icon-only control, add text that is hidden visually but read (`<span class="sr-only">Close</span>`) or `aria-label="Close"`, and mark the icon `aria-hidden="true"`. A linked image names the link through its `alt`. Use the same word people see in tooltips and elsewhere on the site.

## Examples

```html
<!-- bad -->
<button type="button"><svg aria-hidden="true">…</svg></button>
<!-- good -->
<button type="button" aria-label="Close"><svg aria-hidden="true">…</svg></button>
<button type="button"><svg aria-hidden="true">…</svg><span class="sr-only">Close</span></button>
```
