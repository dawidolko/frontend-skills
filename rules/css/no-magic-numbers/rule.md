---
id: css/no-magic-numbers
title: Offsets and spacing use the project's spacing scale or come from layout; hand-tuned one-off values such as top -7px are a finding.
severity: minor
check: static
applies:
  - project
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: MDN, Using CSS custom properties (variables)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
  - title: web.dev, Learn CSS, Spacing
    url: https://web.dev/learn/css/spacing
  - title: MDN, calc()
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/calc
---

## Why

A value like `top: -7px` or `padding: 3px 10px` was tuned by eye for one font, one breakpoint and one piece of content. It breaks when any of them changes, nobody knows why it is that number, and the rhythm of the page drifts away from the design's scale. The check runs only in projects that have a spacing scale, and names the nearest step.

## Fix

Use a step of the scale (`var(--space-3)`), or derive the value from what it depends on: `calc(-1 * var(--space-1))`, `gap` in a flex or grid parent instead of nudged margins, alignment (`align-items`, `place-self`) instead of offsets, `em` when it should follow the font. If a value truly is a one-off, say why in a comment with `fs-ignore css/no-magic-numbers`.

## Examples

```css
/* bad: the project defines --space-1 … --space-4 (4, 8, 12, 16 px) */
.badge { top: -7px; right: 13px; padding: 3px 10px; }
/* good */
.badge { top: calc(-1 * var(--space-1)); right: var(--space-3); padding: var(--space-1) var(--space-2); }
```
