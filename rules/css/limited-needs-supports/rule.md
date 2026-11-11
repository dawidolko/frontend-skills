---
id: css/limited-needs-supports
title: CSS that is not Baseline yet (anchor positioning) or only just became Baseline (scroll-driven animations) sits in @supports with a fallback.
severity: moderate
check: static
applies:
  - css
  - scss
  - less
  - html
  - vue
  - svelte
  - astro
skill: fe-css-modern
since: 0.1.0
sources:
  - title: MDN, @supports
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
  - title: MDN, CSS anchor positioning
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
  - title: MDN, CSS scroll-driven animations
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
  - title: web-features explorer (Baseline status of anchor-positioning and scroll-driven-animations)
    url: https://web-platform-dx.github.io/web-features-explorer/
---

## Why

A browser drops declarations it does not understand. A menu placed only with `position-anchor` and `anchor()` ends up at the corner of the page in a browser without anchor positioning, and an animation bound only to a scroll timeline runs once on load where scroll timelines are missing. On 2026-11-11 anchor positioning was not Baseline and scroll-driven animations had been Baseline for two weeks, so many visitors still lack them.

## Fix

Write a working fallback first (a plain `position: absolute` placement, no animation), then the new feature inside `@supports (anchor-name: --a)` or `@supports (animation-timeline: scroll())`. Put motion inside `prefers-reduced-motion: no-preference` as well. Recheck the Baseline status before you remove the fallback.

## Examples

```css
/* bad */
.menu { position: absolute; position-anchor: --menu; top: anchor(bottom); }
/* good */
.menu { position: absolute; top: 100%; }
@supports (anchor-name: --a) { .menu { position-anchor: --menu; top: anchor(bottom); } }
```
