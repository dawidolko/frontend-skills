---
id: a11y/carousel-controls
title: A carousel has named previous and next buttons, a pause button first in its Tab order when it rotates, and stops on hover and focus.
severity: serious
check: manual
applies:
  - page
wcag:
  - 2.2.2
  - 4.1.2
level: A
skill: fe-a11y-carousel-toast
since: 0.1.0
sources:
  - title: WAI-ARIA Authoring Practices, Carousel pattern
    url: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
  - title: W3C WAI tutorials, Carousels
    url: https://www.w3.org/WAI/tutorials/carousels/
  - title: WCAG 2.2, Understanding SC 2.2.2 Pause, Stop, Hide
    url: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
---

## Why

A rotating carousel moves content away while someone is reading it or tabbing into it. Screen reader users hear slides change under them; keyboard users land on links that disappear; slow readers never finish a slide.

## Fix

Prefer no auto-rotation. If it rotates: a "Pause" / "Play" button that is the first control in the carousel, rotation that stops while the pointer is over it or focus is inside, and a slide wrapper with `aria-live="off"` while rotating (`polite` when stopped). Give the container `role="region"` (or `group`) with `aria-roledescription="carousel"` and a label, each slide `role="group"` with `aria-roledescription="slide"` and a label such as "2 of 5", and named previous and next buttons.

## Examples

```html
<section role="region" aria-roledescription="carousel" aria-label="Featured products">
  <button type="button" aria-label="Pause rotation">⏸</button>
  <button type="button" aria-label="Previous slide">‹</button>
  <button type="button" aria-label="Next slide">›</button>
  <div aria-live="off">
    <div role="group" aria-roledescription="slide" aria-label="1 of 4">…</div>
  </div>
</section>
```
