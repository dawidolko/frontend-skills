---
id: a11y/no-flash
title: Nothing flashes more than three times in any one second, unless the flash is small and below the general and red thresholds.
severity: critical
check: manual
applies:
  - page
wcag:
  - 2.3.1
level: A
skill: fe-a11y-media
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.3.1 Three Flashes or Below Threshold
    url: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
---

## Why

Flashing between light and dark more than three times a second can trigger seizures in people with photosensitive epilepsy. It is one of the few accessibility failures that can cause physical harm.

## Fix

Keep alternating light and dark animations slower than three cycles per second, and avoid saturated red flashes. Check videos and game effects with a flash analysis tool before release, and wrap any strong effect in `@media (prefers-reduced-motion: no-preference)`.

## Examples

```css
/* bad: a full-screen alert blinking eight times a second */
.alarm { animation: blink 125ms steps(2) infinite; }
/* good: a slow pulse, off when people ask for less motion */
@media (prefers-reduced-motion: no-preference) { .alarm { animation: pulse 2s ease-in-out 3; } }
```
