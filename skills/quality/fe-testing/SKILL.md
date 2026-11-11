---
name: fe-testing
description: Writes reliable front-end tests with the project's own runner - unit and component tests with Vitest or Jest and Testing Library queries by role, end-to-end tests with Playwright 1.65 or Cypress, network mocking, accessibility scans with axe-core, without flakes. Use when adding or fixing tests, a flaky test or CI test setup, or when asked "test this component" or "write an e2e test".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Front-end testing
  area: quality
  lane: C
  requires: "vitest jest playwright cypress testing-library"
  globs: "**/*.test.* **/*.spec.* **/__tests__/** **/e2e/** **/tests/** **/cypress/** **/playwright.config.* **/vitest.config.*"
  rules: "test/no-focused-tests test/no-fixed-wait test/web-first-assertions test/query-by-role test/axe-in-e2e"
  version: 0.1.0
---

# Front-end testing

Read `.frontend-skills/profile.json` (its `testing` entries) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example the project's test command) wins over this skill.

## Rules

- Run tests through the project's own script and runner (`npm test`, `pnpm test:e2e`); never install a second runner.
- Never commit `.only`, `fit` or `fdescribe`; make CI refuse them (test/no-focused-tests).
- Wait for conditions, never for time: no `waitForTimeout`, `cy.wait(ms)` or sleeps (test/no-fixed-wait).
- In Playwright, assert with web-first matchers: `await expect(locator).toBeVisible()` (test/web-first-assertions).
- Find elements by role and name first, then label and text; test ids last (test/query-by-role).
- Scan key pages and states with axe-core and the WCAG tags you target; automated checks find only part of the problems (test/axe-in-e2e).
- Await every async call: `findBy*`, `user.*`, Playwright actions and assertions.
- Each test sets up its own state and passes alone; reset in `beforeEach`, not `afterEach`.
- Mock HTTP at the network boundary (MSW, `page.route`, `cy.intercept`); never hit third-party services.
- Every test asserts something a user would notice; no tests of implementation details.

## Do this

1. Read the profile and `package.json` scripts to find the runners: `vitest.config.*` (or `test` in `vite.config.*`), `jest.config.*`, `playwright.config.*`, `cypress.config.*`, `.storybook/`.
2. Component test: render, act with `userEvent.setup()`, assert on what is on screen (`getByRole`, `findByText`); in jsdom or happy-dom, or Vitest browser mode for anything that needs real layout.
3. End-to-end: one user journey per test, user-facing locators, web-first assertions, test data created through the API in `beforeEach` or a setup project for sign-in.
4. Add an axe scan to the e2e tests of each page type, and again after opening dialogs and menus.
5. When a test flakes: find the race (a missing await, a fixed wait, shared state), fix it, and keep retries only as a safety net that is reported.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` finds focused tests, fixed waits and one-shot Playwright assertions in `.js`, `.jsx` and `.tsx` test files.
- Run the project's lint with the runner's plugin (`eslint-plugin-vitest`, `eslint-plugin-jest`, `eslint-plugin-playwright`, `eslint-plugin-testing-library`) if it is installed.
- Run the changed tests alone and several times (`--repeat-each=5` in Playwright) before calling them stable.

## References

- [references/testing.md](references/testing.md): runner and version table, query priority, Playwright and Cypress patterns, network mocking with MSW 3, axe-core setup per runner, flaky test causes, compact reporters for agents. Read it when setting up tests or fixing a flaky one.
