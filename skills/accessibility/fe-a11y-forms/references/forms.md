# Accessible forms reference

Depth for the `fe-a11y-forms` skill. Rule ids in brackets: `frontend-skills explain <id>`.

## Anatomy of a field

```html
<div class="field">
  <label for="email">Email <span aria-hidden="true">*</span></label>
  <p id="email-hint" class="hint">We send the receipt here.</p>
  <input id="email" name="email" type="email" autocomplete="email" required
         aria-describedby="email-hint email-error" aria-invalid="true">
  <p id="email-error" class="error">Enter an email address like name@example.com.</p>
</div>
```

- The label names the field [a11y/input-label]; the hint and the error are descriptions, so `aria-describedby` lists both ids. Render the error element only when there is an error, or keep it empty.
- Explain the `*` once above the form ("Fields marked * are required"), and keep `required` on the input.
- `type` gives the right mobile keyboard (`email`, `tel`, `url`, `number` only for real quantities); `inputmode="numeric"` with `pattern` suits codes and card numbers.
- `autocomplete` tokens come from the HTML standard [a11y/autocomplete-valid]; WCAG 1.3.5 asks for them on fields about the user.

## Groups

```html
<fieldset>
  <legend>Delivery</legend>
  <label><input type="radio" name="delivery" value="courier"> Courier</label>
  <label><input type="radio" name="delivery" value="pickup"> Pick-up point</label>
</fieldset>
```

Use a fieldset for radio and checkbox groups and for repeated blocks (shipping and billing addresses). The legend is read before each option.

## Errors

| Step | What to do | WCAG 2.2 |
| --- | --- | --- |
| Detect | Validate on submit; after the first submit, also on change or blur. | 3.3.1 |
| Mark | `aria-invalid="true"` on the field, text error after it, linked by `aria-describedby`. | 3.3.1, 1.3.1 |
| Explain | Say what is wrong and how to fix it, in plain words. | 3.3.3 |
| Focus | Move focus to the first invalid field, or to an error summary (a heading plus a list of links to the fields). | 2.4.3 |
| Keep | Keep every value the person entered. | 3.3.7 |
| Prevent | For legal, financial or data-deleting submits: let people review, confirm or undo. | 3.3.4 |

Error summary pattern:

```html
<div role="alert" tabindex="-1" id="error-summary">
  <h2>There are 2 problems</h2>
  <ul>
    <li><a href="#email">Enter an email address like name@example.com</a></li>
    <li><a href="#postcode">Enter a postcode</a></li>
  </ul>
</div>
```

Focus the summary after rendering it (`summary.focus()`), and keep the inline errors as well.

## Status messages

Results that do not move focus ("Saved", "3 results") go in a live region that is already in the DOM: `<p role="status" aria-live="polite"></p>`, then set its text. Use `role="alert"` only for urgent problems. (WCAG 4.1.3)

## Sign-in and authentication

- Allow paste and password managers: `autocomplete="username"`, `"current-password"`, `"new-password"`, `"one-time-code"`.
- No cognitive test (remembering, transcribing, solving) as the only way in, unless an alternative or help exists (WCAG 3.3.8). Passkeys, email links and pasted codes pass.
- Show-password toggles are `<button type="button" aria-pressed>`.

## Framework notes

| Stack | Labels | Errors |
| --- | --- | --- |
| React | `htmlFor` + `id`; generate ids with `useId()`. | React Hook Form: render `errors.field.message` in an element referenced by `aria-describedby`; set `aria-invalid={!!errors.field}`. |
| Vue / Nuxt | `for` + `:id` from `useId()` (Vue 3.5+). | VeeValidate or FormKit: check the generated markup for `aria-describedby`. |
| Svelte / SvelteKit | `for` + `id`; form actions keep values with `use:enhance`. | Return `fail(400, { values, errors })` and render the errors next to the fields. |
| Angular | `for` + `id`, or `aria-labelledby` in custom controls. | Reactive forms: bind `[attr.aria-invalid]` and `[attr.aria-describedby]`. |

Component libraries differ: run `audit --url` on a rendered form, because labels produced inside components are not visible to the static check.

## Sources

- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WHATWG autofill: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute
- React `useId`: https://react.dev/reference/react/useId
