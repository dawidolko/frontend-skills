# Native forms reference

Depth for the `fe-forms` skill. Rule ids in brackets: `frontend-skills explain <id>`. Checked on 2026-11-11 against the HTML Standard and MDN. Accessibility (labels, errors, groups, focus) is in `fe-a11y-forms`.

## Types and keyboards

| Data | Markup | Mobile keyboard | Built-in check |
| --- | --- | --- | --- |
| Email | `type="email" autocomplete="email"` | with `@` and `.` | address format |
| Phone | `type="tel" autocomplete="tel"` | digits and `+` | none (formats differ) |
| Web address | `type="url"` | with `/` and `.com` | absolute URL |
| Search | `type="search"` inside `<form role="search">` | with a search key | none |
| Quantity, age | `type="number" min max step` | digits | range and step |
| Code, card, postal code | `type="text" inputmode="numeric" pattern` | digits | `pattern` [html/no-number-for-codes] |
| Date | `type="date" min max` | native picker | range |
| Password | `type="password" autocomplete="current-password"` | text | none [html/password-autocomplete] |
| Long text | `<textarea maxlength>` (`field-sizing: content` to grow, as enhancement) | text | length |

`inputmode` values: `numeric`, `decimal`, `tel`, `email`, `url`, `search`, `text`, `none`. Use `enterkeyhint` (`search`, `send`, `next`, `done`) to label the Enter key.

## Common autocomplete tokens

`name`, `given-name`, `family-name`, `email`, `username`, `current-password`, `new-password`, `one-time-code`, `tel`, `organization`, `street-address`, `address-line1`, `address-level2` (city), `postal-code`, `country`, `country-name`, `bday`, `cc-name`, `cc-number`, `cc-exp`, `cc-csc`. Prefix with `shipping` or `billing` for two addresses in one form (`shipping postal-code`). The checks validate tokens [a11y/autocomplete-valid].

## Which attribute applies to which type

| Attribute | Applies to | Ignored on |
| --- | --- | --- |
| `pattern`, `minlength`, `maxlength` | text, search, url, tel, email, password (and `maxlength` on textarea) | number, date, range… [html/constraint-attr-type] |
| `min`, `max`, `step` | number, range, date, month, week, time, datetime-local | text-like types |
| `required` | all except hidden, range, color and buttons | – |
| `multiple` | email, file | others |
| `placeholder` | text-like types and number | others; never a label |

## Constraint validation

```js
const form = document.querySelector('form')
form.noValidate = true                      // own messages instead of the browser bubbles
form.addEventListener('submit', (event) => {
  const email = form.elements.email
  email.setCustomValidity(email.validity.typeMismatch ? 'Enter an email address like name@example.com.' : '')
  if (!form.checkValidity()) {
    event.preventDefault()
    // render each field's validationMessage next to it, set aria-invalid, focus the first invalid field
  }
})
```

- `validity` flags: `valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`, `tooLong`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`, `customError`.
- `setCustomValidity('')` clears a custom error; forget it and the field stays invalid.
- `:user-invalid` matches after the person changed the field or tried to submit; `:invalid` matches from the first paint.
- A required single select needs `<option value="">` first [html/required-select-placeholder].

## Submission

| Stack | Pattern |
| --- | --- |
| HTML | `<form action="/subscribe" method="post">` + `<button type="submit">`; works without JavaScript |
| JavaScript | `form.addEventListener('submit', …)`, `new FormData(form)`, `fetch(form.action, { method: 'POST', body: data })` |
| React 19 | `<form action={serverOrClientAction}>`; `useActionState` for the result, `useFormStatus` for the pending state |
| Vue | `<form @submit.prevent="onSubmit">` |
| SvelteKit | form actions in `+page.server.js`, `use:enhance` on the form |
| Angular | `<form [formGroup]="form" (ngSubmit)="save()">` |

Never put the logic on the button's click: Enter in a field submits the form, not the button's click handler [html/form-submit]. Keep the submit button enabled; show why the form cannot be sent.

## File inputs

```html
<label for="cv">CV (PDF, up to 5 MB)</label>
<input id="cv" name="cv" type="file" accept=".pdf,application/pdf">
```

- `accept` filters the picker but is not a check: verify type and size in script and on the server.
- `multiple` for several files, `capture="environment"` to open the camera on phones.
- Say the allowed types and size in the label or a hint.

## Sources

- HTML Standard, Forms: https://html.spec.whatwg.org/multipage/forms.html
- HTML Standard, input types: https://html.spec.whatwg.org/multipage/input.html
- HTML Standard, Autofill: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
- MDN, Client-side form validation: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
- MDN, Constraint validation API: https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation
- MDN, inputmode: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode
- MDN, :user-invalid: https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid
- web.dev, Learn Forms: https://web.dev/learn/forms
- web.dev, Sign-in form best practices: https://web.dev/articles/sign-in-form-best-practices
- React, form element: https://react.dev/reference/react-dom/components/form
