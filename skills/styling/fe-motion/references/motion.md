# Motion reference

Depth for the `fe-motion` skill. Rule ids in brackets: `frontend-skills explain <id>`. Baseline status from web-features 3.45.0, read 2026-11-11 (`docs/sources/css.md`).

## Tokens

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Small elements move fast, large ones a little slower; entering uses ease-out, leaving ease-in.

## What to animate

| Effect | Property | Not |
| --- | --- | --- |
| Move, slide | `translate` / `transform: translate()` | `top`, `left`, `margin` [css/animate-composited] |
| Grow, shrink | `scale` with `transform-origin` | `width`, `height` |
| Fade | `opacity` | `visibility` alone |
| Expand a panel | `grid-template-rows: 0fr` → `1fr` on a grid wrapper | `height: auto` (not animatable without `interpolate-size`, which is not Baseline) |
| Colour change | `color`, `background-color` (paint, but cheap on small elements) | `box-shadow` on large areas |

## Reduced motion

```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
  .card { transition: translate var(--duration-base) var(--ease-out); }
  .card:hover { translate: 0 -4px; }
}
@media (prefers-reduced-motion: reduce) {
  .toast { animation-name: fade-in; }   /* a fade instead of a slide */
}
```

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
if (!reduce.matches) startParallax()
reduce.addEventListener('change', (e) => (e.matches ? stopParallax() : startParallax()))
```

- Tailwind: `motion-safe:animate-…`, `motion-reduce:transition-none`.
- Motion for React: `<MotionConfig reducedMotion="user">` turns off transform and layout animations when the setting is on; `useReducedMotion()` for custom cases.
- Prefer a reduced variant to a global `* { animation: none !important }`, which can leave code waiting for `animationend` [css/reduced-motion].
- WCAG 2.3.3 (AAA) asks that motion triggered by interaction can be disabled; 2.2.2 (A) asks that automatic motion longer than five seconds can be paused [css/pause-auto-motion]; 2.3.1 (A) forbids more than three flashes per second.

## Entry and exit without timers

```css
.dialog { opacity: 1; scale: 1; transition: opacity 0.2s, scale 0.2s, display 0.2s allow-discrete, overlay 0.2s allow-discrete; }
.dialog:not([open]) { opacity: 0; scale: 0.96; }
@starting-style { .dialog[open] { opacity: 0; scale: 0.96; } }
```

`@starting-style` and `transition-behavior` are Baseline Newly available (2024-08-06).

## View Transitions

```js
function navigate(update) {
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return update()
  document.startViewTransition(update)
}
```

```css
.product-image { view-transition-name: product-hero; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation: none; } }
```

- Same-document view transitions: Baseline Newly available (2025-10-14). Cross-document (`@view-transition { navigation: auto; }`): not Baseline; it is a harmless enhancement where unsupported.
- `view-transition-name` must be unique on the page at the moment of the transition.
- Frameworks: Astro `<ClientRouter />`, Next.js and SvelteKit expose hooks around navigation; check their docs for the current API.

## Scroll-driven animations

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .progress { animation: grow linear both; animation-timeline: scroll(root); transform-origin: left; }
  }
}
@keyframes grow { from { scale: 0 1; } to { scale: 1 1; } }
```

Baseline Newly available only since 2026-10-27: keep them in `@supports` [css/limited-needs-supports]. Without support the element must look right standing still.

## will-change

Add it only when a measured animation stutters on its first frame, on the element that animates, and remove it afterwards when set from JavaScript; every layer costs memory.

## Sources

- web.dev, How to create high-performance CSS animations: https://web.dev/articles/animations-guide
- web.dev, prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN, View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN, CSS scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- MDN, @starting-style: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN, will-change: https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
- WCAG 2.2, Understanding 2.2.2, 2.3.1, 2.3.3: https://www.w3.org/WAI/WCAG22/Understanding/
- Motion for React, Accessibility: https://motion.dev/docs/react-accessibility
