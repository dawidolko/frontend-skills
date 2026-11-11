---
id: a11y/color-contrast
title: Text has a contrast ratio of at least 4.5:1 with its background; large text (24px, or 18.5px bold) at least 3:1.
severity: serious
check: browser
applies:
  - page
wcag:
  - 1.4.3
level: AA
axe:
  - color-contrast
lighthouse:
  - color-contrast
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 1.4.3 Contrast (Minimum)
    url: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
  - title: WCAG 2.2, definition of contrast ratio
    url: https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
---

## Why

Low-contrast text is hard or impossible to read for people with low vision, colour vision deficiency, ageing eyes, or anyone on a phone in sunlight. Grey placeholder-style text and brand colours on white are the usual failures.

## Fix

Pick text and background tokens as tested pairs: 4.5:1 for body text, 3:1 for text of at least 24 CSS px or 18.5 CSS px bold. The thresholds are hard: 4.49:1 fails. Check every state (hover, disabled is exempt, placeholder is not) and both colour schemes. Text over images needs a solid or gradient scrim behind it.

## Examples

```css
/* bad: #9ca3af on white is about 2.5:1 */
.muted { color: #9ca3af; }
/* good: #4b5563 on white is about 7.6:1 */
.muted { color: #4b5563; }
```
