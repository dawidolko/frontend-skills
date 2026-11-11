---
id: a11y/accordion-header
title: Each accordion header is a button with aria-expanded inside a heading of the right level; or use details and summary.
severity: moderate
check: manual
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
wcag:
  - 1.3.1
  - 4.1.2
level: A
skill: fe-a11y-tabs-accordion
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Accordion pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
  - title: MDN, the details element (name attribute for exclusive groups)
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
---

## Why

Clickable `div` headers cannot be reached with the keyboard, and without a heading around them screen reader users cannot jump between sections; without `aria-expanded` they cannot tell which section is open.

## Fix

Simplest: `<details name="faq"><summary>Question</summary>…</details>` (a shared `name` keeps one open at a time). Custom: `<h3><button type="button" aria-expanded="false" aria-controls="panel-1">Question</button></h3>` and a panel with `id="panel-1"` that is `hidden` when closed. Add `role="region"` with `aria-labelledby` to panels only when there are few of them.

## Examples

```html
<!-- bad -->
<div class="accordion-header" onclick="toggle(1)">Shipping</div>
<!-- good -->
<h3><button type="button" aria-expanded="false" aria-controls="ship">Shipping</button></h3>
<div id="ship" hidden>…</div>
```
