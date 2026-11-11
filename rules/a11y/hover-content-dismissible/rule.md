---
id: a11y/hover-content-dismissible
title: Tooltips and popups shown on hover or focus close with Escape, stay while the pointer moves onto them, and do not vanish on a timer.
severity: moderate
check: manual
applies:
  - page
wcag:
  - 1.4.13
level: AA
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.13 Content on Hover or Focus
    url: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
  - title: WAI-ARIA Authoring Practices, Tooltip pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
---

## Why

A tooltip that covers what a magnifier user is reading, cannot be closed, or disappears when the pointer moves onto it to read it, blocks people who zoom or move the pointer slowly.

## Fix

Show it on hover and on keyboard focus, close it on Escape without moving focus, keep it open while the pointer is over the trigger or the tooltip (no gap between them), and never hide it on a timeout. Interactive content belongs in a popover or disclosure, not a tooltip.

## Examples

```js
// good: Escape closes the tooltip without moving focus
trigger.addEventListener('keydown', (e) => { if (e.key === 'Escape') tooltip.hidden = true })
```
