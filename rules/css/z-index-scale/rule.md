---
id: css/z-index-scale
title: z-index values come from a named scale (custom properties or Sass variables), not ad hoc numbers such as 999 or 9999.
severity: minor
check: static
applies:
  - project
skill: fe-css-architecture
since: 0.1.0
sources:
  - title: MDN, z-index
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/z-index
  - title: MDN, Stacking context
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context
  - title: MDN, Using CSS custom properties (variables)
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
---

## Why

Ad hoc numbers escalate: a dropdown gets 100, a modal 999, a toast 9999, and the next fix needs 99999. Nobody can tell which layer should win, and a higher number does not even help when the element sits in a different stacking context.

## Fix

Define the layers once, in order, and use the names: `--z-dropdown: 1000; --z-modal: 1100; --z-toast: 1200;` (or a Sass map). Inside a component keep small local values (below 10) and create a stacking context with `isolation: isolate` instead of raising the number. When the project already has a scale, the fix names it.

## Examples

```css
/* bad */
.modal { z-index: 9999; }
/* good */
:root { --z-dropdown: 1000; --z-modal: 1100; --z-toast: 1200; }
.modal { z-index: var(--z-modal); }
```
