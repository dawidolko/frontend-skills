---
id: a11y/pause-auto-motion
title: Anything that moves, blinks, scrolls or updates by itself for more than 5 seconds has a visible pause or stop control.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.2.2
level: A
axe:
  - marquee
  - blink
skill: fe-a11y-media
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.2.2 Pause, Stop, Hide
    url: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
  - title: MDN, prefers-reduced-motion
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
---

## Why

Looping background video, auto-advancing carousels, tickers and animated illustrations pull attention away from the text. People with attention or reading difficulties cannot focus, and screen magnifier users lose content that moves out of view.

## Fix

Give every looping or auto-advancing element a visible pause button that keeps its state, pause carousels on hover and focus (`fe-a11y-carousel-toast`), and start nothing by default when `prefers-reduced-motion: reduce` matches. Animated GIFs longer than 5 seconds become `<video>` with controls.

## Examples

```html
<!-- good -->
<video id="hero-video" autoplay muted loop playsinline src="hero.mp4"></video>
<button type="button" aria-pressed="false" id="pause-hero">Pause background video</button>
```
