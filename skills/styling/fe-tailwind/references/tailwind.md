# Tailwind CSS reference

Depth for the `fe-tailwind` skill, for Tailwind CSS 4 (latest stable checked 2026-11-11 on the npm registry: `tailwindcss` 4.3.5; the `v3-lts` tag is 3.4.19). Rule ids in brackets: `frontend-skills explain <id>`.

## Setup in version 4

| Piece | Tailwind 4 |
| --- | --- |
| Install with Vite | `@tailwindcss/vite` in `vite.config`, then `@import "tailwindcss";` in the CSS entry |
| Install with PostCSS | `@tailwindcss/postcss` in `postcss.config.mjs` |
| Theme | `@theme { --color-brand-600: #0a7a3e; }` in CSS; each variable makes utilities and a CSS variable [tailwind/theme-tokens] |
| JS config | not detected any more; load it with `@config "../tailwind.config.js";` [tailwind/v4-entry] |
| Extra sources | `@source "../node_modules/@acme/ui";` for paths the scanner skips (ignored by git, `node_modules`) |
| Custom utility | `@utility content-auto { content-visibility: auto; }` |
| Custom variant | `@custom-variant theme-dark (&:where([data-theme=dark] *));` |
| Component styles | `@reference "../app.css";` at the top of a `<style>` block or CSS module that uses `@apply` |
| Preprocessors | not supported: no Sass, Less or Stylus in front of Tailwind [tailwind/no-preprocessor] |
| Browsers | Chrome 111, Safari 16.4, Firefox 128 or newer; stay on 3.4 for older targets |

## Changes from version 3 that still trip people

| Version 3 | Version 4 |
| --- | --- |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| `focus:outline-none` (made the outline transparent) | `outline-hidden`; `outline-none` now really sets `outline-style: none` |
| `bg-[--brand]` | `bg-(--brand)` |
| `!flex` (important first) | `flex!` (the old form still works but is deprecated) |
| `theme(colors.red.500)` | `var(--color-red-500)` |
| `hover:` on every device | `hover:` only where the primary input can hover (`@media (hover: hover)`) |
| `tailwind.config.js` found automatically | load it with `@config`, or move it into `@theme` |

Run `npx @tailwindcss/upgrade` (Node.js 20 or newer) on a clean branch; review its diff.

## Theme namespaces

| Namespace | Utilities it feeds |
| --- | --- |
| `--color-*` | `bg-`, `text-`, `border-`, `fill-`, `ring-` and every colour utility |
| `--font-*` | `font-sans`, `font-display` |
| `--text-*` | `text-sm`, `text-xl` (with `--text-xl--line-height`) |
| `--spacing` / `--spacing-*` | `p-`, `m-`, `gap-`, `w-`, `h-`, `inset-` |
| `--radius-*` | `rounded-*` |
| `--shadow-*` | `shadow-*` |
| `--breakpoint-*` | `sm:`, `md:`, custom `3xl:` |
| `--animate-*` | `animate-*` (with `@keyframes` inside `@theme`) |

Set `--color-*: initial;` inside `@theme` to drop the default palette and keep only the project's colours.

## Accessibility helpers

Tailwind's variants help you work to WCAG 2.2 AA; they check nothing by themselves.

| Need | Classes |
| --- | --- |
| Text for screen readers only | `sr-only`; show it later with `md:not-sr-only` [tailwind/sr-only-label] |
| Visible keyboard focus | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600` [a11y/focus-visible] |
| Reveal on hover and focus | `group-hover:opacity-100 group-focus-within:opacity-100` [tailwind/hover-only-reveal] |
| Reduced motion | `motion-safe:animate-bounce`, `motion-reduce:transition-none` [tailwind/motion-safe] |
| Forced colours (Windows high contrast) | `forced-colors:appearance-auto`, `forced-colors:border` on custom controls |
| More contrast requested | `contrast-more:border-gray-900` |
| Invalid fields | `user-invalid:border-red-600`; `aria-[invalid=true]:border-red-600` (no built-in `aria-invalid:` variant) |
| Dark mode | every `dark:` colour paired with its light one; check contrast in both |

## Class lists that stay readable

- Order classes with the official `prettier-plugin-tailwindcss` (0.8.1, checked 2026-11-11).
- One class list per element; when it passes about a line and a half, the element probably wants to be a component.
- Variants per component prop as a map of full strings [tailwind/no-dynamic-class]; conflicts resolved by props, not by appended overrides [tailwind/conflicting-utilities].
- Responsive: base classes for small screens, then `md:`, `lg:`; container queries with `@container` and `@md:`.
- Arbitrary values (`top-[117px]`) are for one-offs; the second or third repeat becomes a token [tailwind/theme-tokens].

## Sources

- Tailwind CSS docs, Installation with Vite: https://tailwindcss.com/docs/installation/using-vite
- Tailwind CSS docs, Upgrade guide: https://tailwindcss.com/docs/upgrade-guide
- Tailwind CSS docs, Compatibility: https://tailwindcss.com/docs/compatibility
- Tailwind CSS docs, Theme variables: https://tailwindcss.com/docs/theme
- Tailwind CSS docs, Functions and directives: https://tailwindcss.com/docs/functions-and-directives
- Tailwind CSS docs, Detecting classes in source files: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind CSS docs, Styling with utility classes: https://tailwindcss.com/docs/styling-with-utility-classes
- Tailwind CSS docs, Hover, focus and other states: https://tailwindcss.com/docs/hover-focus-and-other-states
- Tailwind CSS docs, Responsive design: https://tailwindcss.com/docs/responsive-design
- npm registry, tailwindcss: https://registry.npmjs.org/tailwindcss/latest
