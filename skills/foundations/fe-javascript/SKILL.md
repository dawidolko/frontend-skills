---
name: fe-javascript
description: Writes and reviews browser JavaScript (plain scripts, modules, framework script blocks) - equality, declarations, async and fetch errors, DOM events, assets through the bundler - so it fails loudly, stays fast and keeps working when moved. Use when writing or editing .js, .mjs, .jsx or a script block, debugging a silent failure or a listener leak, or asked to review JavaScript.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: JavaScript in the browser
  area: foundations
  lane: B
  requires: web
  globs: "**/*.js **/*.mjs **/*.cjs **/*.jsx **/*.ts **/*.tsx"
  rules: "js/strict-equality js/no-var js/no-eval js/document-write js/feature-detect js/throw-error-objects js/fetch-check-ok js/no-empty-catch js/no-floating-promises js/no-inline-handlers js/passive-listeners js/listener-cleanup js/asset-import"
  version: 0.1.0
---

# JavaScript in the browser

Read `.frontend-skills/profile.json` (bundler, framework, lint setup) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Compare with `===` and `!==` (js/strict-equality); declare with `const`, or `let` when reassigned, never `var` (js/no-var).
- Never run strings as code: no `eval`, `new Function`, or string timers (js/no-eval); no `document.write` (js/document-write).
- Detect features (`'share' in navigator`, `CSS.supports`), never parse `navigator.userAgent` (js/feature-detect).
- Throw and reject `Error` objects, with `{ cause }` when rethrowing (js/throw-error-objects).
- Check `res.ok` before reading a `fetch` body (js/fetch-check-ok); give requests a `signal` to cancel or time out.
- Never leave a `catch` empty (js/no-empty-catch); await, return or `.catch()` every promise (js/no-floating-promises).
- Attach handlers with `addEventListener` from a module, not `onclick="..."` attributes (js/no-inline-handlers).
- Make `touchstart`, `touchmove` and `wheel` listeners `{ passive: true }` unless they call `preventDefault()` (js/passive-listeners).
- Remove what a view starts (listeners, timers, observers) when it goes away; one `AbortController` signal ends them all (js/listener-cleanup).
- Import images, fonts and media or use the base-path helper; never hard-code `/images/...` in components (js/asset-import).
- Read layout (`getBoundingClientRect`, `offsetWidth`) before writing styles, never alternating in a loop.

## Do this

1. Load app code as modules: `<script type="module" src>` (deferred and strict by default). A classic script in `<head>` gets `defer` (perf/render-blocking-script).
2. Insert text with `textContent`; markup from users only through a sanitizer (see the `fe-security` skill).
3. Wrap `fetch` once: a helper that adds `signal` (`AbortSignal.any([controller.signal, AbortSignal.timeout(8000)])`), checks `ok`, throws an `Error` with the status, and parses JSON. Show loading, empty and error states where it is called.
4. Use event delegation for lists and tables: one listener on the container, `event.target.closest('[data-id]')`.
5. Split rarely used features with `import()`; keep work off the main thread when a handler takes longer than about 50 ms (`scheduler.yield()` where supported, or `setTimeout` chunks).
6. In TypeScript files also follow `fe-typescript`; in a framework, its skill decides where effects and listeners live.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` reports loose equality, `var`, eval, `document.write`, user-agent sniffing, thrown literals, unchecked `fetch`, empty catches, inline handlers, non-passive scroll listeners and hard-coded asset paths.
- Run the project's ESLint (`eqeqeq`, `no-var`, `no-implied-eval`, `no-empty`); with TypeScript, the typed rule `@typescript-eslint/no-floating-promises`.
- In DevTools, the Performance panel's "Forced reflow" warnings and the Memory panel after navigating away and back show thrashing and leaks.

## References

- [references/javascript.md](references/javascript.md): async patterns, fetch wrapper, DOM and event patterns, W3Schools conventions and where they are dated. Read it when writing a data call, an event-heavy widget or a plain-JS site.
