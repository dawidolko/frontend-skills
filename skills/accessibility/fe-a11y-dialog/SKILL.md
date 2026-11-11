---
name: fe-a11y-dialog
description: Builds modal and non-modal dialogs, alert dialogs, drawers and confirmations that work with keyboard and screen readers (WAI-ARIA APG Dialog pattern) on the native dialog element - name, initial focus, inert background, Escape, focus return. Use when adding a modal, popup, drawer, lightbox, cookie or confirm dialog in any stack, or when asked "make this modal accessible".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Dialogs and modals
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/dialog-native a11y/dialog-name a11y/dialog-focus a11y/aria-hidden-focusable a11y/no-keyboard-trap"
  version: 0.1.0
---

# Dialogs and modals

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's dialog component) wins over this skill.

## Rules

- Use `<dialog>` with `showModal()` for modals and `show()` for non-modal ones, not a `div role="dialog"` (a11y/dialog-native).
- Every dialog has a name: `aria-labelledby` pointing at its visible heading (a11y/dialog-name).
- On open, focus goes inside; Tab stays inside a modal; Escape closes; on close, focus returns to the trigger (a11y/dialog-focus).
- The page behind a modal is inert, never just `aria-hidden` over focusable content (a11y/aria-hidden-focusable).
- Only an open modal keeps focus inside; a closed one releases it (a11y/no-keyboard-trap).
- A visible close or cancel button is inside the dialog and in the Tab order.
- Confirmations of destructive actions use `role="alertdialog"` with `aria-describedby` on the message, and focus the safe choice.
- Do not open a modal on page load or on hover; open it from a user action.

## Do this

1. Check the project's UI library first (Radix, React Aria, Reka UI, bits-ui, Angular CDK Dialog, Headless UI): if it provides a dialog, use it the documented way instead of writing one.
2. Otherwise write `<dialog aria-labelledby="id">` with a heading, content and a `<form method="dialog">` for the close buttons; open it from a `<button type="button">` with `showModal()`.
3. Set initial focus with `autofocus` on the right element inside the dialog: the first field, or the least destructive button.
4. Keep the trigger in a variable and focus it in the `close` event if the browser did not.
5. Style the overlay with `::backdrop`; stop background scroll with `body:has(dialog[open]) { overflow: hidden; }`.
6. For a side drawer or full-screen menu, use the same `<dialog>`; for a small popup next to its trigger without blocking the page, use `popover`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds unnamed dialogs, `div` dialogs and `aria-hidden` over focusable content.
- By hand: open with the keyboard, Tab and Shift+Tab around (focus stays inside), press Escape (it closes, focus is back on the trigger), and listen with a screen reader (name and role are read on open).

## References

- [references/dialog.md](references/dialog.md): full native dialog code, framework versions (React, Vue, Svelte, Angular), alert dialogs, dialog versus popover, scroll locking and the old patterns to replace. Read it when building or reviewing a dialog.
