---
name: fe-a11y-aria
description: Gets names, roles, states and announcements right in any stack to WCAG 2.2 AA as a target - native elements before ARIA, accessible names for icon buttons and links, valid roles and aria-* attributes, aria-hidden used safely, state attributes, live regions for status messages. Use when adding ARIA, building a custom control or toast, labelling icons, or when asked "what will a screen reader say".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: ARIA, names and live regions
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/control-name a11y/prefer-native-element a11y/aria-valid a11y/aria-hidden-focusable a11y/aria-label-generic a11y/aria-ref-exists a11y/state-exposed a11y/status-message-live"
  version: 0.1.0
---

# ARIA, names and live regions

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Every button and link has a name; icon-only controls get hidden text or `aria-label`, the icon `aria-hidden="true"` (a11y/control-name).
- Use the native element before a role: `<button>`, `<a href>`, `<input type="checkbox">`, `<nav>`, `<h2>` (a11y/prefer-native-element).
- Roles and `aria-*` names must exist in WAI-ARIA 1.2: `aria-labelledby`, never `aria-labeledby` (a11y/aria-valid).
- Never `aria-hidden="true"` on anything focusable or around it; use `inert` or `hidden` (a11y/aria-hidden-focusable).
- Never `aria-label` on a plain `div`, `span` or `p`; label the control or give a fitting role (a11y/aria-label-generic).
- Ids in `aria-labelledby` and `aria-describedby` exist once on the page; generate them with `useId()` (a11y/aria-ref-exists).
- Custom toggles expose state: `aria-expanded`, `aria-pressed`, `aria-checked`, `aria-selected`, `aria-current` (a11y/state-exposed).
- Status messages go into a live region that exists before the text: `role="status"`, `role="alert"` only for urgent errors (a11y/status-message-live).
- The accessible name contains the visible label, best at its start (WCAG 2.5.3); never replace visible words with different ones.
- Never put ARIA on an element to change its look; ARIA changes only what is announced.

## Do this

1. Ask first: is there a native element? `dialog`, `details`, `select`, `input type="range"`, `progress`, `meter`, `search`. Use it and stop.
2. When there is none, follow the APG pattern for the widget (role, required children, states, keys) and the skills `fe-a11y-dialog`, `fe-a11y-menus`, `fe-a11y-tabs-accordion`, `fe-a11y-combobox`.
3. Name things in this order: visible text, `aria-labelledby` to visible text, `aria-label`, and never `title` or `placeholder` alone.
4. Bind every state attribute to the same variable that drives the visual state, so they cannot drift apart.
5. For async results, keep one polite live region per page area (`<p role="status">`) in the layout; write text into it; clear it after a few seconds only if the text stays visible elsewhere.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds unnamed icon buttons and links, invalid roles and attributes, `aria-hidden` over focusable content, labels on generic elements and broken id references.
- `audit --url <page>` adds axe-core's name and ARIA rules on the rendered page, where names that come from components are known.
- By hand: listen with a screen reader (VoiceOver, NVDA) to each changed control and message: name, role, state, and the announcement after an action.

## References

- [references/aria.md](references/aria.md): native element table, name computation order, state attributes per widget, live region recipes per framework, what axe checks. Read it when adding ARIA or building a custom control.
