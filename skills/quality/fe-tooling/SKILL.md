---
name: fe-tooling
description: Sets up front-end tooling the way the project already does - package manager and lockfile, Vite 8, ESLint 10 flat config with accessibility plugins, Prettier 3 or Biome 2, Stylelint, TypeScript type checks, browserslist with Baseline targets, Node LTS. Use when adding or upgrading a linter, formatter, bundler or TypeScript, fixing a broken config or CI step, or when asked "set up linting".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: Build, lint and format tooling
  area: quality
  lane: C
  requires: "vite eslint prettier biome"
  globs: "**/package.json **/eslint.config.* **/vite.config.* **/tsconfig*.json **/biome.json **/.prettierrc* **/stylelint.config.* **/.browserslistrc"
  rules: "tooling/use-project-scripts tooling/one-lockfile tooling/eslint-flat-config tooling/typecheck-separately tooling/a11y-lint perf/no-legacy-javascript"
  version: 0.1.0
---

# Build, lint and format tooling

Read `.frontend-skills/profile.json` (package manager, linting, build) and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson (for example a command the team uses) wins over this skill.

## Rules

- Run the project's scripts with its package manager; never install tools globally (tooling/use-project-scripts).
- Keep one committed lockfile; CI installs with the frozen command (tooling/one-lockfile).
- ESLint 10 reads only `eslint.config.*`; migrate `.eslintrc*` and `.eslintignore` (tooling/eslint-flat-config).
- TypeScript projects run a separate type check in CI; bundlers only strip types (tooling/typecheck-separately).
- Lint with the framework's accessibility plugin or compiler warnings (tooling/a11y-lint).
- Declare browser targets once, as a Baseline query; no blanket polyfills (perf/no-legacy-javascript).
- One formatter per file type; with ESLint and Prettier together, turn off ESLint's style rules (`eslint-config-prettier`).
- Pin the Node version to a supported LTS line (22, 24 or 26 in November 2026) in `.nvmrc` and `engines`.
- Never weaken a lint rule or a type to make a check pass; fix the code or explain the exception inline.
- Do not switch tools in passing (ESLint to Oxlint, Prettier to Biome); propose it separately.

## Do this

1. Read `package.json` scripts, the lockfile and config files first; the profile lists what was detected.
2. Fix configs in place: migrate ESLint to flat config with `@eslint/migrate-config`, move ignores into the config, keep one formatter config.
3. Add the missing CI steps in this order: install (frozen), lint, typecheck, test, build, `frontend-skills audit`.
4. For Vite 8 (Rolldown inside): remove the `rolldown-vite` alias, check plugins for Vite 8 support, set `build.target` or browserslist once.
5. Keep tool output short for agents: `eslint --format compact`, `vitest run --reporter=dot`, `tsc --pretty false`.

## Check

- `npx github:dawidolko/frontend-skills audit` runs the static rules; this skill's own rules are checked by reading the config files, as listed in `## Rules`.
- Run `<pm> run lint`, `<pm> run typecheck`, `<pm> run build` and read the first error, not the last.
- `npx github:dawidolko/frontend-skills doctor` shows which agent files are installed and current.

## References

- [references/tooling.md](references/tooling.md): versions and Node ranges, package manager detection, config file names, ESLint, Prettier, Biome and Stylelint setups, TypeScript 7 notes, browserslist Baseline, compact reporters. Read it when adding or upgrading a tool.
