---
name: fe-tailwind
description: Writes and reviews Tailwind CSS 4 code - CSS-first setup with @import and @theme, complete class names, tokens instead of arbitrary values, conflict-free class lists, sr-only labels, focus and reduced-motion variants. Use when editing class lists in markup or JSX, the Tailwind CSS entry file, migrating from Tailwind 3, or asked to review Tailwind code.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Tailwind CSS
  area: styling
  lane: B
  requires: tailwind
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.css"
  rules: "tailwind/no-dynamic-class tailwind/conflicting-utilities tailwind/theme-tokens tailwind/sr-only-label tailwind/hover-only-reveal tailwind/motion-safe tailwind/v4-entry tailwind/no-preprocessor tailwind/components-over-apply a11y/focus-visible"
  version: 0.1.0
---

# Tailwind CSS

Read `.frontend-skills/profile.json` (Tailwind version, framework, `helpers` such as design tokens and icon classes) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Write every class as a complete string; map states to full class names, never `bg-${color}-500` (tailwind/no-dynamic-class).
- One utility per property per variant: never `p-2 p-4` or `flex grid` on one element (tailwind/conflicting-utilities).
- A value used three times becomes an `@theme` variable with its own utility, not a repeated `[#0a7a3e]` (tailwind/theme-tokens).
- Hide text visually with `sr-only` (`md:not-sr-only` to show it later), never `hidden`, when it names a control (tailwind/sr-only-label).
- Pair every `hover:` reveal with `focus-within:` or `focus-visible:` (tailwind/hover-only-reveal).
- Never remove focus with `outline-none` or `outline-hidden` without a `focus-visible:` outline or ring (a11y/focus-visible).
- Wrap decorative animation in `motion-safe:` or stop it with `motion-reduce:animate-none` (tailwind/motion-safe).
- Tailwind 4: `@import "tailwindcss"`, theme in `@theme`, a JS config only through `@config` (tailwind/v4-entry); no Sass, Less or Stylus around it (tailwind/no-preprocessor).
- Reuse with components, loops and partials; `@apply` only for small cases and markup you do not own (tailwind/components-over-apply).
- Mobile first: unprefixed classes for small screens, `sm:` and up for wider ones.

## Do this

1. Check the version in the profile or `package.json`: this skill is for Tailwind 4 (latest 4.3.5, checked 2026-11-11). On Tailwind 3, keep its syntax and propose `npx @tailwindcss/upgrade` as a separate change.
2. Find the CSS entry (`@import "tailwindcss"`) and its `@theme` block before adding colours, fonts, spacing or breakpoints; add tokens there, named by role (`--color-brand-600`, `--spacing-gutter`).
3. For variants of a component, keep a map of complete class strings per prop value, or a small helper such as `cva`; merge caller classes with `tailwind-merge` when the component accepts them.
4. Use `bg-(--accent)` with an inline `style` custom property for values that are really dynamic, and `size-*`, `inset-*`, `gap-*`, `dvh` and logical utilities (`ms-*`, `pe-*`) over older patterns.
5. In Vue, Svelte and Astro `<style>` blocks and CSS modules, start with `@reference "../app.css";` before `@apply`, or use theme variables directly.
6. Plain CSS rules for sizes, colours and icons follow the `fe-css-architecture` skill and the project's `helpers`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports built class names, conflicting utilities, repeated arbitrary values, hidden labels, hover-only reveals, unguarded animations and Tailwind 3 setup left in a Tailwind 4 project.
- Build once (`vite build` or the framework's build) and search the output CSS for a class you added; a missing one means it was built from parts or its file is not scanned (`@source`).
- Tab through the page and switch on "reduce motion" in the OS once per feature.

## References

- [references/tailwind.md](references/tailwind.md): v3 to v4 changes, `@theme` namespaces, directives, variants for accessibility, class detection and `@source`. Read it when setting up, upgrading, or adding tokens and custom utilities.
