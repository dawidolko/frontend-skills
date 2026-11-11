# Testing: sources and candidate rules

Read on 2026-11-11. Versions, licences and unpacked sizes come from the npm registry (`registry.npmjs.org/<pkg>/latest`)
on that day. All test tools below are dev dependencies: they add nothing to the shipped bundle, so "size" here means
install weight only (npm unpacked size), not min+gz.

Primary sources:

- Testing Library, guiding principles: https://testing-library.com/docs/guiding-principles
- Testing Library, query priority: https://testing-library.com/docs/queries/about#priority
- Testing Library, user-event: https://testing-library.com/docs/user-event/intro
- Vitest browser mode: https://vitest.dev/guide/browser/ ; reporters: https://vitest.dev/guide/reporters ; config: https://vitest.dev/config/ ; environment: https://vitest.dev/config/environment
- Vitest 4 announcement (browser mode stable): https://vitest.dev/blog/vitest-4 ; Vitest 5: https://vitest.dev/blog/vitest-5
- Jest configuration: https://jestjs.io/docs/configuration ; CLI: https://jestjs.io/docs/cli
- Node.js test runner: https://nodejs.org/api/test.html
- Playwright best practices: https://playwright.dev/docs/best-practices ; locators: https://playwright.dev/docs/locators ; auto-waiting: https://playwright.dev/docs/actionability ; assertions: https://playwright.dev/docs/test-assertions ; Page API (discouraged methods): https://playwright.dev/docs/api/class-page ; configuration: https://playwright.dev/docs/test-configuration ; retries: https://playwright.dev/docs/test-retries ; reporters: https://playwright.dev/docs/test-reporters ; screenshots: https://playwright.dev/docs/test-snapshots ; accessibility testing: https://playwright.dev/docs/accessibility-testing
- Cypress best practices: https://docs.cypress.io/app/core-concepts/best-practices ; retries / flaky tests: https://docs.cypress.io/app/guides/test-retries
- Storybook testing: https://storybook.js.org/docs/writing-tests ; accessibility tests: https://storybook.js.org/docs/writing-tests/accessibility-testing
- axe-core tags: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
- jest-axe README: https://github.com/NickColley/jest-axe ; vitest-axe README: https://github.com/chaance/vitest-axe
- MSW: https://github.com/mswjs/msw ; licence: https://github.com/mswjs/msw/blob/main/LICENSE.md ; v3.0.0 release notes: https://github.com/mswjs/msw/releases/tag/v3.0.0
- ESLint plugins (rule names read from each README): eslint-plugin-playwright https://github.com/mskelton/eslint-plugin-playwright ; eslint-plugin-testing-library https://github.com/testing-library/eslint-plugin-testing-library ; @vitest/eslint-plugin https://github.com/vitest-dev/eslint-plugin-vitest ; eslint-plugin-jest https://github.com/jest-community/eslint-plugin-jest ; eslint-plugin-cypress https://github.com/cypress-io/eslint-plugin-cypress
- Opinions (labelled as such): Kent C. Dodds, "The Testing Trophy and Testing Classifications" (2021-06-03) https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications ; Ham Vocke, "The Practical Test Pyramid" (2018-02-26) https://martinfowler.com/articles/practical-test-pyramid.html

## Tool facts (for detection and for skill text)

| tool | latest (npm, 2026-11-11) | released | licence (registry) | Node engines | detect by | notes |
|---|---|---|---|---|---|---|
| vitest | 5.1.0 | 2026-11-02 | MIT | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` | `vitest.config.{ts,mts,cts,js,mjs,cjs}`, else `test` key in `vite.config.*`; `vitest` in devDependencies | `vitest.config` wins over `vite.config`; JSON config not supported (vitest.dev/config). Vitest 5 needs Vite >= 6.4.0 and Node >= 22.12.0 (vitest.dev/blog/vitest-5). Default environment is `node`; DOM tests need `jsdom`, `happy-dom` or browser mode (vitest.dev/config/environment). Vitest 5: `clearMocks` defaults to `true`, browser-mode locators strict by default. |
| jest | 30.5.2 | 2026-09-18 | MIT | `^18.14.0 \|\| ^20.0.0 \|\| ^22.0.0 \|\| >=24.0.0` | `jest.config.{js,ts,mjs,mts,cjs,cts,json}` or `"jest"` key in package.json | Default `testEnvironment` is `node`; DOM needs `jest-environment-jsdom` (jestjs.io/docs/configuration). |
| node:test | built into Node | – | (Node) | – | `node --test` in scripts; `import test from 'node:test'` | Stable (stability 2) since v20.0.0; watch and coverage still experimental; snapshot testing stable since v23.4.0; has `mock.fn`, `mock.timers`, `t.mock.method` (nodejs.org/api/test.html, docs for v26.13.0). No DOM: fine for pure logic, not for components. |
| @playwright/test | 1.65.0 | 2026-11-05 | Apache-2.0 | `>=20` | `playwright.config.{ts,js}`; `@playwright/test` dep; `*.spec.ts` under `tests/` or `e2e/` | Unpacked 28.5 kB (browsers downloaded separately). |
| cypress | 16.3.0 | 2026-11-10 | MIT | `^22.0.0 \|\| ^24.0.0 \|\| >=26.0.0` | `cypress.config.{js,ts}` (docs.cypress.io test-retries page); `cypress/` folder | Unpacked 3.9 MB plus binary. |
| @testing-library/react | 16.3.3 | – | MIT | `>=18` | dep present | Peer of `@testing-library/dom` 10.4.2 (MIT). |
| @testing-library/user-event | 14.6.9 | – | MIT | `>=12` | dep present | Use `userEvent.setup()` per test. |
| @testing-library/jest-dom | 7.0.1 | – | MIT | `>=22` | dep present | Matchers such as `toBeInTheDocument`. |
| storybook / @storybook/addon-vitest / @storybook/addon-a11y | 10.6.7 | 2026-11-10 | MIT | – | `.storybook/main.*`; `@storybook/addon-vitest` | Vitest addon is the primary runner (uses Vitest browser mode); `@storybook/test-runner` 0.26.0 is the fallback "if you cannot use the Vitest addon" (storybook.js.org/docs/writing-tests, docs 10.6). |
| @vitest/browser-playwright | 5.1.0 | 2026-11-02 | MIT | – | dep present; `browser.enabled` in config | Browser mode lost its experimental tag in Vitest 4 (2025-10-22, vitest.dev/blog/vitest-4). Providers: `playwright` (recommended), `webdriverio` (`@vitest/browser-webdriverio` 5.0.0), `preview` (default locally, simulates events, not for CI). |
| @axe-core/playwright | 4.14.0 | – | MPL-2.0 | `>=22.12.0` | import in e2e files | Unpacked 47.8 kB; axe-core 4.14.0 (MPL-2.0). |
| jest-axe | 11.0.0 | 2026-07-26 | MIT | `>= 18.0.0` | import in tests | Unpacked 20.2 kB. Turns colour-contrast off because JSDOM cannot compute it (README). |
| vitest-axe | 0.1.0 (pre tag 1.0.0-pre.5) | 2022-10-21 | MIT | – | import in tests | Latest stable is 4 years old. README: does not work when the Vitest environment is `happy-dom`. |
| msw | 3.0.5 | 2026-11-11 | MIT (LICENSE.md, Artem Zakharchenko) | `>=22.12.0` | `msw` dep; `mockServiceWorker.js` in public dir (not confirmed on a primary page, see Not verified) | Unpacked 3.39 MB. v3.0.0 (2026-09-28): ESM-only, Node 22+, TypeScript 5.9+, `onUnhandledRequest` renamed `onUnhandledFrame`, GraphQL moved to `msw/graphql`, `worker.stop()` returns a Promise, new Vite plugin, can intercept page navigations and form submissions. |

## Unit and component tests

Severity is in the column `sev`.

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| testing/query-by-role-first | Find elements the way a user or assistive technology would, starting with `getByRole` (with `name`), then label, placeholder, text, display value; use `getByTestId` only when nothing user-facing works. | Role/name queries break when the UI really breaks and also catch missing accessible names; test ids are invisible to users. | Testing Library, queries/about#priority | React, Vue, Svelte, Angular, plain DOM | static: in `*.test.*`/`*.spec.*`, count `getByTestId(`/`findByTestId(` vs `ByRole(`; flag files where test-id queries are the majority; eslint-plugin-testing-library `no-test-id-queries` (opt-in) | warning | `getByTestId('submit')` → `getByRole('button', { name: /send/i })` | – |
| testing/no-dom-node-access | Do not reach into the DOM with `container.querySelector`, `.firstChild`, `.parentElement` and similar; query through `screen`. | Couples the test to markup structure instead of behaviour. | Testing Library guiding principles; eslint-plugin-testing-library `no-node-access`, `no-container`, `prefer-screen-queries` | component tests | static: `container.querySelector`, `.closest(`, `.firstChild` in test files | warning | `container.querySelector('.btn')` → `screen.getByRole('button', …)` | – |
| testing/user-event-over-fire-event | Drive interactions with `user-event` (created with `userEvent.setup()` inside the test) rather than `fireEvent`. | `user-event` fires the full event sequence and refuses actions a browser would block (hidden or disabled targets). | Testing Library, user-event/intro | component tests | static: `fireEvent.` in test files; rule `prefer-user-event` | info | `fireEvent.click(btn)` → `await user.click(btn)` | – |
| testing/await-async | Always `await` `findBy*`, `waitFor`, `user.*` calls and async matchers. | A missing `await` lets the test end before the assertion runs, giving false passes. | Testing Library queries/about (findBy returns a Promise); rules `await-async-queries`, `await-async-utils`, `await-async-events`; Vitest 5 now fails unawaited `resolves`/`rejects` (vitest.dev/blog/vitest-5) | any | static: `findBy`/`waitFor(`/`user.` call not preceded by `await`/`return`; typed lint `@typescript-eslint/no-floating-promises` | error | `screen.findByText('Saved')` → `await screen.findByText('Saved')` | – |
| testing/no-focused-tests | Never commit `.only` on `it`, `test` or `describe`. | It silently skips every other test in CI. | Playwright config `forbidOnly`; rules `no-focused-tests` (Vitest, Jest), `no-focused-test` (Playwright) | any | static: regex `\b(it\|test\|describe\|context)\.only\s*\(` and `fit(`/`fdescribe(` in test files | error | `test.only(` → `test(` | – |
| testing/no-unexplained-skip | A skipped test (`.skip`, `xit`, `test.todo`) should carry a reason or a linked issue. | Skips rot and hide regressions. | rules `no-disabled-tests` (Vitest, Jest), `no-skipped-test` (Playwright) | any | static: `.skip(` / `xit(` / `xdescribe(` without a comment on the same or previous line | info | `it.skip('x')` → `it.skip('x') // flaky on CI, see #123` | – |
| testing/test-has-assertion | Every test should assert something (`expect`, a web-first assertion, or a `findBy` that throws). | A test with no assertion passes whatever happens. | rule `expect-expect` (Vitest, Jest) | any | static: test body with no `expect`/`assert`/`findBy` | warning | – | – |
| testing/dom-environment-declared | A test that renders components must run in a DOM environment (jsdom, happy-dom, or Vitest browser mode), set in config or per file. | Vitest and Jest both default to `node`, where `document` is undefined. | vitest.dev/config/environment; jestjs.io/docs/configuration (`testEnvironment` default `node`) | component tests | static: component test imports `@testing-library/*` but config has no `environment`/`testEnvironment`/`browser.enabled` and file has no `@vitest-environment` / `@jest-environment` docblock | warning | – | – |
| testing/real-browser-for-layout | Use a real browser (Vitest browser mode, Storybook Vitest addon, Playwright component or e2e) for anything that depends on layout, CSS, focus order, `IntersectionObserver` or colour contrast. | jsdom/happy-dom do not lay out or paint; jest-axe disables contrast in JSDOM for that reason. | vitest.dev/guide/browser; jest-axe README | component tests | manual (judge per test) | info | contrast assertion in jsdom → move to browser mode | `@vitest/browser-playwright@5.1.0`, MIT, unpacked 61 kB (npm) |
| testing/vitest-browser-provider-ci | In CI, run Vitest browser mode with the `playwright` or `webdriverio` provider, not `preview`. | `preview` simulates events and cannot run headless. | vitest.dev/guide/browser | Vitest | static: `browser.provider` is `preview` (or `@vitest/browser-preview` import) in a config used by CI | warning | `preview()` → `playwright()` | – |
| testing/fake-timers-not-sleeps | In unit tests, control time with fake timers (`vi.useFakeTimers`, `jest.useFakeTimers`, `mock.timers`) instead of awaiting real `setTimeout` sleeps. | Real sleeps slow the suite and are a classic flake source under CI load. | nodejs.org/api/test.html (mock.timers); Cypress test-retries (timing as flake cause) | unit tests | static: `new Promise(r => setTimeout(r,` or a `sleep(` helper inside test files | warning | `await sleep(500)` → `vi.advanceTimersByTime(500)` | – |

## End-to-end tests (Playwright and Cypress)

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| testing/pw-no-wait-for-timeout | Do not pause Playwright tests with `page.waitForTimeout()`; wait for a real condition instead. | Playwright marks it discouraged and for debugging only; fixed sleeps are both slow and flaky. | Playwright Page API, `page.waitForTimeout` (Discouraged); eslint-plugin-playwright `no-wait-for-timeout` | Playwright | static: `waitForTimeout(` in files importing `@playwright/test` | error | `await page.waitForTimeout(2000)` → `await expect(page.getByRole('alert')).toBeVisible()` | – |
| testing/pw-web-first-assertions | Assert with auto-retrying matchers (`await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`) rather than reading a value once and comparing it. | `expect(await el.isVisible()).toBe(true)` checks a single instant and flakes on async UI; retrying matchers wait up to the expect timeout (5 s default). | Playwright best practices ("Use web first assertions"); test-assertions; rule `prefer-web-first-assertions` | Playwright | static: `expect(await ` followed by `.isVisible(` / `.textContent(` / `.innerText(` / `.isChecked(` / `.getAttribute(` / `.count(` | warning | `expect(await btn.isVisible()).toBe(true)` → `await expect(btn).toBeVisible()` | – |
| testing/pw-user-facing-locators | Locate with `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByAltText`, `getByTitle`, and fall back to `getByTestId`; avoid long CSS/XPath chains. | Playwright calls DOM-path selectors a bad practice because they break when markup changes. | Playwright locators (quick guide order); best practices | Playwright | static: `page.locator('` with `//`, `>>`, `:nth-child`, or class selectors; `.nth(`/`.first()` (discouraged by locators page); rule `no-raw-locators` (opt-in) | warning | `page.locator('div.form > button.primary')` → `page.getByRole('button', { name: 'Save' })` | – |
| testing/pw-no-wait-for-selector | Replace `page.waitForSelector()` and `page.$()`/element handles with locators. | Both are discouraged/deprecated; locators auto-wait before acting. | Playwright Page API (waitForSelector Discouraged, `$` under Deprecated); rules `no-wait-for-selector`, `no-element-handle`, `prefer-locator` | Playwright | static: `waitForSelector(`, `page.$(`, `page.$$(`, `page.click(`, `page.fill(` | warning | `await page.click('#ok')` → `await page.getByRole('button', { name: 'OK' }).click()` | – |
| testing/pw-no-networkidle | Do not use `waitUntil: 'networkidle'` (or `waitForLoadState('networkidle')`) as a readiness signal. | Playwright marks it discouraged and points to web assertions instead. | Playwright Page API, `goto` option `waitUntil` | Playwright | static: `'networkidle'` string in Playwright files; rule `no-networkidle` | warning | `goto(url, { waitUntil: 'networkidle' })` → `goto(url)` + `await expect(heading).toBeVisible()` | – |
| testing/pw-no-force | Avoid `{ force: true }` on actions. | It skips actionability checks, so a click can "pass" on an element a user could not click. | Playwright actionability ("Forcing"); rule `no-force-option` | Playwright | static: `force: true` in Playwright files | warning | – | – |
| testing/pw-await-everything | Await every Playwright action and assertion. | A floating promise makes the step race the rest of the test. | Playwright best practices ("Lint your tests", `@typescript-eslint/no-floating-promises`); rule `missing-playwright-await` | Playwright | static: lint rules named; `tsc --noEmit` on CI as Playwright suggests | error | `expect(page).toHaveURL(/done/)` → `await expect(page).toHaveURL(/done/)` | – |
| testing/pw-no-page-pause | Do not commit `page.pause()`. | It blocks headless CI runs. | rule `no-page-pause` | Playwright | static: `page.pause(` | error | – | – |
| testing/pw-forbid-only-on-ci | Set `forbidOnly: !!process.env.CI` and modest CI retries (Playwright's template uses 2) in `playwright.config`. | A stray `.only` then fails CI instead of passing a tiny subset. | Playwright test-configuration | Playwright | static: `playwright.config.*` without `forbidOnly` | warning | – | – |
| testing/e2e-isolated | Each e2e test must pass alone, creating its own state in `beforeEach` (or a setup project for login) and not depending on test order. | Coupled tests cannot be retried, sharded or run in parallel. | Playwright best practices ("Make tests as isolated as possible"); Cypress best practices ("Having tests rely on the state of previous tests") | any e2e | runtime: run one test alone (`--grep`) and in shuffled/parallel mode | warning | – | – |
| testing/e2e-own-backend-only | Test only what you control; stub third-party services (`page.route`, `cy.intercept`, MSW) instead of hitting them. | External sites are slow, change, rate-limit and block automation. | Playwright best practices ("Avoid testing third-party dependencies"); Cypress best practices ("Visiting external sites") | any e2e | static: `goto('https://` to a host that is not `baseURL`; manual review | info | – | – |
| testing/cy-no-fixed-wait | Do not use `cy.wait(<number>)`; wait on a route alias or an assertion. | Cypress lists it as an anti-pattern; commands already retry. | Cypress best practices ("Unnecessary waiting"); eslint-plugin-cypress `no-unnecessary-waiting` | Cypress | static: `cy.wait(` with a numeric literal | error | `cy.wait(3000)` → `cy.wait('@getUser')` | – |
| testing/cy-no-assigned-commands | Do not store Cypress command results in `const`/`let`; use aliases or `.then`. | Commands are queued and asynchronous, so the variable is not the value. | Cypress best practices ("Assigning return values"); rule `no-assigning-return-values` | Cypress | static: `= cy.` | warning | `const btn = cy.get('button')` → `cy.get('button').as('btn')` | – |
| testing/cy-reset-before-not-after | Reset state in `before`/`beforeEach`, not in `after`/`afterEach`. | Cleanup in `after*` is skipped when a run is interrupted. | Cypress best practices ("Using after or afterEach hooks") | Cypress | static: `afterEach(` containing DB/API reset calls (heuristic) | info | – | – |

Note on selector advice: Cypress ranks `data-cy` attributes as "always" and `cy.contains()`/role queries as "depends",
while Testing Library and Playwright put role queries first. A skill should follow the tool the project already uses
and not rewrite a working `data-cy` suite; for new tests, role-first selectors also exercise accessible names.

## Accessibility checks inside tests

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| testing/a11y-axe-in-e2e | Run an axe scan on each key page or state in e2e tests and fail on violations of the chosen WCAG tags. | Cheap regression net for the problems a machine can find. | Playwright accessibility-testing | Playwright | static: e2e folder has no import of `@axe-core/playwright` → suggest; runtime: axe | info | – | `@axe-core/playwright@4.14.0`, MPL-2.0, unpacked 47.8 kB (npm); official Deque binding used in Playwright's own docs |
| testing/a11y-wcag-tags | Restrict the axe run to WCAG tags that match the target, e.g. `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, plus `wcag22aa` for WCAG 2.2 AA. | Without tags axe also runs `best-practice` rules, mixing advice with requirements. | Playwright accessibility-testing (first four tags); axe-core API.md tag table (`wcag22aa` = WCAG 2.2 Level AA) | any axe use | static: `new AxeBuilder(` without `.withTags(` | info | – | – |
| testing/a11y-scan-after-interaction | Scan again after opening menus, dialogs, error states, etc., because axe only sees the current DOM. | Hidden UI is not checked until it is shown. | Playwright accessibility-testing (`analyze()` scans current state) | any | manual | info | – | – |
| testing/a11y-no-raw-violation-snapshots | Do not snapshot the whole `violations` array; if you track known issues, snapshot rule id + target selectors only. | The array contains HTML snippets that change on every markup edit. | Playwright accessibility-testing | Playwright | static: `toMatchSnapshot()` on `.violations` | info | – | – |
| testing/a11y-unit-axe-limits | Treat jest-axe / vitest-axe as a smoke check: no contrast in jsdom, and vitest-axe does not work under happy-dom. | False confidence otherwise. | jest-axe README; vitest-axe README | unit tests | static: `vitest-axe` import with `environment: 'happy-dom'` → error | warning (error for the happy-dom case) | – | `jest-axe@11.0.0`, MIT, unpacked 20 kB (npm). `vitest-axe@0.1.0` MIT, last stable 2022: prefer browser-mode or Playwright axe for new work |
| testing/storybook-a11y-error-in-ci | If Storybook a11y checks should gate CI, set `parameters.a11y.test` to `'error'`; `'todo'` produces no output in CI. | Teams believe a11y is checked when it is not. | Storybook accessibility-testing | Storybook | static: `.storybook/preview.*` with `a11y: { test: 'todo' }` or no `test` key while addon-vitest is installed | warning | `test: 'todo'` → `test: 'error'` (after fixing existing violations) | `@storybook/addon-a11y@10.6.7`, MIT (npm) |
| testing/a11y-automation-is-partial | State in every report that automated checks find only part of accessibility problems; keyboard, screen-reader, focus order, meaningful text and alt quality need a person. | Avoids a false "accessible" verdict. | Playwright accessibility-testing (automated tests catch "some common" issues; recommends manual and user testing); jest-axe README (says GDS testing found about 30% of access barriers are missed by automated tools); Storybook a11y page (cites axe-core finding up to 57% of WCAG issues) | any | manual | info | "a11y tests pass, so it's accessible" → "axe found no violations for tags X; manual checks still needed" | – |

## Visual regression (brief)

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| testing/visual-same-environment | Create and compare screenshot baselines on the same OS, browser version and settings (normally the CI container). | Rendering differs by OS, hardware, fonts and headless mode; Playwright stores baselines per browser and platform. | Playwright test-snapshots | Playwright `toHaveScreenshot`, Vitest `toMatchScreenshot` (browser mode, since v4) | manual; static: baseline files only for `-darwin`/`-win32` while CI is Linux | warning | – | – |
| testing/visual-stabilise | Hide or mask volatile content (dates, ads, carets, animations) and keep tolerances explicit (`threshold`, default 0.2; `maxDiffPixels`, unset by default). | Otherwise diffs are noise and people stop reading them. | Playwright test-snapshots (`stylePath`, thresholds) | screenshot tests | static: `toHaveScreenshot(` with no `mask`/`stylePath` on pages with clocks (heuristic) | info | – | – |

## Network mocking

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| testing/mock-at-network-level | Mock HTTP at the network boundary with shared request handlers (MSW in browser and Node, or `page.route`/`cy.intercept` in e2e) instead of stubbing `fetch` per test. | One set of handlers serves unit, component, e2e and local dev, and the app code runs unchanged. | MSW README | any | static: `vi.spyOn(global, 'fetch')` / `jest.fn()` assigned to `global.fetch` repeated across many files (heuristic) | info | `global.fetch = vi.fn()` → `server.use(http.get('/api/user', …))` | `msw@3.0.5`, MIT (LICENSE.md), unpacked 3.39 MB (npm); dev-only |
| testing/msw-v3-migration | When `msw` is 3.x, flag v2 APIs: `onUnhandledRequest` (now `onUnhandledFrame`), `msw/native`, GraphQL from the root entry, non-awaited `worker.stop()`, Node < 22, CommonJS `require('msw')`. | v3 is ESM-only and renamed these. | MSW v3.0.0 release notes | projects with msw@3 | static: `package.json` msw `^3` + any of those strings | warning | `onUnhandledRequest: 'error'` → `onUnhandledFrame: 'error'` | – |
| testing/fail-on-unhandled-requests | Configure the mock server to error on requests no handler matches. | Silent pass-through to real endpoints hides missing mocks and causes flakes. | MSW v3 release notes (option name) | any MSW use | static: `setupServer(`/`setupWorker(` start call without an unhandled-request option | info | – | – |

## Flaky tests

Causes named by primary sources: animations, API call timing, test server or database availability, resource
availability, network problems (Cypress test-retries); non-retrying assertions on async pages, shared state between
tests, third-party dependencies, changing data (Playwright best practices, test-assertions). Playwright labels a test
"flaky" when it fails first and passes on retry, exits 0 in that case unless `--fail-on-flaky-tests` /
`failOnFlakyTests` is set, and suggests traces on first retry (playwright.dev/docs/test-retries). Cypress retries
default to 0 for both `runMode` and `openMode`.

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| testing/retries-are-not-fixes | Retries may stay on in CI, but flaky results must be reported and tracked, not hidden. | A retry that passes still means the test or the app is unreliable. | Playwright test-retries (`failOnFlakyTests`); Cypress test-retries | any | static: `retries` > 2 in config (heuristic); runtime: reporter's flaky count | info | – | – |
| testing/no-fixed-sleeps-anywhere | No fixed-time waits in any test layer (`waitForTimeout`, `cy.wait(n)`, `setTimeout` sleeps). | The most common, easiest-to-find flake source. | rows above | any | static: union of the three patterns | error | – | – |

## Testing pyramid vs trophy (opinions, not standards)

- Pyramid (Vocke, 2018): write tests at several granularities; the higher the level, the fewer tests; avoid an inverted
  "ice-cream cone". https://martinfowler.com/articles/practical-test-pyramid.html
- Trophy (Dodds, 2021): static checks at the base, then unit, a wide integration layer, few e2e; argues the mix matters
  less than confidence per unit of effort and tests that resemble real use.
  https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications
- Skill stance: present both as heuristics; never report "wrong shape" as a finding. Both agree on: many cheap checks
  (types, lint), few slow e2e tests, test behaviour not internals.

## Condensed output (token cost)

| tool | compact / machine output | source |
|---|---|---|
| Vitest | `--reporter=minimal` (alias `agent`): prints only failing tests and their errors; Vitest auto-selects it when it detects an AI coding agent and no reporter is configured. Also `--reporter=dot`; `--reporter=json --outputFile=out.json`. | vitest.dev/guide/reporters |
| Jest | `--json` (only JSON on stdout, logs to stderr), `--outputFile=<f>` (with `--json`), `--silent`, `--onlyFailures`, `--findRelatedTests <files>` | jestjs.io/docs/cli |
| node:test | `--test-reporter=dot` (also `spec` default, `tap`, `junit`, `lcov`) | nodejs.org/api/test.html |
| Playwright | `--reporter=dot` (CI default), `line`, `failures`; JSON via `--reporter=json` + `PLAYWRIGHT_JSON_OUTPUT_NAME=results.json` | playwright.dev/docs/test-reporters |
| Cypress | see Not verified | – |

Advice for skills: run only related tests first (`vitest related <files> --run`, from Vitest's CLI guide
https://github.com/vitest-dev/vitest/blob/main/docs/guide/cli.md; `jest --findRelatedTests <files>`), then the full suite once; read JSON/minimal output instead of the default pretty output.

## Notes for skill authors

- Short skill: the static rules with `error` severity (`.only`, fixed sleeps, missing awaits, `page.pause`), "role
  queries first", "web-first assertions", "a11y automation is partial", and "use the project's own test script and
  runner". Reference file: the full tables, plugin rule names, version facts, reporter flags.
- Most rules already exist as ESLint plugin rules. If the project has the plugin, tell the agent to run the project's
  lint script rather than re-implementing; our static checks are for projects without those plugins.
- Noisy / controversial: `query-by-role-first` (test ids are legitimate in Cypress culture and for dynamic text; keep
  at warning and only flag when test ids dominate), `mock-at-network-level`, pyramid vs trophy, `retries` thresholds.
- Changes often, recheck before each release: Vitest major (5 in Sept 2026, 4 in Oct 2025), Playwright minor monthly,
  MSW 3 migration details, Storybook test-runner vs Vitest addon status, vitest-axe maintenance, Node engine ranges.
- Do not detect test runners by file glob alone: check `package.json` scripts and devDependencies first, then config
  files.

## Not verified

- MSW worker file name `mockServiceWorker.js` and the exact `onUnhandledFrame` option semantics: the GitHub README did
  not name the file; only the v3 release notes were read for the rename. The OpenReplay article about a `msw/vite`
  plugin is third-party and not used.
- jest-axe's "about 30% missed" figure: read in the README only; the GDS blog post (2017) it links was not opened. Storybook's "up to 57%" figure is Storybook's/Deque's claim; Deque's own study was not opened. Use both only
  as "vendors say automated checks miss a large share".
- Cypress reporter flags for compact output (Cypress uses Mocha reporters): not read on a Cypress page today.
- Playwright config file `.js` variant: the configuration page only shows `playwright.config.ts`; the `.js` name is
  assumed common but not confirmed on that page.
- Vitest browser mode stability in v5: the v5 guide page does not label it; stability rests on the Vitest 4 post.
- `node:test` `mock.module` stability: section was truncated when read.
- Min+gz sizes: not measured; these are dev-only tools, so only npm unpacked size is given.
