---
id: css/reduced-motion
title: Non-essential motion (entrance animations, parallax, smooth scrolling) respects prefers-reduced-motion.
severity: moderate
check: static
applies:
  - project
skill: fe-motion
since: 0.1.0
sources:
  - title: MDN, prefers-reduced-motion
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - title: WCAG 2.2, Technique C39 (using the reduced motion media query)
    url: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
  - title: WCAG 2.2, Understanding SC 2.3.3 Animation from Interactions
    url: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
  - title: web.dev, prefers-reduced-motion
    url: https://web.dev/articles/prefers-reduced-motion
---

## Why

Large movement on screen (sliding, zooming, parallax, smooth scrolling) can cause dizziness, nausea and headaches for people with vestibular disorders, and distracts people with attention difficulties. They set "reduce motion" in their system; a page that ignores the setting moves anyway.

## Fix

Put non-essential motion inside `@media (prefers-reduced-motion: no-preference)`, or replace it under `(prefers-reduced-motion: reduce)` with a short fade or nothing. With Tailwind use `motion-safe:` and `motion-reduce:`; with an animation library use its reduced-motion option (for example Motion's `MotionConfig reducedMotion="user"`). Prefer toning motion down to a blanket `animation: none !important`, which can leave scripts waiting for `animationend`.

## Examples

```css
/* bad */
.hero__title { animation: slide-in 0.8s both; }
/* good */
@media (prefers-reduced-motion: no-preference) {
  .hero__title { animation: slide-in 0.8s both; }
}
```
