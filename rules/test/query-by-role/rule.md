---
id: test/query-by-role
title: Tests find elements the way users do - getByRole with a name first, then label and text; test ids only as a last resort.
severity: minor
check: manual
applies:
  - jsx
stack:
  - testing-library
  - playwright
  - cypress
skill: fe-testing
since: 0.1.0
sources:
  - title: Testing Library, About Queries (priority)
    url: https://testing-library.com/docs/queries/about/#priority
  - title: Playwright, Locators
    url: https://playwright.dev/docs/locators
---

## Why

A test that clicks `getByRole('button', { name: 'Save' })` fails when the button loses its name or role, so it guards accessibility for free and survives markup refactors. A test that clicks `.btn-primary` or `[data-testid=save]` passes for a `div` that no keyboard or screen reader user can use.

## Fix

Query in this order: `getByRole` (with `name`), `getByLabel`, `getByPlaceholder`, `getByText`, `getByDisplayValue`, `getByAltText`, `getByTitle`, then `getByTestId`. Do not reach into the DOM with `container.querySelector`. Drive interactions with `@testing-library/user-event` (`userEvent.setup()` in each test) rather than `fireEvent`.

## Examples

```js
// bad
await user.click(container.querySelector('.btn-primary'))
// good
await user.click(screen.getByRole('button', { name: 'Save' }))
```
