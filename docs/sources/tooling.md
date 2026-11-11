# Tooling: sources and candidate rules

Read on 2026-11-11. Versions, licences, release dates and Node `engines` ranges come from the npm registry
(`registry.npmjs.org/<pkg>`) on that day. Node.js lines come from `nodejs.org/dist/index.json`, the
previous-releases page and `github.com/nodejs/Release/blob/main/schedule.json`.

Primary sources:

- npm package-lock: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json ; npm ci: https://docs.npmjs.com/cli/v11/commands/npm-ci
- pnpm and git: https://pnpm.io/git
- Yarn classic lockfile: https://classic.yarnpkg.com/en/docs/yarn-lock ; Yarn rc: https://yarnpkg.com/configuration/yarnrc ; lexicon: https://yarnpkg.com/advanced/lexicon
- Bun lockfile: https://bun.com/docs/pm/lockfile
- Corepack README: https://github.com/nodejs/corepack
- Node.js releases: https://nodejs.org/en/about/previous-releases ; https://github.com/nodejs/Release/blob/main/schedule.json
- nvm README (`.nvmrc`): https://github.com/nvm-sh/nvm
- Vite 8 announcement: https://vite.dev/blog/announcing-vite8 ; build options: https://vite.dev/config/build-options ; default config names and target constants: https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts
- webpack configuration: https://webpack.js.org/configuration/ ; target: https://webpack.js.org/configuration/target/ ; webpack-cli default config names: https://github.com/webpack/webpack-cli/blob/main/packages/webpack-cli/src/webpack-cli.ts
- Rspack 2.0: https://rspack.rs/blog/announcing-2-0 ; config: https://rspack.rs/config/
- Next.js Turbopack: https://nextjs.org/docs/app/api-reference/turbopack ; Next.js ESLint: https://nextjs.org/docs/app/api-reference/config/eslint
- esbuild: https://esbuild.github.io/getting-started/ ; Parcel targets: https://parceljs.org/features/targets/
- ESLint v10 migration: https://eslint.org/docs/latest/use/migrate-to-10.0.0 ; config files: https://eslint.org/docs/latest/use/configure/configuration-files ; flat-config migration: https://eslint.org/docs/latest/use/configure/migration-guide ; formatters: https://eslint.org/docs/latest/use/formatters/ ; CLI: https://eslint.org/docs/latest/use/command-line-interface
- Biome configuration: https://biomejs.dev/reference/configuration/ ; CLI: https://biomejs.dev/reference/cli/ ; reporters: https://biomejs.dev/reference/reporters/
- Oxlint: https://oxc.rs/docs/guide/usage/linter.html ; config: https://oxc.rs/docs/guide/usage/linter/config.html ; CLI: https://oxc.rs/docs/guide/usage/linter/cli.html ; agent formatter source: https://github.com/oxc-project/oxc/blob/main/apps/oxlint/src/output_formatter/agent.rs
- Prettier configuration: https://prettier.io/docs/configuration ; CLI: https://prettier.io/docs/cli
- Stylelint configure: https://stylelint.io/user-guide/configure ; CLI: https://stylelint.io/user-guide/cli ; formatter list: https://github.com/stylelint/stylelint/blob/main/docs/user-guide/options.md ; releases: https://github.com/stylelint/stylelint/releases ; stylelint-config-standard: https://github.com/stylelint/stylelint-config-standard
- html-validate usage: https://html-validate.org/usage/index.html ; CLI: https://html-validate.org/usage/cli.html ; presets: https://html-validate.org/rules/presets.html
- Nu HTML Checker: https://validator.github.io/validator/ ; LICENSE: https://github.com/validator/validator/blob/main/LICENSE
- TypeScript 7.0 announcement: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ ; TSConfig reference: https://www.typescriptlang.org/tsconfig/
- Browserslist: https://github.com/browserslist/browserslist ; browserslist-config-baseline: https://github.com/web-platform-dx/browserslist-config-baseline ; baseline-browser-mapping: https://github.com/web-platform-dx/baseline-browser-mapping
- EditorConfig specification 0.17.2: https://spec.editorconfig.org/

## Version facts (npm registry, 2026-11-11)

| package | latest | released | licence (registry) | Node engines | note |
|---|---|---|---|---|---|
| vite | 8.3.8 | 2026-11-11 | MIT | `^20.19.0 \|\| >=22.12.0` | Vite 8.0 released 2026-03-12 with Rolldown as the single bundler (replaces esbuild in dev + Rollup in build); Oxc as compiler. |
| rolldown | 1.3.2 | – | MIT | `^20.19.0 \|\| >=22.12.0` | |
| rolldown-vite | 7.3.1 | 2026-01-09 | MIT | – | npm deprecation message: it is only for migrating from Vite 7 to Vite 8. |
| webpack | 5.112.2 | 2026-10-23 | MIT | `>=10.13.0` | |
| @rspack/core | 2.3.2 | 2026-11-10 | MIT | `^20.19.0 \|\| >=22.12.0` | 2.0 released 2026-04-22; core packages pure ESM. `latest-v1` tag = 1.7.12. |
| next | 16.4.6 | 2026-11-09 | MIT | `>=20.9.0` | Turbopack default for `dev` and `build` since 16.0. |
| esbuild | 0.28.2 | 2026-08-08 | MIT | `>=18` | still 0.x. |
| parcel | 2.16.4 | 2026-02-02 | MIT | `>= 16.0.0` | `next` tag 3.0.0-alpha.2. |
| eslint | 10.14.0 | 2026-10-30 | MIT | `^20.19.0 \|\| ^22.13.0 \|\| >=24` | `maintenance` tag 9.39.5. |
| @eslint/js | 10.0.1 | – | MIT | same | |
| typescript-eslint | 8.72.2 | – | MIT | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` | |
| @biomejs/biome | 2.6.6 | 2026-11-06 | MIT OR Apache-2.0 | `>=14.21.3` | |
| oxlint | 1.93.0 | 2026-11-09 | MIT | `^20.19.0 \|\| >=22.12.0` | 872 built-in rules (oxc.rs linter page). |
| prettier | 3.10.0 | 2026-11-11 | MIT | `>=14` | `next` tag 4.0.0-alpha.13. |
| stylelint | 18.0.0 | 2026-11-03 | MIT | `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0` | |
| stylelint-config-standard | 41.0.0 | – | MIT | same as stylelint | extends stylelint-config-recommended (19.0.0). |
| html-validate | 11.21.0 | 2026-11-09 | MIT | `^22.22.0 \|\| >= 24.8.0` | |
| vnu-jar | 26.11.9 | 2026-11-09 | MIT (registry; LICENSE file is MIT text, © Mozilla Foundation 2007-2016 and others) | `>=18` | needs Java 17+ (validator.github.io); unpacked 32.5 MB. |
| typescript | 7.0.2 | 2026-07-08 | Apache-2.0 | `>=16.20.0` | 7.0 is the native Go port; `beta` 7.1.0-beta. |
| @typescript/typescript6 | 6.0.2 | – | Apache-2.0 | – | compatibility package with the 6.0 API and a `tsc6` binary. |
| browserslist | 4.29.5 | – | MIT | – | native Baseline queries. |
| browserslist-config-baseline | 0.5.0 | 2025-08-04 | Apache-2.0 | – | |
| baseline-browser-mapping | 2.11.35 | – | Apache-2.0 | `>=6.0.0` | |
| npm / pnpm / yarn (classic) / @yarnpkg/cli-dist / bun | 12.2.2 / 12.18.0 / 1.22.22 / 4.18.1 / 1.4.4 | – | Artistic-2.0 / MIT / BSD-2-Clause / BSD-2-Clause / MIT | – | for reference only; the project's pinned version wins. |

## Node.js lines today (2026-11-11)

| line | codename | status today | end of life | source |
|---|---|---|---|---|
| 26 | Lithium | Active LTS (LTS since 2026-10-28) | 2029-04-30 | schedule.json; latest v26.13.0 |
| 24 | Krypton | Maintenance LTS (since 2026-10-20) | 2028-04-30 | schedule.json; latest v24.22.2 |
| 22 | Jod | Maintenance LTS | 2027-04-30 | schedule.json; latest v22.23.4 |
| 27 | – | Alpha (since 2026-10-28); Current from 2027-04-22 | 2030-04-30 | schedule.json |
| 25, 23, 21, 20 and older | – | End of life (20 ended 2026-04-30; 25 ended 2026-06-01) | – | schedule.json |

From Node 27 on there is one major per year: six months Alpha, six months Current, then LTS; earlier odd lines were
never LTS (previous-releases page). Corepack ships with Node 14.19.0 up to but not including 25.0.0 (Corepack README),
so `corepack enable` cannot be assumed on Node 25+.

## Detection: package manager

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| tooling/detect-package-manager | Pick the package manager from the lockfile: `package-lock.json` or `npm-shrinkwrap.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → Yarn (Berry if `.yarnrc.yml` exists), `bun.lock` (text, default since Bun 1.2) or legacy binary `bun.lockb` → Bun; `packageManager` in package.json (`name@version`) overrides when present. | Running the wrong manager rewrites or ignores the lockfile. | npm package-lock docs; pnpm.io/git; classic.yarnpkg.com yarn-lock; yarnpkg.com yarnrc; bun.com/docs/pm/lockfile; Corepack README | any | static: file existence at project root (walk up for monorepos) | info | `npm install` in a pnpm repo → `pnpm install` | – |
| tooling/single-lockfile | Keep exactly one lockfile kind in a project. | Two lockfiles mean two dependency trees and unclear CI behaviour. | same as above | any | static: more than one of the five lockfile names at root | warning | delete the one the team does not use | – |
| tooling/lockfile-committed | Commit the lockfile and install in CI with the frozen command (`npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`, `bun install --frozen-lockfile`). | `npm ci` refuses to run without a lockfile and fails on a mismatch instead of updating it; pnpm and Yarn tell you to commit theirs. | npm-ci docs; pnpm.io/git; classic.yarnpkg.com yarn-lock | any | static: `package.json` present, no lockfile; or lockfile listed in `.gitignore` | warning | – | – |
| tooling/npm-shrinkwrap-precedence | If both `npm-shrinkwrap.json` and `package-lock.json` exist, npm uses the shrinkwrap and ignores the lock. | Edits to the ignored file have no effect. | npm package-lock docs | npm | static: both files present | info | – | – |
| tooling/bun-text-lockfile | Prefer `bun.lock` over binary `bun.lockb`. | Text lockfiles diff and review; Bun documents a one-off migration command. | bun.com/docs/pm/lockfile | Bun | static: `bun.lockb` present | info | `bun.lockb` → `bun install --save-text-lockfile --frozen-lockfile --lockfile-only`, then remove `bun.lockb` | – |
| tooling/node-version-supported | The Node version pinned in `engines.node`, `.nvmrc` or CI should be a supported LTS line (22, 24, 26 today). | EOL lines get no security fixes; current tools (ESLint 10, Vite 8, Vitest 5, Stylelint 18, MSW 3) already refuse old lines. | Node previous-releases; schedule.json; nvm README (`.nvmrc`); registry `engines` | any | static: parse `engines.node`, `.nvmrc`, `actions/setup-node` `node-version`; flag 20 or lower, 21, 23, 25 | warning | `"node": ">=18"` → `"node": ">=22.12"` (match the strictest tool) | – |
| tooling/use-project-scripts | Run the project's own scripts (`<pm> run lint`, `test`, `typecheck`, `build`) through the detected package manager, and run tools from local devDependencies (`npx`, `pnpm exec`, `yarn`, `bunx`); never install a linter or formatter globally. | Local versions and configs are what CI uses; a global tool with other rules produces noise and wrong fixes. | Next.js ESLint page (runs `eslint` via each manager); ESLint config lookup is per project | any | static: read `package.json` `scripts` first | warning | `npm i -g eslint && eslint .` → `pnpm run lint` | – |

## Bundlers and dev servers

| tool | detect by (exact names) | facts a skill needs | source |
|---|---|---|---|
| Vite | `vite.config.{js,mjs,ts,cjs,mts,cts}` (that order); `vite` dep | v8: Rolldown bundler in dev and build; default `build.target` is `'baseline-widely-available'` = chrome111, edge111, firefox114, safari16.4, ios16.4 (Baseline Widely Available as of 2026-01-01); `build.cssTarget` follows it. Vite does not type-check. | vite.dev blog + build-options; constants.ts |
| webpack | `webpack.config.*`, `.webpack/webpack.config.*`, `.webpack/webpackfile.*` (webpack-cli list, extensions tried) | `target` defaults to `'browserslist'` when a browserslist config is found, else `'web'`. | webpack.js.org target; webpack-cli source |
| Rspack | `rspack.config.{ts,js,mts,mjs,cts,cjs}` (that order); `@rspack/core` | 2.x core packages are pure ESM; aims at webpack-ecosystem compatibility with some changed defaults. | rspack.rs config + 2.0 post |
| Turbopack (Next.js) | `next` ≥16 dep; `turbopack` key in `next.config.{js,ts,mjs}` | Default for `next dev` and `next build` since 16.0; opt out with `--webpack`. No webpack plugins (loaders are supported); a `webpack()` function in next.config is not used by Turbopack; no Yarn PnP; does not type-check. | nextjs.org turbopack |
| esbuild | `esbuild` dep or script | 0.x; strips TypeScript types without checking them; set `target` yourself. | esbuild.github.io |
| Parcel | `parcel` dep; `.parcelrc` (not confirmed, see Not verified) | Browser targets from `package.json#browserslist`; per-target `engines.browsers` overrides it. | parceljs.org targets |

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| tooling/typecheck-separately | In a TypeScript project built by Vite, esbuild, Rspack or Turbopack, have a separate type-check step (`tsc --noEmit`, or `vue-tsc`/`svelte-check` for SFCs) in a script and in CI. | These bundlers drop types without checking them, so type errors ship silently. | Turbopack page ("Type-checking is not done by Turbopack"); esbuild getting-started; TSConfig `noEmit`; Playwright best practices (run `tsc --noEmit` on CI) | TS projects | static: `tsconfig.json` present and no script containing `tsc` / `vue-tsc` / `svelte-check` / `astro check` | warning | – | – |
| tooling/vite8-drop-rolldown-vite | On Vite 8, remove the `rolldown-vite` package or alias. | It was a Vite 7 preview; its npm entry is deprecated. | Vite 8 post; npm deprecation message | Vite | static: `rolldown-vite` in package.json while `vite` ≥8 | info | `"vite": "npm:rolldown-vite@7"` → `"vite": "^8"` | – |
| tooling/next16-webpack-config-ignored | With Next 16+ and no `--webpack` flag, a `webpack()` function in next.config does nothing; move needs to `turbopack.rules` / `resolveAlias` or opt out explicitly. | Silent loss of custom build behaviour. | nextjs.org turbopack ("Unsupported and unplanned features") | Next.js | static: next ≥16 + `webpack:` / `webpack(` in `next.config.*` + scripts without `--webpack` | warning | – | – |
| tooling/browser-targets-declared | Declare browser targets once (browserslist config, or the bundler's own target), preferably as a Baseline query such as `baseline widely available`. | Transpilers, autoprefixer, Stylelint/ESLint compat plugins and webpack all read it; Baseline keeps it tied to cross-browser support. | browserslist README (lookup order, Baseline queries); webpack target; Vite build-options | any with a build | static: no `.browserslistrc`, no `browserslist` key in package.json, no `browserslist` file, no explicit bundler target → info only (bundler defaults exist) | info | `"browserslist": "> 0.5%, last 2 versions"` → `"browserslist": "baseline widely available"` | `browserslist@4.29.5` MIT (already a transitive dep in most projects); `browserslist-config-baseline@0.5.0` Apache-2.0 only if the team wants its options object |

Browserslist details: lookup order `.browserslistrc` → `browserslist` key in `package.json` → `browserslist` file
(current and parent dirs) → `BROWSERSLIST` env; `defaults` = `> 0.5%, last 2 versions, Firefox ESR, not dead`; native
Baseline queries: `baseline widely available`, `baseline newly available`, `baseline widely available on YYYY-MM-DD`,
`baseline 2024`, optional `with downstream` / `including kaios`. baseline-browser-mapping warns when its data is more than
two months old for recent cut-offs; pin a date (`... on YYYY-MM-DD`) for reproducible builds.

## Linters, formatters, validators

| tool | config files (exact) | facts | source |
|---|---|---|---|
| ESLint 10 | `eslint.config.{js,mjs,cjs,ts,mts,cts}` (that precedence) | `.eslintrc*` support removed in v10; `.eslintignore` not read by flat config (use `ignores`); config is looked up from each linted file's directory upward, not from cwd; TS configs need `jiti` ≥2.2.0 on Node (or experimental native strip-types flag). Migrator: `npx @eslint/migrate-config .eslintrc.json`. | eslint.org migrate-to-10, configuration-files, migration-guide |
| Next.js lint | `eslint.config.mjs` with `eslint-config-next` | `next lint` removed in Next 16; run the ESLint CLI. `eslint-config-next` supports ESLint 9 and 10; some bundled plugins may still warn on ESLint 10 peer ranges. | nextjs.org config/eslint |
| Biome 2 | `biome.json`, `biome.jsonc`; nested configs need `"root": false` or `"extends": "//"` | `biome check` = format + lint + assists; `biome ci` = same, read-only; `biome migrate eslint` / `biome migrate prettier`. | biomejs.dev configuration, cli |
| Oxlint | `.oxlintrc.json`, `.oxlintrc.jsonc`, `oxlint.config.ts`, `oxlint.config.mts` (one per directory) | Can replace ESLint or run first with `eslint-plugin-oxlint` disabling overlaps; JS plugins alpha; type-aware via the Go TypeScript port. `oxlint.config.ts` needs the Node package and Node 22.18+ or 24+. | oxc.rs linter, config, cli |
| Prettier 3 | `"prettier"` key in package.json/package.yaml, `.prettierrc`, `.prettierrc.{json,yml,yaml,json5,js,ts,mjs,mts,cjs,cts,toml}`, `prettier.config.{js,ts,mjs,mts,cjs,cts}`; ignores from `.gitignore` + `.prettierignore` | Reads `.editorconfig` (stops at project root); explicit config overrides it. `--ignore-path` replaces the defaults. | prettier.io configuration, cli |
| Stylelint 18 | preferred `stylelint.config.{js,mjs,cjs,ts}`; legacy (still read, may be removed) `.stylelintrc`, `.stylelintrc.{js,mjs,cjs,json,yml,yaml}`, `"stylelint"` in package.json; ignore `.stylelintignore` | 18.0.0: TS configs via Node type stripping, `context.fix` removed, no global `node_modules` resolution, older Node dropped (registry engines above). `stylelint-config-standard` extends recommended with modern-CSS conventions drawn from specs and Baseline Widely Available. | stylelint.io configure; releases; config-standard README |
| html-validate | `.htmlvalidate.{json,js,cjs,mjs}` or project-level `html-validate.config.js` | presets: `recommended` (default), `standard` (WHATWG), `a11y`, `document`, `prettier`, `browser`. | html-validate.org usage, presets |
| Nu HTML Checker | `vnu-jar` dep, `vnu` binary or Docker image `ghcr.io/validator/validator` | Java 17+ for the jar; native binaries bundle a runtime; `--skip-non-html` for directories. Authoritative for spec conformance of finished HTML. | validator.github.io; README |
| TypeScript 7 | `tsconfig.json` (plus `tsconfig.*.json` referenced) | `tsc --noEmit` = type-check only. 7.0 defaults: `strict: true`, `module: esnext`, `types: []`, `rootDir: ./`. Hard errors for `target: es5`, `downlevelIteration`, `moduleResolution: node/node10/classic`, `module: amd/umd/systemjs/none`, `baseUrl`, and turning `esModuleInterop` / `allowSyntheticDefaultImports` / `alwaysStrict` off. No programmatic API in 7.0: typescript-eslint and Volar-based tools (Vue, Svelte, Astro) still need the 6.0 API via `@typescript/typescript6`. | TS 7.0 announcement; TSConfig reference |
| EditorConfig | `.editorconfig` (searched from the file's dir upward, stops at `root = true`) | Spec 0.17.2 keys: `indent_style`, `indent_size`, `tab_width`, `end_of_line`, `charset`, `trim_trailing_whitespace`, `insert_final_newline`, `root`, `spelling_language`. | spec.editorconfig.org |

| id | rule (own words, one sentence) | why | source | applies to | check | sev | bad → good | light library |
|---|---|---|---|---|---|---|---|---|
| tooling/eslint-flat-config | With ESLint ≥10, configuration must live in `eslint.config.*`; any `.eslintrc*` or `eslintConfig` key is dead. | v10 no longer supports the old format, so those rules silently stop applying (or the run fails without a flat config). | ESLint migrate-to-10 | ESLint ≥10 | static: eslint major ≥10 in package.json + any `.eslintrc`, `.eslintrc.{js,cjs,json,yml,yaml}` or `eslintConfig` key | error | `.eslintrc.json` → `eslint.config.js` (via `@eslint/migrate-config`) | – |
| tooling/eslint-no-eslintignore | Move `.eslintignore` patterns into an `ignores` / `globalIgnores` entry. | Flat config does not read `.eslintignore`. | ESLint migration guide | ESLint ≥9 flat | static: `.eslintignore` exists | warning | – | – |
| tooling/eslint-ts-config-loader | If the config is `eslint.config.{ts,mts,cts}` on Node, `jiti` ≥2.2.0 must be a devDependency (unless the documented experimental native flag is used). | ESLint does not install it and fails to load the config. | ESLint configuration-files | ESLint | static: ts config present, `jiti` absent from devDependencies | warning | – | `jiti@2.7.0`, MIT (npm) |
| tooling/next-lint-removed | Replace `next lint` in scripts with `eslint .` on Next 16+. | The command was removed. | Next.js ESLint page | Next.js ≥16 | static: script contains `next lint` | error | `"lint": "next lint"` → `"lint": "eslint ."` | – |
| tooling/one-formatter | Use a single formatter per file type (Prettier or Biome's formatter), and when ESLint and Prettier coexist turn off ESLint's style rules with `eslint-config-prettier`. | Two formatters fight and produce endless diffs. | Next.js ESLint page ("With Prettier"); Biome CLI (`biome format`) | any | static: Prettier config + `biome.json` with formatter not disabled; or ESLint + Prettier without `eslint-config-prettier` | warning | – | `eslint-config-prettier@10.1.8`, MIT (npm) |
| tooling/stylelint-preferred-config-name | Prefer `stylelint.config.*` over legacy `.stylelintrc*` names. | Stylelint labels the rc names legacy and possibly removed later. | stylelint.io configure | Stylelint | static: `.stylelintrc*` present | info | `.stylelintrc.json` → `stylelint.config.mjs` | – |
| tooling/ts7-removed-options | On TypeScript ≥7, remove options that are now hard errors (`baseUrl`, `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10`/`classic`, `module: amd`/`umd`/`systemjs`/`none`, `esModuleInterop: false`). | `tsc` fails outright. | TS 7.0 announcement | TS ≥7 | static: parse `tsconfig*.json` (JSONC) for those keys/values when `typescript` ≥7 | error | `"baseUrl": "."` + `paths` → `paths` relative to project root | – |
| tooling/ts7-api-consumers | If `typescript` is 7.x and the project uses typescript-eslint type-aware rules, `vue-tsc`, `svelte-check` or `astro check`, make sure the 6.0 API is available (`@typescript/typescript6`). | 7.0 has no programmatic API; those tools would break. | TS 7.0 announcement | TS ≥7 | static: typescript ≥7 + one of those deps, and no `@typescript/typescript6` | warning | – | `@typescript/typescript6@6.0.2`, Apache-2.0 (npm) |
| tooling/html-validate-in-ci | For plain-HTML or static-output sites, run `html-validate` on source/output (or vnu on built HTML) in CI. | Invalid nesting, duplicate ids and broken references cause real a11y and rendering bugs; cheap to catch. | html-validate presets; Nu checker docs | plain HTML, SSG output | static: `.html` files in repo and no html-validate/vnu script | info | – | `html-validate@11.21.0`, MIT (npm, no Java). vnu needs Java 17+ and is 32.5 MB unpacked |
| tooling/editorconfig-root | Have a root `.editorconfig` with `root = true` covering indent, EOL, charset and final newline. | Editors and Prettier read it; stops whitespace churn. | EditorConfig spec; Prettier configuration | any | static: no `.editorconfig`, or no `root = true` at repo root | info | – | – |

## Condensed output (token cost)

| tool | how to get short or machine-readable output | source |
|---|---|---|
| ESLint | `-f json` (or `json-with-metadata`), `--quiet` (errors only), `-o <file>`; `--max-warnings 0` for gates; `--cache` | eslint.org formatters, CLI |
| Oxlint | `-f agent`: one line per diagnostic, no source excerpt, no summary (agent.rs); also `-f unix`, `json`; `--quiet` | oxc.rs CLI; oxc source |
| Biome | `--reporter=concise` or `summary`; `--reporter=json` is marked experimental (format may change in patches); `--max-diagnostics=<n>` (default 20); `--diagnostic-level=error` | biomejs.dev reporters, CLI |
| Prettier | `--list-different` (just file names) or `--check`; `--log-level warn` | prettier.io CLI |
| Stylelint | `-f compact` / `unix` / `json`; `--quiet`; (`github` formatter is deprecated) | stylelint options.md; CLI |
| html-validate | `--formatter json` or `text`; `--formatter json=out.json` to a file | html-validate CLI |
| tsc | `--pretty false` gives plain one-line diagnostics (`pretty` defaults to true); leave `noErrorTruncation` false (default) so long types stay shortened | TSConfig `pretty`, `noErrorTruncation` |
| Tests | see `testing.md` (Vitest `minimal`/`agent`, Playwright `dot`, Jest `--json`) | – |

Skill guidance: run the project script first; if its output is long, re-run the underlying tool with the compact
reporter and only the changed files; never paste full stylish/codeframe output into context.

## Notes for skill authors

- Stack detection should read, in order: lockfile → `packageManager` field → `package.json` deps and scripts → config
  file names in the tables above. Treat config names as exact strings; ESLint, Vite, Rspack and Prettier each have a
  precedence order when several exist.
- Short skill: "use the project's scripts via the detected manager", "never install globally", "type-check is separate
  from the bundler", "compact reporters", plus the `error` rows (`eslint-flat-config`, `next-lint-removed`,
  `ts7-removed-options`). Reference file: version table, Node lines, config-name tables, reporter flags.
- Noisy / controversial: `one-formatter` (some teams run Biome lint + Prettier on purpose), `browser-targets-declared`
  (bundler defaults are often fine), `editorconfig-root`, Oxlint vs ESLint as a choice (never recommend switching
  tools in an audit; only flag broken configs).
- Changes often, recheck every release: Node schedule (new yearly cadence from 27), TypeScript 7.x API status (7.1
  expected to add a new API), ESLint 10 peer support in plugins, Vite default target (moves per major), Rspack/Turbopack
  feature gaps, Biome JSON reporter stability, Stylelint legacy config names, Corepack availability.
- Engines are a quick signal: ESLint 10, Vite 8, Vitest 5, Stylelint 18, html-validate 11, MSW 3 all exclude Node 20
  or lower ranges, so an old `.nvmrc` is likely the root cause of many install errors.

## Not verified

- Parcel `.parcelrc` file name and whether Parcel reads `.browserslistrc`: the targets page covers only
  `package.json#browserslist`.
- `pnpm-workspace.yaml` as a pnpm signal: the pnpm docs page I tried for it returned 404; pnpm.io/git only covers the
  lockfile.
- `.node-version` file (used by some version managers): no primary source opened.
- Yarn Berry detection by `.yarn/releases` and `.pnp.loader.mjs`: not named on the pages read (only `.yarnrc.yml`,
  `nodeLinker` default `pnp`, `.pnp.cjs`).
- Whether Bun still reads `bun.lockb`: Bun's page documents only a manual migration.
- vnu CLI flags `--format json`, `--errors-only`, `--Werror`: the site points to a man page I did not open.
- `tsc --noEmit` wording inside the TS 7.0 post: not mentioned there; the option is documented in the current TSConfig
  reference and Playwright's best practices still recommend it.
- Vite 8 default target per Vite blog: the announcement does not state it; the values come from the build-options page
  and the source constant.
- Rspack 2 minimum Node: the blog does not state it; the registry `engines` (`^20.19.0 || >=22.12.0`) is used.
- Min+gz sizes: not relevant (dev-only tools); only npm unpacked size where given.
