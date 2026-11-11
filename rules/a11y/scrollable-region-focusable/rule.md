---
id: a11y/scrollable-region-focusable
title: A scrolling region with no focusable content inside can itself take focus (tabindex="0") and has a name.
severity: serious
check: browser
applies:
  - page
wcag:
  - 2.1.1
level: A
axe:
  - scrollable-region-focusable
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.1.1 Keyboard
    url: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
  - title: MDN, the tabindex global attribute
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
---

## Why

A code block, a wide table or a chat log with `overflow: auto` scrolls only with a mouse or touch when nothing inside it can take focus. Keyboard users cannot read the hidden part.

## Fix

Give the scroll container `tabindex="0"`, a role that fits (`region`), and a name (`aria-label` or `aria-labelledby`), so it is announced when it takes focus.

## Examples

```html
<!-- bad -->
<div class="table-scroll"><table>…</table></div>
<!-- good -->
<div class="table-scroll" tabindex="0" role="region" aria-labelledby="sales-caption">
  <table><caption id="sales-caption">Sales by month</caption>…</table>
</div>
```
