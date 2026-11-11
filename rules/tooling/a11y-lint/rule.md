---
id: tooling/a11y-lint
title: The linter runs the framework's accessibility rules (jsx-a11y, vuejs-accessibility, angular-eslint template, Svelte a11y warnings).
severity: minor
check: manual
applies:
  - project
stack:
  - eslint
  - svelte
skill: fe-tooling
since: 0.1.0
sources:
  - title: eslint-plugin-jsx-a11y
    url: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
  - title: eslint-plugin-vuejs-accessibility
    url: https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility
  - title: Svelte, compiler warnings (a11y)
    url: https://svelte.dev/docs/svelte/compiler-warnings
---

## Why

Lint runs on every save and every pull request, before any audit. Accessibility lint rules catch missing labels, `alt` and keyboard handlers while the code is being written, in every component, including what the static audit skips.

## Fix

React: `eslint-plugin-jsx-a11y` (`recommended`). Vue: `eslint-plugin-vuejs-accessibility`. Angular: the accessibility rules of `@angular-eslint/eslint-plugin-template`. Svelte: keep the compiler's `a11y_*` warnings on and require a comment with a reason for each ignore. Lit: `eslint-plugin-lit-a11y`. Check the plugin supports the installed ESLint major before upgrading ESLint.

## Examples

```js
// eslint.config.js (React)
import jsxA11y from 'eslint-plugin-jsx-a11y'
export default [jsxA11y.flatConfigs.recommended]
```
