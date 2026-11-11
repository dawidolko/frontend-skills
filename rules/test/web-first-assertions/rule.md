---
id: test/web-first-assertions
title: Playwright tests assert with auto-retrying web-first matchers (toBeVisible, toHaveText), not on values read once.
severity: moderate
check: static
applies:
  - jsx
stack:
  - playwright
skill: fe-testing
since: 0.1.0
sources:
  - title: Playwright, Best Practices (use web first assertions)
    url: https://playwright.dev/docs/best-practices#use-web-first-assertions
  - title: Playwright, Assertions
    url: https://playwright.dev/docs/test-assertions
---

## Why

`expect(await locator.isVisible()).toBe(true)` reads the page once, at whatever moment the line runs. If the element appears 50 ms later the test fails, so it passes on a fast machine and flakes in CI.

## Fix

Use the matcher that waits: `await expect(locator).toBeVisible()`, `toHaveText`, `toHaveValue`, `toHaveAttribute`, `toHaveCount`, `toBeChecked`, `toHaveURL`. Locate with user-facing locators (`getByRole`, `getByLabel`, `getByText`).

## Examples

```js
// bad
expect(await page.getByRole('status').isVisible()).toBe(true)
// good
await expect(page.getByRole('status')).toBeVisible()
```
