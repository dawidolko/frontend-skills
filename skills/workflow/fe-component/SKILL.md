---
name: fe-component
description: Builds a new UI component the right way round in any stack - native semantics first, the keyboard model from the WAI-ARIA APG pattern, names and states, every visual state, responsive and reduced motion, the project helpers and tokens, tests by role, then the audit. Use when asked to create or rebuild a component (button, field, dialog, menu, tabs, card, table, toast) or a design-system part.
license: MIT
compatibility: Any agent that reads Agent Skills. Needs Node.js 20 or newer to run the audit.
metadata:
  title: Build a component
  area: workflow
  lane: W
  requires: web
  globs: "**/components/** **/ui/** **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.ts **/*.component.html"
  rules: "a11y/prefer-native-element a11y/control-name a11y/no-click-on-static a11y/focus-visible a11y/state-exposed html/button-type test/query-by-role"
  version: 0.1.0
---

# Build a component

Read `.frontend-skills/profile.json` (framework, styling, helpers) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example where components live) wins over this skill.

## Rules

- Look for an existing component or a UI library primitive before writing a new one.
- Start from the native element that does the job; add ARIA only where none exists (a11y/prefer-native-element).
- Interactive parts are `<button type="button">` or `<a href>`, never clickable `div`s (a11y/no-click-on-static, html/button-type).
- Every control has an accessible name, including icon-only ones (a11y/control-name).
- States are exposed with the right attribute (`aria-expanded`, `aria-pressed`, `aria-selected`, `aria-invalid`) (a11y/state-exposed).
- Follow the APG pattern's keyboard model for composite widgets; one Tab stop, arrows inside.
- Style every state: default, hover, `:focus-visible`, active, disabled, invalid, loading, empty (a11y/focus-visible).
- Use the project's tokens and helpers (`profile.helpers`) for sizes, colours and icons; no raw values.
- The component works from 320px wide, with 200% text, in dark mode and with reduced motion.
- Props pass through `id`, `className`/`class` and ARIA attributes; forward refs to the focusable element.
- Tests find it by role and name and cover keyboard use (test/query-by-role).

## Do this

1. Name the job and pick the pattern: native element, or the APG pattern (`fe-a11y-dialog`, `fe-a11y-menus`, `fe-a11y-tabs-accordion`, `fe-a11y-combobox`, `fe-a11y-carousel-toast`, `fe-a11y-tables`).
2. Write the markup and keyboard behaviour first, unstyled; check it with the keyboard.
3. Add the API: props for content and state, events named after user intent (`onOpenChange`, `onSelect`), ids from `useId()` or the framework's equivalent.
4. Style with the project's tokens; add all states and the responsive and reduced-motion rules.
5. Write tests: render, find by role and name, act with the keyboard and pointer, assert what a user sees; add an axe check where the project has one.
6. Run `npx github:dawidolko/frontend-skills audit --changed` and the project's lint, type check and tests; fix every finding.

## Check

- `audit --changed` is clean for the new files; `explain <id>` for anything it reports.
- Keyboard only: every part works; with a screen reader: name, role and state are right after each action.
- The component renders correctly at 320px, at 200% text and in both colour schemes.

## References

- [references/component.md](references/component.md): the component checklist, a pattern map, the API conventions, an accessible button and disclosure example per framework, and a test template. Read it before building a component.
