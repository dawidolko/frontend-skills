---
id: test/no-fixed-wait
title: Tests wait for conditions, never for a fixed time (no waitForTimeout, cy.wait(ms) or setTimeout sleeps).
severity: moderate
check: static
applies:
  - jsx
stack:
  - vitest
  - jest
  - playwright
  - cypress
skill: fe-testing
since: 0.1.0
sources:
  - title: Playwright, Page waitForTimeout (discouraged)
    url: https://playwright.dev/docs/api/class-page#page-wait-for-timeout
  - title: Cypress, Best Practices (unnecessary waiting)
    url: https://docs.cypress.io/app/core-concepts/best-practices#Unnecessary-Waiting
  - title: Vitest, Mocking timers
    url: https://vitest.dev/guide/mocking/timers
---

## Why

A fixed wait is either too short on a slow CI machine (the test flakes) or too long everywhere else (the suite crawls). Flaky tests teach the team to rerun and ignore failures.

## Fix

Wait for what the user waits for: Playwright web-first assertions (`await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`), Cypress route aliases (`cy.intercept(...).as('save')` then `cy.wait('@save')`) and assertions, Testing Library `findBy*` queries. In unit tests control time with fake timers (`vi.useFakeTimers()`, `jest.useFakeTimers()`).

## Examples

```js
// bad
await page.waitForTimeout(2000)
// good
await expect(page.getByRole('status')).toHaveText('Saved')
```
