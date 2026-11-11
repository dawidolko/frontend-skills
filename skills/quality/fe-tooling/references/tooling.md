# Build, lint and format tooling reference

Depth for the `fe-tooling` skill. Rule ids in brackets: `frontend-skills explain <id>`. Versions and Node ranges from the npm registry and the Node.js release schedule on 2026-11-11.

## Versions

| Tool | Latest | Node | Note |
| --- | --- | --- | --- |
| Vite | 8.3.8 | `^20.19.0 \|\| >=22.12.0` | Rolldown is the single bundler since 8.0; `rolldown-vite` is only for migrating from 7 |
| ESLint | 10.14.0 | `^20.19.0 \|\| ^22.13.0 \|\| >=24` | Flat config only; 9.x is the maintenance line |
| typescript-eslint | 8.72.2 | – | Check its supported TypeScript range before upgrading TypeScript |
| Prettier | 3.10.0 | `>=14` | – |
| Biome | 2.6.6 | – | Linter and formatter in one; licence `MIT OR Apache-2.0` |
| Oxlint | 1.93.0 | `^20.19.0 \|\| >=22.12.0` | Fast linter; can run beside ESLint |
| Stylelint | 18.0.0 | `^22.22.2 \|\| ^24.15.0 \|\| >=26` | Prefer `stylelint.config.*` |
| TypeScript | 7.0.2 | – | Native compiler; no programmatic API yet |
| html-validate | 11.21.0 | `^22.22.0 \|\| >=24.8.0` | HTML validation without Java |
| browserslist | 4.29.5 | – | Supports Baseline queries |

Node.js lines: 26 is Active LTS, 24 and 22 are Maintenance LTS, 20 reached end of life on 2026-04-30. Several current tools no longer support Node 20, so an old `.nvmrc` is a common cause of install errors.

## Package manager [tooling/use-project-scripts, tooling/one-lockfile]

| Lockfile | Manager | Frozen install |
| --- | --- | --- |
| `package-lock.json` (or `npm-shrinkwrap.json`, which wins) | npm | `npm ci` |
| `pnpm-lock.yaml` | pnpm | `pnpm install --frozen-lockfile` |
| `yarn.lock` with `.yarnrc.yml` | Yarn Berry | `yarn install --immutable` |
| `yarn.lock` without `.yarnrc.yml` | Yarn classic | `yarn install --frozen-lockfile` |
| `bun.lock` (text; `bun.lockb` is the old binary) | Bun | `bun install --frozen-lockfile` |

Corepack is bundled with Node up to 24; from Node 25 install the manager another way.

## ESLint 10 [tooling/eslint-flat-config, tooling/a11y-lint]

Config file names, in order: `eslint.config.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts` (TypeScript configs need `jiti` on Node).

```js
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/', 'coverage/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  prettier
])
```

| Stack | Accessibility lint |
| --- | --- |
| React, Next.js | `eslint-plugin-jsx-a11y` |
| Vue, Nuxt | `eslint-plugin-vuejs-accessibility` |
| Angular | `@angular-eslint/eslint-plugin-template` accessibility rules |
| Svelte | Compiler `a11y_*` warnings (on by default) |
| Lit | `eslint-plugin-lit-a11y` |

Next.js 16 removed `next lint`: run `eslint .` from a script.

## Formatting

Prettier (`.prettierrc`, `prettier.config.*`) or Biome (`biome.json`), not both on the same files. With ESLint plus Prettier, add `eslint-config-prettier` last. Add a root `.editorconfig` with `root = true` for editors.

## TypeScript [tooling/typecheck-separately]

| Stack | Type check command |
| --- | --- |
| Plain TS, React, Vite | `tsc --noEmit` (`tsc -b` with project references) |
| Vue | `vue-tsc --noEmit` |
| Svelte | `svelte-check` |
| Astro | `astro check` |
| Angular | `ng build` (type checks templates too) |

TypeScript 7.0 removed options that are now errors (for example `baseUrl` and `target: "es5"`); tools that call the compiler API may need `@typescript/typescript6` (6.0.2, Apache-2.0) until they support 7.

## Browser targets [perf/no-legacy-javascript]

```json
{ "browserslist": ["baseline widely available"] }
```

Babel, Autoprefixer, Lightning CSS and PostCSS Preset Env read it; Vite uses its own `build.target` (a modern default) unless a plugin reads browserslist. Set one, not both with different meanings.

## Short output for agents

| Tool | Flag |
| --- | --- |
| ESLint | `--format compact` or `--format json` |
| TypeScript | `--pretty false` |
| Vitest | `--reporter=dot` |
| Playwright | `--reporter=line` |
| Biome | `--reporter=summary` |
| Stylelint | `--formatter compact` |

## Sources

- Vite: https://vite.dev/guide/
- ESLint configuration files: https://eslint.org/docs/latest/use/configure/configuration-files
- typescript-eslint: https://typescript-eslint.io/getting-started
- Prettier: https://prettier.io/docs/
- Biome: https://biomejs.dev/guides/getting-started/
- Stylelint: https://stylelint.io/user-guide/configure
- TypeScript TSConfig reference: https://www.typescriptlang.org/tsconfig/
- browserslist: https://github.com/browserslist/browserslist
- Node.js releases: https://nodejs.org/en/about/previous-releases
