# Contrast, colour, size and reflow reference

Depth for the `fe-a11y-visual` skill. Rule ids in brackets: `frontend-skills explain <id>`. Numbers from WCAG 2.2 (Recommendation of 12 December 2024) and its Understanding documents, read on 2026-11-11.

## Numbers to remember

| What | Minimum | WCAG 2.2 |
| --- | --- | --- |
| Body text | 4.5:1 | 1.4.3 AA [a11y/color-contrast] |
| Large text: at least 24 CSS px, or 18.5 CSS px bold (18pt, 14pt bold) | 3:1 | 1.4.3 AA |
| Control boundaries, states, focus ring, meaningful icons and chart parts | 3:1 against adjacent colours | 1.4.11 AA [a11y/non-text-contrast] |
| Pointer target | 24 × 24 CSS px, or spacing so 24px circles do not overlap | 2.5.8 AA [a11y/target-size] |
| Reflow | 320 CSS px wide, 256 CSS px high for horizontal text | 1.4.10 AA [a11y/reflow] |
| Text spacing the page must survive | line height 1.5, paragraphs 2 × font size, letters 0.12 ×, words 0.16 × | 1.4.12 AA [a11y/text-spacing] |
| Resize | Text to 200% without loss | 1.4.4 AA |

Exempt from contrast: disabled controls, pure decoration, logos and text that is part of a picture. Placeholder text is not exempt.

## The formula

Contrast ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter colour and L2 of the darker; it runs from 1:1 to 21:1. Compare unrounded values: 4.499:1 is a fail.

| Grey on white | Ratio | Use for |
| --- | --- | --- |
| `#9ca3af` | 2.54:1 | decoration only |
| `#767676` | 4.54:1 | the lightest grey for body text |
| `#6b7280` | 4.83:1 | text, field borders |
| `#4b5563` | 7.56:1 | secondary text with margin |

## Tokens as tested pairs

```css
:root {
  --text: #1f2937;   --surface: #ffffff;   /* 14.7:1 */
  --muted: #4b5563;                         /* 7.56:1 on surface */
  --border-control: #6b7280;                /* 4.83:1, above 3:1 */
  --focus: #1d4ed8;                         /* 6.70:1 */
}
@media (prefers-color-scheme: dark) {
  :root { --text: #f3f4f6; --surface: #111827; --muted: #9ca3af; --border-control: #9ca3af; --focus: #93c5fd; }
}
```

Recheck every pair in the dark theme: a token that passes on white can fail on near-black and the other way round. Tailwind v4: define them in `@theme` and use only those names.

## Not by colour alone [a11y/no-color-only]

| Case | Second cue |
| --- | --- |
| Field error | message text and an icon; `aria-invalid="true"` |
| Required field | the word "required" or an explained `*` |
| Link in a paragraph | underline (or 3:1 against the text plus an underline on hover and focus) |
| Selected tab, chip, row | weight, border, check mark, `aria-selected` |
| Chart series | direct labels, patterns or marker shapes |
| Status (online, failed) | text label or an icon with a name |

## Target size [a11y/target-size]

```css
.icon-button { display: inline-grid; place-items: center; min-width: 24px; min-height: 24px; padding: 0.25rem; }
@media (pointer: coarse) { .icon-button { min-width: 44px; min-height: 44px; } }
```

Exceptions in 2.5.8: enough spacing, an equivalent larger control on the same page, links inside a sentence, browser-drawn controls left unstyled, and cases where the size is essential. axe-core's `target-size` rule is off by default; `audit --url` turns it on.

## Reflow recipes [a11y/reflow]

```css
.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); }
.content { max-width: 70ch; margin-inline: auto; padding-inline: 1rem; }
.long-text { overflow-wrap: anywhere; }
.table-wrap { overflow-x: auto; } /* a table may scroll inside its own box; see fe-a11y-tables */
```

Avoid: fixed `width` in px on layout boxes, `white-space: nowrap` on prose, `overflow-x: hidden` on `body` to hide a bug, two-column layouts below 40em.

## Text spacing test

Paste in the console of the page under test, then look for clipped or overlapping text:

```js
document.head.insertAdjacentHTML('beforeend', '<style>*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}</style>')
```

## Hover and focus content [a11y/hover-content-dismissible]

Dismissible (Escape, without moving focus), hoverable (pointer can move onto it), persistent (stays until dismissed or the trigger loses hover and focus). Native `popover` gives light dismiss and Escape; a tooltip still needs the hover and focus wiring.

## Sources

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding 1.4.3, 1.4.11, 1.4.1, 2.5.8, 1.4.10, 1.4.12, 1.4.13: https://www.w3.org/WAI/WCAG22/Understanding/
- Technique C42 (target spacing): https://www.w3.org/WAI/WCAG22/Techniques/css/C42
- Technique C32 (reflow with grid): https://www.w3.org/WAI/WCAG22/Techniques/css/C32
- axe-core rule descriptions: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- MDN, `prefers-color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
