---
id: test/no-focused-tests
title: No focused tests (.only, fit, fdescribe) are committed; they silently skip the rest of the suite.
severity: serious
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
  - title: Playwright, Test configuration (forbidOnly)
    url: https://playwright.dev/docs/api/class-testconfig#test-config-forbid-only
  - title: Vitest, Test API (test.only)
    url: https://vitest.dev/api/#test-only
---

## Why

One `.only` left in a commit makes the runner execute that test alone and report success. CI turns green while every other test is skipped, so regressions merge unnoticed.

## Fix

Remove `.only`, `fit` and `fdescribe` before committing. Make CI refuse them: Playwright `forbidOnly: !!process.env.CI`, Vitest `--allowOnly=false` (the default in CI), or the lint rules `vitest/no-focused-tests`, `jest/no-focused-tests`, `mocha/no-exclusive-tests` for Cypress.

## Examples

```js
// bad
it.only('adds an item', () => {})
// good
it('adds an item', () => {})
```
