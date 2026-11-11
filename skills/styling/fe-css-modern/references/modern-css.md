# Modern CSS reference

Depth for the `fe-css-modern` skill. Rule ids in brackets: `frontend-skills explain <id>`. Baseline status from the web-features package 3.45.0, read on 2026-11-11 (`docs/sources/css.md`); it changes every few weeks, so recheck before you drop a fallback [css/baseline-check].

## Baseline status (2026-11-11)

| Feature | Status | Since |
| --- | --- | --- |
| Nesting | Widely available | 2026-06-11 |
| `:has()` | Widely available | 2026-06-19 |
| `:is()`, `:where()` | Widely available | 2023-07-21 |
| Cascade layers | Widely available | 2024-09-14 |
| `color-mix()`, `oklch()` | Widely available | 2025-11-09 |
| Container size queries | Widely available | 2025-08-14 |
| Subgrid | Widely available | 2026-03-15 |
| `:focus-visible` | Widely available | 2024-09-14 |
| `@property` | Newly available | 2024-07-09 |
| `light-dark()` | Newly available | 2024-05-13 |
| Relative colour syntax | Newly available | 2024-09-16 |
| `@starting-style`, `transition-behavior` | Newly available | 2024-08-06 |
| `text-wrap: balance` | Newly available | 2024-05-13 |
| Same-document view transitions | Newly available | 2025-10-14 |
| `@scope` | Newly available | 2026-03-24 |
| `field-sizing` | Newly available | 2026-06-16 |
| Container style queries | Newly available | 2026-05-19 |
| Scroll-driven animations | Newly available | 2026-10-27 |
| `text-wrap: pretty` | Not Baseline | – |
| Anchor positioning | Not Baseline | – |
| Cross-document view transitions | Not Baseline | – |
| `interpolate-size`, `calc-size()`, `if()` | Not Baseline | – |

Widely available: use freely. Newly available: use when the targets allow, or as enhancement. Not Baseline: `@supports` and a fallback [css/limited-needs-supports].

## Nesting

```css
.card {
  padding: var(--space-4);
  &:hover { box-shadow: var(--shadow-2); }
  &.card--featured { border-color: var(--color-brand); }
  & .card__title { font-size: 1.25rem; }
  @media (width >= 48em) { padding: var(--space-6); }
}
```

- `&` is the whole parent selector; `&__title` is invalid and the block is dropped [css/nesting-no-concat]. Sass and `postcss-nested` join suffixes; browsers do not.
- `&` has the specificity of `:is(parent)`, so a nested selector can weigh more than its flat version. Keep nesting to about three levels.

## Selectors that replace JavaScript

```css
.field:has(:user-invalid) .field__error { display: block; }   /* show errors after interaction */
.card:has(img) { grid-template-rows: auto 1fr; }              /* layout depends on content */
body:has(dialog[open]) { overflow: hidden; }                  /* lock scroll while a modal is open */
:where(ul, ol)[role="list"] { list-style: none; padding: 0; } /* zero-specificity reset */
```

`:user-invalid` matches only after the person interacted with the field, unlike `:invalid`.

## Scope

```css
@scope (.card) to (.card__body) {
  img { border-radius: var(--radius-2); }   /* images in the card, not in its body */
}
```

Newly available: keep class names that work without it.

## Colour

```css
:root {
  color-scheme: light dark;                        /* required for light-dark() [css/light-dark-color-scheme] */
  --brand: oklch(55% 0.2 260);
  --brand-hover: color-mix(in oklch, var(--brand), black 15%);
  --brand-soft: oklch(from var(--brand) l c h / 15%);   /* relative colour: give a fallback before it */
  --surface: light-dark(#ffffff, #121212);
  --text: light-dark(#1a1a1a, #f2f2f2);
}
```

Perceptual lightness in `oklch` makes tint steps even, but contrast still has to be measured for every text and background pair.

## Entry and exit animation

```css
.toast { opacity: 1; translate: 0 0; transition: opacity 0.2s, translate 0.2s, display 0.2s allow-discrete; }
.toast[hidden] { display: none; opacity: 0; translate: 0 1rem; }
@starting-style { .toast:not([hidden]) { opacity: 0; translate: 0 1rem; } }
@property --progress { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
```

Put motion inside `prefers-reduced-motion: no-preference` (see `fe-motion`).

## Popover and anchor positioning

```css
.menu { position: absolute; inset: auto; top: 100%; left: 0; }          /* fallback */
@supports (anchor-name: --a) {
  .menu-button { anchor-name: --menu; }
  .menu { position-anchor: --menu; position-area: block-end span-inline-end; position-try-fallbacks: flip-block; }
}
```

The `popover` attribute gives light dismiss, top layer and Escape without JavaScript; anchor positioning only places it.

## Sources

- web.dev, Baseline: https://web.dev/baseline
- web-features explorer: https://web-platform-dx.github.io/web-features-explorer/
- MDN, Using CSS nesting: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting
- MDN, :has(): https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- MDN, @scope: https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
- MDN, color-mix(): https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
- MDN, light-dark(): https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
- MDN, @starting-style: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN, @property: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
- MDN, text-wrap: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
- MDN, CSS anchor positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
- MDN, Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
