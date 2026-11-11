---
id: css/animate-composited
title: Animations and transitions change transform and opacity, not layout properties such as width, height, top, left or margin.
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
skill: fe-motion
since: 0.1.0
sources:
  - title: web.dev, How to create high-performance CSS animations
    url: https://web.dev/articles/animations-guide
  - title: web.dev, Optimize Cumulative Layout Shift (animations)
    url: https://web.dev/articles/optimize-cls
  - title: MDN, CSS performance optimization (animating on the GPU)
    url: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS
---

## Why

Changing `width`, `height`, `top`, `left`, `margin` or `padding` makes the browser recalculate layout and repaint on every frame, often for the whole page around the element. On a mid-range phone that drops frames, delays input and can count as layout shift. `transform` and `opacity` can be animated by the compositor without layout.

## Fix

Move with `translate`/`transform: translate()`, resize visually with `scale` (with `transform-origin`), fade with `opacity`. For an expanding panel, animate `grid-template-rows` from `0fr` to `1fr` or use a clip, and keep the motion short. Only add `will-change` to fix a measured problem.

## Examples

```css
/* bad */
.drawer { left: -20rem; transition: left 0.3s; }
.drawer.is-open { left: 0; }
/* good */
.drawer { translate: -100% 0; transition: translate 0.3s; }
.drawer.is-open { translate: 0 0; }
```
