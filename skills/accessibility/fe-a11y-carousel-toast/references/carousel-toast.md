# Carousels and toasts reference

Depth for the `fe-a11y-carousel-toast` skill. Rule ids in brackets: `frontend-skills explain <id>`. Read on 2026-11-11: the APG has a Carousel pattern and an Alert pattern; it has no toast pattern, so toast rules here come from the Alert pattern and WCAG 2.2.1 and 4.1.3.

## Carousel markup [a11y/carousel-controls]

```html
<section class="carousel" role="region" aria-roledescription="carousel" aria-label="Featured products">
  <div class="controls">
    <button type="button" class="rotation" aria-label="Stop automatic slide show">⏸</button>
    <button type="button" class="prev" aria-label="Previous slide">‹</button>
    <button type="button" class="next" aria-label="Next slide">›</button>
  </div>
  <div class="slides" aria-live="off">
    <div role="group" aria-roledescription="slide" aria-label="1 of 3">…</div>
    <div role="group" aria-roledescription="slide" aria-label="2 of 3" hidden>…</div>
    <div role="group" aria-roledescription="slide" aria-label="3 of 3" hidden>…</div>
  </div>
</section>
```

- Do not repeat "carousel" or "slide" in the labels: `aria-roledescription` already says it.
- The rotation button's label tells what it will do ("Stop automatic slide show" / "Start automatic slide show").
- Hidden slides are `hidden` (or `inert`) so their links are not focusable.

## Pause logic

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
let playing = !reduce
let paused = false // hover or focus inside
const live = carousel.querySelector('.slides')
setInterval(() => { if (playing && !paused) show(current + 1) }, 6000)
carousel.addEventListener('mouseenter', () => (paused = true))
carousel.addEventListener('mouseleave', () => (paused = false))
carousel.addEventListener('focusin', () => (paused = true))
carousel.addEventListener('focusout', (e) => { if (!carousel.contains(e.relatedTarget)) paused = false })
rotation.addEventListener('click', () => {
  playing = !playing
  live.setAttribute('aria-live', playing ? 'off' : 'polite')
  rotation.setAttribute('aria-label', playing ? 'Stop automatic slide show' : 'Start automatic slide show')
})
```

## Swipeable rows without rotation

```css
.row { display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; }
.row > * { scroll-snap-align: start; flex: 0 0 min(80%, 20rem); }
```

Add previous and next buttons that call `row.scrollBy({ left: ±row.clientWidth, behavior: 'smooth' })`, and give the scroll container `tabindex="0"`, `role="region"` and a label so keyboard users can scroll it ([a11y/scrollable-region-focusable]).

## Toast region and queue [a11y/toast-timing]

```html
<!-- in the root layout, rendered once -->
<div class="toasts" role="status" aria-live="polite"></div>
<div class="toasts-urgent" role="alert"></div>
```

| Toast | Timing | Region |
| --- | --- | --- |
| "Saved", "Copied" | Several seconds; pause on hover and focus; close button | `status` |
| With an action ("Undo", "Retry") | Until closed or used | `status` |
| Error the user must fix | Until closed; also show the error where it happened | `alert` |
| Long text | Do not use a toast; use an inline message or a page | – |

- One toast at a time per region; queue the rest.
- Do not move focus to the toast. Offer the action elsewhere too, or a keyboard shortcut announced in the toast text.
- Library defaults vary: check that the toast library renders into a region that exists before the first toast and lets you turn off auto-dismiss per toast.

## Sources

- APG, Carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- APG, Alert pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- W3C WAI tutorials, Carousels: https://www.w3.org/WAI/tutorials/carousels/
- WCAG 2.2 Understanding 2.2.1, 2.2.2, 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/
- MDN, CSS scroll snap: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap
