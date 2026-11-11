---
id: a11y/no-color-only
title: Colour is never the only cue; errors, states, links in text and chart series also differ by text, icon, shape or underline.
severity: serious
check: browser
applies:
  - page
wcag:
  - 1.4.1
level: A
axe:
  - link-in-text-block
lighthouse:
  - link-in-text-block
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.1 Use of Color
    url: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
---

## Why

About one in twelve men cannot tell some colours apart, and screen readers do not announce colour at all. A field marked only with a red border, or a link that differs from the paragraph only by colour, is invisible to them.

## Fix

Add a second cue: an error message and an icon next to the red border, an underline on links inside text, a pattern or a label on chart series, a check mark on the selected option. axe checks links inside text blocks; a person checks the rest.

## Examples

```css
/* bad */
.prose a { color: #1d4ed8; text-decoration: none; }
/* good */
.prose a { color: #1d4ed8; text-decoration: underline; text-underline-offset: 0.15em; }
```
