---
id: tailwind/motion-safe
title: "Decorative Tailwind animations (animate-bounce, animate-ping, animate-pulse) run under motion-safe: or stop under motion-reduce:."
severity: minor
check: static
applies:
  - html
  - angular
  - vue
  - svelte
  - astro
  - jsx
stack:
  - tailwind
skill: fe-tailwind
since: 0.1.0
sources:
  - title: Tailwind CSS docs, Hover, focus and other states (prefers-reduced-motion)
    url: https://tailwindcss.com/docs/hover-focus-and-other-states
  - title: MDN, prefers-reduced-motion
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - title: WCAG 2.2, Understanding SC 2.3.3 Animation from Interactions
    url: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
---

## Why

People with vestibular disorders turn on "reduce motion" because bouncing, pulsing and zooming elements can cause dizziness and nausea. A Tailwind `animate-*` class ignores that setting unless you ask for it.

## Fix

Prefix decorative animations with `motion-safe:` (`motion-safe:animate-bounce`), or stop them with `motion-reduce:animate-none`. A loading spinner (`animate-spin`) may keep running, since it tells the user something is happening; consider a slower or static indicator under `motion-reduce:`.

## Examples

```html
<!-- bad -->
<span class="animate-ping rounded-full bg-sky-400"></span>
<!-- good -->
<span class="motion-safe:animate-ping rounded-full bg-sky-400"></span>
```
