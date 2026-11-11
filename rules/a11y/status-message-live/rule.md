---
id: a11y/status-message-live
title: Messages that appear without moving focus (saved, results, errors, progress) are announced through a live region.
severity: serious
check: manual
applies:
  - page
wcag:
  - 4.1.3
level: AA
skill: fe-a11y-aria
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 4.1.3 Status Messages
    url: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
  - title: MDN, ARIA live regions
    url: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
---

## Why

"Added to cart", "12 results" or "Upload failed" shown on screen is silent for a screen reader user unless it is in a live region. They act again, or never learn it failed.

## Fix

Render an empty live region with the page (`<div role="status">`, polite) and put the text into it when the event happens; use `role="alert"` only for urgent errors. Do not mount the region and its text at the same moment: many screen readers announce only changes to a region that already existed.

## Examples

```html
<!-- good: present from the start, filled later -->
<p role="status" id="cart-status"></p>
<script type="module">
  document.querySelector('#cart-status').textContent = 'Added to cart'
</script>
```
