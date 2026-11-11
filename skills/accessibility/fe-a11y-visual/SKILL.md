---
name: fe-a11y-visual
description: Keeps visual design readable and usable to WCAG 2.2 AA as a target - text and UI contrast, no colour-only meaning, 24px targets, reflow at 320px, resize and text spacing, dismissible hover content. Use when choosing colours or design tokens, styling links, buttons, fields, focus rings or tooltips, building a theme or dark mode, or when asked "is this contrast OK".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Contrast, colour, size and reflow
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.css **/*.scss **/*.less **/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro"
  rules: "a11y/color-contrast a11y/non-text-contrast a11y/no-color-only a11y/target-size a11y/reflow a11y/text-spacing a11y/font-size-relative a11y/hover-content-dismissible"
  version: 0.1.0
---

# Contrast, colour, size and reflow

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's colour tokens) wins over this skill.

## Rules

- Text contrast is at least 4.5:1; large text (24px, or 18.5px bold) at least 3:1; 4.49 fails (a11y/color-contrast).
- Field borders, checkboxes, toggles, focus rings and meaningful icons reach 3:1 against their neighbours (a11y/non-text-contrast).
- Colour is never the only cue: errors get text and an icon, links in text get an underline (a11y/no-color-only).
- Pointer targets are at least 24 by 24 CSS px, or spaced 24px apart (a11y/target-size).
- Layouts reflow at 320px wide with no sideways scrolling, except tables, maps and code (a11y/reflow).
- Text survives the WCAG spacing overrides: no fixed heights with `overflow: hidden` on text (a11y/text-spacing).
- Do not set the root font size in px; size type in `rem` (a11y/font-size-relative).
- Hover and focus popups close with Escape, can be hovered, and never time out (a11y/hover-content-dismissible).
- Never block zoom in the viewport meta tag (a11y/zoom-not-blocked); never use images of text.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`; test both themes for every rule above.

## Do this

1. Find the colour tokens (CSS custom properties, Tailwind `@theme`, a tokens file) and fix contrast there, as tested pairs of foreground and background, for light and dark themes.
2. Style states visibly beyond colour: `:hover` and `:focus-visible` change shape or underline; selected items get a check mark; errors get an icon and text.
3. Size controls with `min-width`/`min-height` and padding, not with a fixed `width`/`height` on the icon.
4. Lay out with `flex-wrap`, `grid` with `minmax(min(…, 100%), 1fr)`, `max-width`, and `overflow-wrap: anywhere` for long strings.
5. Let text boxes grow: `min-height`, no clipping; truncation (`line-clamp`) only where the full text is reachable.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds a root font size in px and a zoom block; the rest needs a rendered page.
- `audit --url <page>` runs axe-core for text contrast, links that rely on colour and target size.
- By hand: zoom to 400% (or a 320px window), apply a text spacing bookmarklet, view in greyscale, and check field borders and focus rings with a contrast checker.

## References

- [references/visual.md](references/visual.md): contrast numbers and formula, token pair tables, target size exceptions, reflow recipes, text spacing values, dark mode notes. Read it when building a theme or a design system.
