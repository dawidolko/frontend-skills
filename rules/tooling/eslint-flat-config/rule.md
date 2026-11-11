---
id: tooling/eslint-flat-config
title: ESLint is configured in eslint.config.* (flat config); .eslintrc files and .eslintignore are migrated, not kept beside it.
severity: moderate
check: manual
applies:
  - project
stack:
  - eslint
skill: fe-tooling
since: 0.1.0
sources:
  - title: ESLint, Configuration files
    url: https://eslint.org/docs/latest/use/configure/configuration-files
  - title: ESLint, Configuration migration guide
    url: https://eslint.org/docs/latest/use/configure/migration-guide
---

## Why

ESLint 10 reads only `eslint.config.js` (or `.mjs`, `.cjs`, `.ts`); an `.eslintrc*` file or an `eslintConfig` key in `package.json` is no longer used, and `.eslintignore` is not read. A project that upgraded without migrating lints with a config nobody wrote, or not at all, while the old file suggests otherwise. Next.js 16 also removed `next lint`.

## Fix

Migrate with `npx @eslint/migrate-config .eslintrc.json`, move ignore patterns into an `ignores` entry (or `globalIgnores()`), delete the old files, and run `eslint .` from a package script. A TypeScript config file (`eslint.config.ts`) needs `jiti` as a dev dependency on Node.

## Examples

```js
// eslint.config.js
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
export default defineConfig([globalIgnores(['dist/']), js.configs.recommended])
```
