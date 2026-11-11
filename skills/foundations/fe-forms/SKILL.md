---
name: fe-forms
description: Builds and reviews HTML forms that work natively - the right input types and inputmode, autocomplete tokens, constraint validation and custom messages, select placeholders, file inputs, and submission through the form's submit event. Accessibility of forms is in fe-a11y-forms. Use when writing a form, a field component, validation or a submit handler, or asked "why does this form not validate".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Native forms and validation
  area: foundations
  lane: A
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "html/input-type html/no-number-for-codes html/password-autocomplete html/constraint-attr-type html/required-select-placeholder html/form-submit a11y/input-label a11y/autocomplete-valid html/button-type"
  version: 0.1.0
---

# Native forms and validation

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (the project's form components or library) wins over this skill.

## Rules

- Put fields in a `<form>`, handle its `submit` event and give it one `<button type="submit">` (html/form-submit, html/button-type).
- Every field has a label; follow `fe-a11y-forms` for errors and groups (a11y/input-label).
- Pick the type for the data: `email`, `tel`, `url`, `search`, `date`, `number` for quantities only (html/input-type).
- Codes of digits use `type="text" inputmode="numeric"`, never `type="number"` (html/no-number-for-codes).
- Fields about the person carry a standard `autocomplete` token (a11y/autocomplete-valid).
- Password fields say `current-password` or `new-password`; never `autocomplete="off"`, never block paste (html/password-autocomplete).
- Validation attributes match the type: `pattern` and `maxlength` on text-like types, `min`, `max`, `step` on numbers and dates (html/constraint-attr-type).
- A required single select starts with `<option value="">` (html/required-select-placeholder).
- Validate on the server too; client checks are a convenience.
- Never disable the submit button to signal invalid input; let submit run and show the errors.

## Do this

1. Find the project's form layer first (a `Field` component, React Hook Form, VeeValidate, Angular reactive forms, SvelteKit form actions) and fix it there.
2. For each field: label, `name`, `id`, `type` or `inputmode`, `autocomplete`, `required` and the constraint attributes its type supports.
3. Use native constraint validation for the rules (`required`, `pattern`, `min`); for your own wording add `novalidate` to the form and show messages with `setCustomValidity` or rendered text after `checkValidity()`.
4. Style errors with `:user-invalid` (after interaction), not `:invalid` (which matches before the person typed).
5. Submit with `new FormData(form)`; keep the form working without JavaScript where the framework allows (a real `action`, SvelteKit or Remix-style actions, React form actions).
6. Prevent double submits by ignoring a second submit while one is pending, and keep the values when the server returns errors.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports wrong input types, number fields for codes, password fields without a token, ignored constraint attributes, required selects without a placeholder, unlabeled fields and buttons without a type.
- By hand: fill the form on a phone (keyboard per field), with a password manager, with autofill, and submit it with Enter.

## References

- [references/native-forms.md](references/native-forms.md): types and `inputmode` with their keyboards, common `autocomplete` tokens, which attributes apply to which type, the constraint validation API, custom messages, file inputs, submission patterns per framework. Read it when you build a form or a field component.
