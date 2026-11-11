---
id: css/pause-auto-motion
title: Anything that moves, blinks or scrolls on its own for more than five seconds (carousels, marquees, background video) can be paused.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.2.2
level: A
skill: fe-motion
since: 0.1.0
sources:
  - title: WCAG 2.2, Understanding SC 2.2.2 Pause, Stop, Hide
    url: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
  - title: WAI-ARIA Authoring Practices, Carousel pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
---

## Why

Content that keeps moving next to other content pulls attention away from the task, makes text impossible to read for people who read slowly, and can be unbearable for people with attention or vestibular conditions. A rotating carousel also moves the content away while someone is reading or tabbing into it.

## Fix

Give auto-playing carousels, tickers, animated backgrounds and looping videos a visible pause (or stop) button, stop rotation while the carousel has focus or the pointer is over it, and do not start it under `prefers-reduced-motion: reduce`. Loading spinners that show progress are not covered; decorative infinite animations are.

## Examples

```html
<section aria-roledescription="carousel" aria-label="Offers">
  <button type="button" aria-pressed="false">Pause rotation</button>
  <!-- slides -->
</section>
```
