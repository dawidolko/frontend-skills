---
id: a11y/target-size
title: Pointer targets are at least 24 by 24 CSS pixels, or spaced so a 24px circle on each does not touch another target.
severity: serious
check: browser
applies:
  - page
wcag:
  - 2.5.8
level: AA
axe:
  - target-size
lighthouse:
  - target-size
skill: fe-a11y-visual
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.5.8 Target Size (Minimum)
    url: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
  - title: WCAG 2.2 Technique C42, using min-height and min-width to ensure sufficient target spacing
    url: https://www.w3.org/WAI/WCAG22/Techniques/css/C42
---

## Why

Small, crowded targets (a close "×", pagination numbers, icon toolbars) are missed by people with tremors, limited dexterity or large fingers, and by anyone on a moving bus. New in WCAG 2.2; axe-core does not run its `target-size` rule by default, so it must be turned on.

## Fix

Give icon buttons and small links `min-width: 24px; min-height: 24px` (44px is a comfortable size on touch screens), using padding so the icon stays small. Where a target must be smaller, keep 24px of spacing around its centre. Links inside sentences and controls drawn by the browser are exempt.

## Examples

```css
/* bad: a 16px icon with no padding */
.close { width: 16px; height: 16px; padding: 0; }
/* good */
.close { min-width: 24px; min-height: 24px; padding: 4px; }
```
