---
name: fe-a11y-forms
description: Builds and reviews accessible forms in any stack (HTML, React, Vue, Svelte, Angular, Astro) to WCAG 2.2 AA as a target - labels, autocomplete, required fields, grouping, error messages, focus after submit, sign-in without memory tests. Use when writing or changing a form, an input component, validation or a sign-in or checkout flow, or when asked "is this form accessible".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Accessible forms
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/input-label a11y/autocomplete-valid a11y/form-errors html/button-type"
  version: 0.1.0
---

# Accessible forms

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's own form components) wins over this skill.

## Rules

- Every field has a programmatic label: `<label for>` + `id`, a wrapping `<label>`, or `aria-labelledby`; a placeholder is never the label (a11y/input-label).
- Personal-data fields carry a standard `autocomplete` token (`email`, `given-name`, `tel`, `postal-code`, `new-password`) (a11y/autocomplete-valid).
- Errors are text next to the field, linked with `aria-describedby`, marked with `aria-invalid="true"`, and say how to fix the input (a11y/form-errors).
- Required fields say so in the label text or with a visible marker explained once, plus the `required` attribute.
- Related choices (radio groups, an address block) sit in `<fieldset>` with a `<legend>`.
- The submit control is `<button type="submit">`; other buttons in a form are `type="button"` (html/button-type).
- Never block paste into password or code fields, never ask for the same data twice in one flow, never use a puzzle or memory test as the only way to sign in (WCAG 3.3.7, 3.3.8).
- Never rely on colour alone for an error or a required marker.

## Do this

1. Find the project's form primitives (an `Input`, `Field` or `FormField` component, a form library) and fix them once; a lesson in `lessons.md` may name them.
2. For each field: visible label, `id`, correct `type` and `inputmode`, `autocomplete`, `required` where needed, a hint linked with `aria-describedby`.
3. Validate on submit (and on blur only after a first submit). On error: keep the values, set `aria-invalid`, render the messages, move focus to the first invalid field or to an error summary with links.
4. Announce asynchronous results (saved, sent) in a polite live region that exists before the message is put in it.
5. Keep targets at least 24 by 24 CSS pixels and the focus indicator visible on every control.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds unlabeled fields, invalid autocomplete values and buttons without a type.
- `audit --url <page>` adds axe-core results for the rendered form (labels from components included).
- By hand: fill and submit the form with the keyboard only, then with a screen reader (VoiceOver, NVDA): every field announces its label, state and error.

## References

- [references/forms.md](references/forms.md): the field anatomy, error and summary patterns, live regions, framework form libraries and the WCAG 2.2 criteria per step. Read it when building a whole form or a field component.
