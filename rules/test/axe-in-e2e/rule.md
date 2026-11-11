---
id: test/axe-in-e2e
title: End-to-end tests run an axe scan with the WCAG tags you target on each key page and state, and fail on violations.
severity: moderate
check: manual
applies:
  - jsx
stack:
  - playwright
  - cypress
  - vitest
  - jest
skill: fe-testing
since: 0.1.0
sources:
  - title: Playwright, Accessibility testing
    url: https://playwright.dev/docs/accessibility-testing
  - title: axe-core, API (tags)
    url: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
---

## Why

Accessibility regressions (an unlabeled field, a contrast change, a broken dialog name) arrive with ordinary feature work. A scan in the e2e suite catches the automatable part on every pull request, including states the static audit cannot see (open menus, error messages, dialogs).

## Fix

Use `@axe-core/playwright` (or `cypress-axe`, `jest-axe` / `vitest-axe` for component tests as a smoke check), restrict to the WCAG tags you target (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`), scan again after opening menus and dialogs, and track known issues by rule id and selector, not by snapshotting the whole result. Say in reports that automated checks find only part of the problems.

## Examples

```js
import AxeBuilder from '@axe-core/playwright'
test('checkout has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/checkout')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(results.violations).toEqual([])
})
```
