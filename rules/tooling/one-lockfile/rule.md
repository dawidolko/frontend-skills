---
id: tooling/one-lockfile
title: A project has exactly one committed lockfile, and CI installs from it with the frozen command (npm ci, pnpm install --frozen-lockfile).
severity: moderate
check: manual
applies:
  - project
skill: fe-tooling
since: 0.1.0
sources:
  - title: npm Docs, npm ci
    url: https://docs.npmjs.com/cli/commands/npm-ci
  - title: pnpm, pnpm install (--frozen-lockfile)
    url: https://pnpm.io/cli/install
---

## Why

Two lockfiles (`package-lock.json` and `pnpm-lock.yaml`) disagree about versions, so developers, CI and production install different code. A missing lockfile, or a CI install that may update it, lets a new and possibly compromised version slip in between review and deploy.

## Fix

Keep the lockfile of the package manager in `packageManager` (or the one the team uses), delete the others, commit it, and install in CI with `npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable` or `bun install --frozen-lockfile`.

## Examples

```bash
# good: CI
corepack enable 2>/dev/null; pnpm install --frozen-lockfile
```
