---
id: a11y/focus-not-obscured
title: Sticky headers, footers, cookie banners and chat widgets never fully cover the element that has keyboard focus.
severity: serious
check: manual
applies:
  - css
  - scss
  - less
  - page
wcag:
  - 2.4.11
level: AA
skill: fe-a11y-keyboard
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.4.11 Focus Not Obscured (Minimum)
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
  - title: WCAG 2.2 Technique C43, using CSS scroll-padding to un-obscure content
    url: https://www.w3.org/WAI/WCAG22/Techniques/css/C43
---

## Why

When the browser scrolls a focused link under a sticky header or a cookie bar, a keyboard user cannot see where they are. This is new in WCAG 2.2 and no automated engine checks it.

## Fix

Set `scroll-padding-top` (and `scroll-padding-bottom` for a sticky footer) on the scroll container (`html`) to the height of the sticky bars, ideally from the same custom property. Let banners be dismissed, and do not cover content with a non-modal overlay that stays open while the user tabs.

## Examples

```css
/* bad: a 64px sticky header and nothing else */
.site-header { position: sticky; top: 0; height: 4rem; }
/* good */
:root { --header-h: 4rem; }
html { scroll-padding-top: calc(var(--header-h) + 0.5rem); }
.site-header { position: sticky; top: 0; height: var(--header-h); }
```
