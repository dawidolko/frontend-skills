# Front-end testing reference

Depth for the `fe-testing` skill. Rule ids in brackets: `frontend-skills explain <id>`. Versions from the npm registry on 2026-11-11.

## Tools

| Tool | Version | Detect by | Note |
| --- | --- | --- | --- |
| Vitest | 5.1.0 | `vitest.config.*`, or `test` in `vite.config.*` | Needs Node 22.12+ and Vite 6.4+; browser mode is stable since Vitest 4 |
| Jest | 30.5.2 | `jest.config.*` or `"jest"` in `package.json` | Default environment is `node`; DOM needs `jest-environment-jsdom` |
| Playwright Test | 1.65.0 | `playwright.config.*` | Browsers downloaded separately |
| Cypress | 16.3.0 | `cypress.config.*`, `cypress/` | Node 22+ |
| Testing Library | `@testing-library/react` 16.3.3, `user-event` 14.6.9, `jest-dom` 7.0.1 | dependency | Vue, Svelte and Angular variants exist |
| MSW | 3.0.5 | `msw` dependency | v3 is ESM-only, Node 22+; its release notes rename the unhandled-request option (check the migration guide) |
| axe for Playwright | `@axe-core/playwright` 4.14.0 (MPL-2.0) | import in e2e | Dev dependency only |
| Storybook | 10.6.7 | `.storybook/` | `@storybook/addon-vitest` runs stories as tests; `addon-a11y` with `parameters.a11y.test: 'error'` |

## Query priority [test/query-by-role]

1. `getByRole('button', { name: 'Save' })`
2. `getByLabel('Email')`
3. `getByPlaceholder`, `getByText`, `getByDisplayValue`
4. `getByAltText`, `getByTitle`
5. `getByTestId` (dynamic text, canvas, last resort)

`getBy*` throws when missing, `queryBy*` returns null (for "is not there"), `findBy*` waits (await it).

```js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('shows an error for an invalid email', async () => {
  const user = userEvent.setup()
  render(<SignUp />)
  await user.type(screen.getByLabelText('Email'), 'nope')
  await user.click(screen.getByRole('button', { name: 'Sign up' }))
  expect(await screen.findByText('Enter an email address like name@example.com')).toBeInTheDocument()
})
```

## Playwright [test/web-first-assertions, test/no-fixed-wait, test/no-focused-tests]

```js
// playwright.config.js
export default {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: { trace: 'on-first-retry' },
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list'
}
```

| Avoid | Use |
| --- | --- |
| `page.waitForTimeout(2000)` | `await expect(locator).toBeVisible()` |
| `page.$('.btn')`, `waitForSelector` | `page.getByRole('button', { name })` |
| `waitUntil: 'networkidle'` | Wait for the element or response you need |
| `{ force: true }` | Fix what covers the element |
| `expect(await l.isVisible()).toBe(true)` | `await expect(l).toBeVisible()` |
| Real third-party calls | `page.route('**/api.stripe.com/**', …)` |

## Cypress

- Wait on aliases: `cy.intercept('POST', '/api/profile').as('save')` then `cy.wait('@save')`.
- Do not assign command results to variables; chain or use aliases.
- Reset state in `beforeEach`, and log in with `cy.session`.

## Network mocking

```js
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
export const server = setupServer(http.get('/api/user', () => HttpResponse.json({ name: 'Anna' })))
beforeAll(() => server.listen({ onUnhandledRequest: 'error' })) // MSW 2 name; MSW 3 renamed this option
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Accessibility in tests [test/axe-in-e2e]

| Runner | Package | Note |
| --- | --- | --- |
| Playwright | `@axe-core/playwright` | `new AxeBuilder({ page }).withTags([...]).analyze()` |
| Cypress | `cypress-axe` | `cy.injectAxe(); cy.checkA11y()` |
| Jest | `jest-axe` 11.0.0 | jsdom cannot compute contrast; smoke check only |
| Vitest | Browser mode plus axe-core | `vitest-axe` 0.1.0 is old and does not work under happy-dom |
| Storybook | `@storybook/addon-a11y` | `parameters: { a11y: { test: 'error' } }` to fail CI |

Tags for WCAG 2.2 AA: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`. axe does not test closed menus or unopened dialogs: open them and scan again.

## Flaky tests

| Cause | Fix |
| --- | --- |
| Missing `await` | Await every action and assertion; turn on the lint rule |
| Fixed wait | Wait for a condition |
| Shared state between tests | Create data per test; reset in `beforeEach` |
| Order dependence | Run one test alone (`--grep`, `-t`) to prove isolation |
| Animations, time, randomness | Reduced motion in config, fake timers, seeded data |
| Real network | Mock at the boundary |

## Compact output for agents

| Runner | Short output |
| --- | --- |
| Vitest | `vitest run --reporter=dot` (or `--reporter=json --outputFile=…`) |
| Jest | `jest --silent` plus `--json --outputFile=…` |
| Playwright | `--reporter=line` or `--reporter=json` |

## Sources

- Testing Library, queries: https://testing-library.com/docs/queries/about/
- Testing Library, user-event: https://testing-library.com/docs/user-event/intro
- Playwright, best practices: https://playwright.dev/docs/best-practices
- Playwright, accessibility testing: https://playwright.dev/docs/accessibility-testing
- Vitest guide: https://vitest.dev/guide/
- Cypress, best practices: https://docs.cypress.io/app/core-concepts/best-practices
- MSW: https://mswjs.io/docs/
- Storybook, accessibility tests: https://storybook.js.org/docs/writing-tests/accessibility-testing
