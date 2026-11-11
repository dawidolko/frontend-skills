---
name: fe-a11y-keyboard
description: Makes every control work from the keyboard in any stack (HTML, React, Vue, Svelte, Angular, Astro) to WCAG 2.2 AA as a target - native controls, focus order, visible focus, focus not hidden by sticky bars, skip links, focus after route changes, no traps. Use when building interactive UI, custom widgets or a layout, removing an outline, or when asked "can I use this with a keyboard".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Keyboard access and focus
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html **/*.css **/*.scss"
  rules: "a11y/no-click-on-static a11y/link-is-link a11y/positive-tabindex a11y/focus-visible a11y/focus-not-obscured a11y/skip-link a11y/no-keyboard-trap a11y/focus-route-change a11y/scrollable-region-focusable"
  version: 0.1.0
---

# Keyboard access and focus

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Actions are `<button type="button">`, navigation is `<a href>`; never a click handler on a `div` or `span` (a11y/no-click-on-static).
- Never `<a>` without `href`, with `href="#"` or `javascript:` as a button (a11y/link-is-link).
- Never `tabindex` above 0; fix the order in the DOM, and keep CSS `order` and `*-reverse` from scrambling it (a11y/positive-tabindex).
- Never remove the outline without a visible `:focus-visible` style of at least 3:1 contrast (a11y/focus-visible).
- Sticky headers, footers and banners never cover the focused element: set `scroll-padding` (a11y/focus-not-obscured).
- Layouts with repeated navigation start with a working "Skip to main content" link (a11y/skip-link).
- Focus can always leave a component with Tab or Escape; only an open modal traps it (a11y/no-keyboard-trap).
- After a client-side route change, move focus to the new heading or `<main>` (a11y/focus-route-change).
- Scrollable regions with nothing focusable inside get `tabindex="0"` and a name (a11y/scrollable-region-focusable).
- Custom widgets (tabs, menus, listboxes) have one Tab stop and arrow keys inside, as the APG pattern says.
- Act on `click`, not `mousedown` or `touchstart`; give drag interactions a click alternative (WCAG 2.5.2, 2.5.7).

## Do this

1. Start from native elements: `button`, `a href`, `input`, `select`, `details`, `dialog`. They are focusable and handle Enter and Space for free.
2. For a custom widget, follow its APG pattern (`fe-a11y-dialog`, `fe-a11y-menus`, `fe-a11y-tabs-accordion`, `fe-a11y-combobox`): roving `tabindex` (0 on the current item, -1 on the rest) or `aria-activedescendant`.
3. Style focus once, globally: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }`; check it on every background.
4. Put the skip link and `scroll-padding-top` in the shared layout; read the sticky header height from one custom property.
5. When content appears after a trigger (a panel, an error summary, a deleted row's neighbour), insert it after the trigger in the DOM or move focus to it; never let focus fall to `<body>`.
6. In an SPA, use the router's announcer (Next.js, SvelteKit, Nuxt `<NuxtRouteAnnouncer>`) and focus the `h1` after navigation.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds clickable `div`s, fake links, positive `tabindex` and removed outlines.
- `audit --url <page>` adds axe-core results (skip link, scrollable regions).
- By hand, for every change: unplug the mouse, Tab and Shift+Tab through the page; every control is reachable, visible when focused, works with Enter or Space, and Escape closes what it opened.

## References

- [references/keyboard.md](references/keyboard.md): keys per control, roving tabindex, skip link and sticky header code, focus after route change per framework, a manual test script. Read it when building a custom widget or a layout.
