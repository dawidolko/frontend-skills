---
id: tooling/use-project-scripts
title: Run checks through the project's own scripts and package manager; never install tools globally or switch package managers.
severity: minor
check: manual
applies:
  - project
skill: fe-tooling
since: 0.1.0
sources:
  - title: npm Docs, scripts
    url: https://docs.npmjs.com/cli/using-npm/scripts
  - title: Node.js, Corepack (packageManager field)
    url: https://nodejs.org/api/corepack.html
---

## Why

The project's scripts pin the tool versions, flags and config the team agreed on. Running `npx eslint` with another version, installing a global tool, or running `npm install` in a pnpm project rewrites the lockfile, produces different results and creates noise in the pull request.

## Fix

Detect the package manager from the lockfile (`package-lock.json` npm, `pnpm-lock.yaml` pnpm, `yarn.lock` Yarn, `bun.lock` Bun) or the `packageManager` field, then run `<pm> run lint`, `test`, `typecheck`, `build` as defined in `package.json`. If a script is missing, propose adding it rather than running an ad-hoc command.

## Examples

```bash
# bad: in a pnpm project
npm install && npx eslint .
# good
pnpm install --frozen-lockfile && pnpm run lint
```
