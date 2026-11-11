# Architecture

Frontend Skills is two things kept in one repository: a **dictionary** (skills that tell a coding agent how to write front-end code, and rules with stable ids that say what is right and why) and a **command** that fits the dictionary to one project, installs it for every coding agent the project uses, and audits the code against the rules.

Decisions in this file are binding for every contributor. Change them here first, in a commit of their own.

## Principles

1. **Zero runtime dependencies in the core.** `npx github:dawidolko/frontend-skills` runs from the Git repository with no build step and no install script. Node 20 or newer, ES modules, the standard library only. Heavy tools (Lighthouse, axe-core) are fetched on demand, after a yes, into a cache outside the project.
2. **One source, many formats.** A skill is written once as an Agent Skills folder. Adapters turn it into each agent's format; nobody edits generated files.
3. **Every rule has an id, a severity and a source.** The id is the join key between the skill text, the audit finding, `explain`, the report and the site.
4. **Token cost is a budget, enforced by a script.** See "Token strategy".
5. **Safe by default.** Nothing a person wrote is overwritten. Every written file is recorded, so `uninstall` removes exactly that. `--dry-run` shows the plan.
6. **Honest.** No claim of conformance. Static checks find part of the problems; the report says so.

## Folder layout

```text
cli/
  index.mjs              the command (bin), argument parsing and dispatch
  commands/<name>.mjs    one file per command
  lib/                   catalog, front matter, profile, stack detection, install plan, blocks, tokens, report
adapters/
  <agent>.mjs            one file per coding agent: where files go and how they look
  index.mjs              the agent table and the folder cover
engine/
  index.mjs              the audit runner
  files.mjs              which files are read and their kind
  helpers.mjs            shared helpers for checks
  parse/markup.mjs       elements and attributes of HTML, JSX, Vue, Svelte, Astro, Angular templates
  parse/css.mjs          rule blocks of CSS, SCSS, Less
  browser.mjs            --url: Lighthouse and axe-core in the person's Chrome, fetched on demand
rules/<area>/<name>/
  rule.md                the dictionary entry (front matter + Why, Fix, Examples)
  check.mjs              the static check (only when check: static)
  fixtures/bad.*         files the check must report
  fixtures/good.*        files the check must accept
skills/<area>/<skill>/
  SKILL.md               the skill (Agent Skills format)
  references/*.md        depth, loaded on demand
  scripts/*.mjs          optional, zero dependencies, short output
fixtures/projects/<name>/ small projects for stack detection, adapters and end-to-end audits
docs/                    this file, authoring.md, agents.md, skills-plan.md, sources/
test/                    node:test suites
tools/                   repository checks: skill validator, link checker, token counter, headers
site/                    the site's source (its own agent)
```

Skill areas (folders under `skills/`): `foundations`, `styling`, `frameworks`, `accessibility`, `performance`, `quality`, `workflow`.
Rule areas (the first part of a rule id): `html`, `css`, `responsive`, `a11y`, `perf`, `seo`, `i18n`, `security`, `js`, `ts`, `test`, `tooling`, `react`, `next`, `vue`, `nuxt`, `angular`, `svelte`, `astro`, `webc`, `tailwind`, `sass`, `state`. A new area is added to `RULE_AREAS` in `cli/lib/catalog.mjs` and here, in the same commit.

## Data model

### Skill

`skills/<area>/<name>/SKILL.md`, by the Agent Skills specification plus our `metadata` keys (all values strings, as the spec requires):

| Key | Required | Meaning |
| --- | --- | --- |
| `name` | yes | `fe-<topic>`, equal to the folder. The `fe-` prefix keeps our skills apart from a person's own and makes `/fe-…` easy to find. |
| `description` | yes | What it does and when to use it, with the phrases people type. At most 400 characters (our budget; the spec allows 1,024). No `<` or `>`. |
| `license` | yes | `MIT`. |
| `compatibility` | yes | What the skill needs to run (an agent that reads Agent Skills; Node.js for the audit). |
| `metadata.title` | yes | Human title, at most 40 characters. |
| `metadata.area` | yes | The folder area. |
| `metadata.lane` | yes | `A`, `B`, `C` or `W` (workflow): the owner lane in `docs/skills-plan.md`. |
| `metadata.requires` | yes | Space-separated stack keys; the skill is installed when the profile has any of them. `web` means every front-end project. |
| `metadata.globs` | yes | Space-separated globs of the files the skill is about; used for glob-scoped rule files. |
| `metadata.rules` | yes | Space-separated rule ids the skill teaches. Every id must exist in `rules/`. |
| `metadata.version` | yes | The package version. |

The body has fixed sections: a one-line "read the profile and lessons first" note, `## Rules` (the digest: at most 12 bullets, each naming its rule id when one exists), `## Do this`, `## Check`, `## References`. The `## Rules` section is copied verbatim into glob-scoped rule files, so it must stand alone.

### Rule

`rules/<area>/<name>/rule.md`. The id is `<area>/<name>` and must equal the folder path.

| Key | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Stable id, kebab-case, `^[a-z]+/[a-z0-9-]+$`. |
| `title` | yes | The rule in one sentence, at most 140 characters. |
| `severity` | yes | `critical`, `serious`, `moderate` or `minor` (the same scale as axe-core impacts, so browser results map 1:1). |
| `check` | yes | `static` (a `check.mjs` reads the source), `browser` (needs a rendered page; mapped from `axe` or `lighthouse`), `manual` (a person or the agent reviews; the skill says how). |
| `applies` | yes | File kinds: `html`, `angular`, `vue`, `svelte`, `astro`, `jsx`, `css`, `scss`, `less`, `image`, `svg`, `font`, `project` (one check over the file list), `page` (browser only). |
| `stack` | no | Stack keys; the rule runs only when the profile has one of them. |
| `requires` | no | Project helper ids (see "Project helpers"); the rule runs only when the profile records every one of them. Its title and fix may name the helper with placeholders. |
| `wcag`, `level` | for a11y | Success criterion numbers (`1.1.1`) and the level (`A`, `AA`). |
| `axe`, `lighthouse` | no | axe-core rule ids and Lighthouse audit ids that report the same problem; `audit --url` maps their results to this id. |
| `sources` | yes | At least one `{ title, url }` from a public standard or the vendor's documentation: W3C/WAI, WHATWG, MDN, web.dev or developer.chrome.com, the framework's own docs, the W3Schools style guides. |
| `skill` | yes | The skill that owns the rule (teaches it in its digest). |
| `since` | yes | The version that added the rule. |
| `status`, `replaced-by` | no | `active` (default) or `deprecated` with the id that replaces it. |

The body has `## Why` (one short paragraph), `## Fix` (what to do, concretely), `## Examples` (bad and good). Prose is our own words; a source is linked, never copied.

**Versioning of ids.** An id never changes meaning and is never reused. Renaming or splitting a rule adds the new rule and marks the old one `status: deprecated` with `replaced-by`; `explain` and the audit follow the link, and `fs-ignore` comments and profile ignores that name the old id keep working. A deprecated rule stays in the dictionary for at least one minor version. Severity may change in a minor version (listed in `CHANGELOG.md`); the meaning may not.

### Check API

```js
/* <one block comment: what the check reports and what it skips> */
import { mayHave } from '../../../engine/helpers.mjs'

export default {
  check(ctx) {
    for (const el of ctx.elements('img')) if (!mayHave(el, 'alt')) ctx.report(el, 'message')
  }
}
```

File checks receive `ctx.file`, `ctx.kind`, `ctx.helpers` (the profile's helpers), `ctx.text` (LF line endings), `ctx.elements(name?)` (native elements: `{ name, attrs: Map, spread, ancestors, parent, line, index, end, component }`; attribute names normalised to HTML: `className` → `class`, `onClick` → `onclick`, `:alt` → `alt`, `(click)` → `onclick`), `ctx.doctype`, `ctx.css()` (blocks: `{ prelude, parents, decls: [{ prop, value, important, line }], line, atRule }`), `ctx.lineOf(index)`, `ctx.profile` and `ctx.report(elementOrLine, message?)`. Project checks (`applies: [project]`) receive `ctx.files` (`{ path, kind, size }`), `ctx.read(path)` and `ctx.report({ file, line }, message?)`.

Rules of a check: report only what the source proves (skip elements with a spread, bound values you cannot read, components that may render the thing); a false positive costs more trust than a missed finding. One finding per problem, at the line a person must change.

Suppression: `fs-ignore <rule id>` in a comment on the line or the line above (any comment syntax), or `audit.ignore` / `audit.exclude` in the profile.

### Project profile

`.frontend-skills/profile.json`, written by `init` and `learn`, committed with the project:

```json
{
  "version": 1,
  "tool": "frontend-skills 0.1.0",
  "updated": "2026-11-11",
  "packageManager": "pnpm",
  "monorepo": { "tool": "pnpm", "packages": ["apps/web", "packages/ui"] },
  "projects": [
    {
      "path": "apps/web",
      "name": "web",
      "frameworks": { "next": "16.4.0", "react": "19.3.0" },
      "typescript": "7.0.0",
      "styling": ["tailwind", "css-modules"],
      "testing": ["vitest", "playwright"],
      "build": ["next"],
      "linting": ["eslint", "prettier"],
      "data": ["tanstack-query"],
      "i18n": ["next-intl"],
      "plainHtml": false
    }
  ],
  "stack": ["web", "react", "next", "typescript", "tailwind", "vitest", "playwright"],
  "helpers": {
    "rem-function": { "kind": "sass-function", "name": "rem-calc", "call": "rem-calc(16px)", "file": "src/styles/_functions.scss", "line": 3, "uses": 212, "source": "detected" },
    "icon-classes": { "kind": "icon-font", "tool": "fantasticon", "prefix": "icon-", "sourceDir": "src/icons", "example": "icon-<name>", "source": "detected" },
    "custom-properties": { "kind": "custom-properties", "file": "src/styles/tokens.css", "count": 84, "prefixes": ["--color-*", "--space-*"], "source": "detected" }
  },
  "agents": ["claude", "cursor"],
  "skills": ["fe-html", "fe-react", "fe-a11y-forms"],
  "audit": { "failOn": "serious", "ignore": [], "exclude": [], "budgets": { "imageKB": 250 } }
}
```

`stack` is the union of the keys skills and rules match on. `helpers` records the project's own conventions (next section). Versions are read from the installed package (`node_modules/<name>/package.json`) when present, else the range in `package.json` with its prefix removed. The `audit` object belongs to the person: `learn` and `update` keep it.

### Project helpers

Rules and skills follow the project's own tools when it has them: rem sizes through its px-to-rem function, icons through its generated classes, colours from its tokens. `cli/lib/conventions.mjs` detects them on `init` and `learn` and records them under `profile.helpers`, keyed by a stable helper id:

| Helper id | Detected from | Recorded fields |
| --- | --- | --- |
| `rem-function` | an `@function` in `.scss`/`.less` named like `rem-calc`, `rem`, `to-rem`, `px-to-rem`, `px2rem`; `rem-calc` from `foundation-sites` when it is used | `name`, `call`, `file`, `line`, `uses` |
| `px-to-rem-build` | `postcss-pxtorem` or a similar PostCSS plugin (px in the source is then the convention) | `tool` |
| `icon-classes` | an icon-font build (`fantasticon`, `svgtofont`, `gulp-iconfont`, `@iconify/tailwind`…) in dependencies or scripts, or generated CSS with `.<prefix>-name::before { content: "\e…" }` | `tool`, `prefix`, `sourceDir`, `cssFile`, `example` |
| `icon-sprite` | an SVG sprite build (`svg-sprite`, `svgstore`, `vite-plugin-svg-icons`, `svg-sprite-loader`…) | `tool`, `sourceDir` |
| `design-tokens` | `*.tokens.json`, `tokens.json`, `tokens/*.json`, Style Dictionary or Tokens Studio | `tool`, `files` |
| `custom-properties` | five or more `--variables` on `:root` in one stylesheet | `file`, `count`, `prefixes` |

- A **rule** that only makes sense with a helper declares it: `requires: [rem-function]`. The engine skips the rule when the profile lacks the helper, and gives the check `ctx.helpers`.
- A rule's **title and fix name the project's helper** with placeholders `{{<helper id>.<field>|<fallback>}}`, for example `{{rem-function.call|rem-calc(16px)}}`. The report and `explain` (inside a project) fill them from the profile; elsewhere the fallback is shown.
- The **instruction block** gets a "This project" list with one line per helper (for example "Sizes: write rem with `rem-calc()` (defined in `src/styles/_functions.scss`), not raw px"), so every agent follows the convention while the skills stay generic.
- A person can **add or correct a helper** by editing `profile.helpers` and setting `"source": "person"`; such entries survive `learn` and `update`. The `fe-learn` skill asks the person to confirm what was detected and to name helpers the detector missed.
- New helper ids are added to `HELPER_IDS` in `cli/lib/conventions.mjs` and to this table in the same commit.

The first two rules built on this: `css/rem-helper` (requires `rem-function`) and `html/project-icons` (requires `icon-classes`).

### Lessons

`.frontend-skills/lessons.md`: one line per lesson a person confirmed, read by every skill before it starts.

```text
- 2026-11-11 · convention · Form fields use components/ui/Field.tsx, which renders label, hint and error. [a11y/input-label]
```

The kinds are `convention`, `command` and `pitfall`. A lesson is one line of at most 300 characters, may end with the rule ids it concerns, and is refused when it looks like a secret.

### Install record

`.frontend-skills/install.json` lists every file and block the command wrote, with its SHA-256 at write time. `uninstall` removes a file only when its hash still matches (otherwise it keeps the file and says so), removes our marked blocks from shared files, and removes folders it created that are now empty. `update` rewrites only recorded files whose hash still matches.

### Report

`audit` writes three outputs:

- **The terminal summary** (a few lines): counts by severity, the top rules, where the report is, how to `explain`.
- **`frontend-report.md`** (path set by `--report`): grouped by severity, then by rule; for each rule its id, title, why, source links, fix, and every location as `file:line`; plus what was not checked (browser rules when there was no `--url`, manual rules of the installed skills as a checklist).
- **Condensed JSON** with `--json` on standard output, for agents (one line per rule, no prose beyond the fix):

```json
{"v":1,"failOn":"serious","failed":true,"counts":{"critical":1,"serious":2,"moderate":0,"minor":3},
 "rules":{"a11y/img-alt":{"s":"critical","fix":"Describe the image in alt, or alt=\"\" if decorative.","at":["src/App.tsx:12"]}}}
```

Exit code: `0` when nothing is at or above `--fail-on` (default `serious`, or `audit.failOn` in the profile), `1` when something is, `2` for a usage error, `3` when a requested tool is not available (for example `--url` without Chrome).

## Commands

| Command | What it does |
| --- | --- |
| `init [--agents a,b] [--format skills\|rules\|both] [--yes] [--dry-run]` | Detects the stack and the agents, writes the profile, plans the files per agent, shows the plan, asks (unless `--yes`), writes, records, runs the first audit. With no agent found and no `--agents`, asks which (in a script: exits 2 and names the flag). |
| `audit [path] [--url <address>] [--json] [--changed] [--base <ref>] [--fail-on <level>] [--report <file>] [--no-report]` | Static checks on the source; with `--url`, the browser checks too. |
| `learn [--lesson "<text>" --kind convention\|command\|pitfall] [--yes]` | Re-detects the stack, shows the difference, updates the profile and the installed skills; with `--lesson`, records a confirmed lesson. |
| `list [--rules] [--all]` | Skills that match this project (or all), with their token cost; with `--rules`, the dictionary. |
| `explain <rule id>` | The rule: title, severity, why, fix, examples, sources, the skill that teaches it. |
| `doctor` | Per agent: which files exist, whether they are current, duplicates, Zed's first-file caveat, Junie's trust requirement. Exit 1 when something is missing or stale. |
| `update [--dry-run]` | Re-installs the recorded selection from the current version; files a person changed are kept and listed. |
| `uninstall [--dry-run] [--yes]` | Removes what the record lists, as described above. |
| `tokens [--json]` | The estimated token cost of what is installed: the always-loaded part (descriptions, instruction blocks, always-on rules), each skill body, each reference, each glob rule. |

Every command accepts `--cwd <dir>` and `--help`. Output is short by default; `--json` gives machine output where it makes sense.

## Stack detection

Read in one pass, no network: `package.json` files (root and workspaces from `workspaces`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json`; at most three levels deep), lockfiles (package manager), config files (`next.config.*`, `nuxt.config.*`, `angular.json`, `svelte.config.*`, `astro.config.*`, `vite.config.*`, `tailwind.config.*` or `@import "tailwindcss"` in CSS, `tsconfig.json`, `postcss.config.*`), installed versions from `node_modules/<pkg>/package.json`, and for a folder with no `package.json`, the presence of `.html`, `.css` and `.js` files (a plain site). Detection lives in `cli/lib/detect.mjs`; every key it can produce is listed there and in `docs/skills-plan.md`.

## Adapters

An adapter is a plain object in `adapters/<agent>.mjs`:

```js
export default {
  id: 'cursor',
  label: 'Cursor',
  detect: ['.cursor', '.cursorrules'],          // paths whose presence means the project uses the agent
  skillDirs: ['.agents/skills', '.cursor/skills', '.claude/skills', '.codex/skills'], // folders it reads, preferred first
  instructions: 'AGENTS.md',                    // where the always-on block goes, or null
  rule: (skill, ctx) => ({ path: `.cursor/rules/${skill.name}.mdc`, text: '…' }), // glob-scoped digest, or null
  source: 'https://cursor.com/docs/context/skills'
}
```

**The folder cover.** The installer chooses the skills folders for the chosen agents together: the smallest set of folders such that every agent reads at least one, preferring `.agents/skills`, and among equal sets the one that gives the fewest duplicates (an agent reading two of the chosen folders). Remaining duplicates are listed in the plan and by `doctor`. Agents that read no skills folder (Continue, Amazon Q, Aider) point to the first chosen folder; when no folder is chosen at all, one copy goes to `.frontend-skills/skills/`.

**Formats.** `--format both` (default) writes the skills and, for agents with glob-scoped rule files, one short rule file per skill holding the skill's description, its `## Rules` digest and the path of the full skill. `skills` writes skills only (the cheapest); `rules` writes digests only.

**Instruction blocks.** Shared Markdown files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`) get one block between `<!-- frontend-skills:start -->` and `<!-- frontend-skills:end -->`: read the profile and lessons first, the audit command, the id convention. Text outside the block is never touched; a second run replaces the block in place. A file is created only when it did not exist (and then recorded). `CLAUDE.md` is never created when `AGENTS.md` exists, because Claude Code reads `AGENTS.md` only while no `CLAUDE.md` exists.

Every adapter has a test on `fixtures/projects/*` that the files land where `docs/agents.md` says the agent reads them, and that the globs it writes match the fixture files of the skill and no unrelated ones.

## Token strategy

What an agent always pays for is the list of skill descriptions, the instruction block and any always-on rule. What it pays per use is the skill body, a reference only when needed, and the output of commands. The budgets, enforced by `tools/validate.mjs` in `npm run check`:

| Part | Budget | Spec limit |
| --- | --- | --- |
| `description` | 400 characters | 1,024 |
| `SKILL.md` total | 120 lines and 1,800 tokens | under 500 lines, under 5,000 tokens recommended |
| `## Rules` digest | 12 bullets and 450 tokens | none |
| one reference file | 300 lines and 4,000 tokens | none (one level deep) |
| instruction block | 250 tokens | none |

Tokens are estimated by `cli/lib/tokens.mjs`, calibrated against a public tokenizer (method and error in `docs/tokens.md`); the published numbers name the estimator and the command that produced them (`frontend-skills tokens`, `npm run tokens`). The audit's JSON output is condensed (one entry per rule, locations as `file:line`), so an agent reads findings, not prose. Skills point to `explain <id>` instead of repeating rule text.

## Static checks and browser checks

| Static, in the source (`audit`) | Needs a rendered page (`audit --url`) | A person (listed as a checklist) |
| --- | --- | --- |
| Missing `alt`, `lang`, `title`, viewport, doctype; zoom blocked; positive tabindex; click handlers on static elements; unlabeled fields in one file; invalid autocomplete tokens; focus outline removed; images without size; render-blocking head scripts; `@font-face` without `font-display`; oversized images; index keys; `100vh` | Colour contrast, accessible names computed through components, landmarks and headings of the final DOM, focus order, target size, Lighthouse performance (LCP, CLS, TBT), SEO and best-practice audits | Meaning of alt text, error message quality, reading order, keyboard traps in custom widgets, screen reader announcements, cognitive load |

`--url` runs Lighthouse (its accessibility category is built on axe-core) and a full axe-core pass in the person's own Chrome. The tools are installed only after the person agrees, at pinned versions, into `~/.cache/frontend-skills/` (or `%LOCALAPPDATA%\frontend-skills` on Windows), never into the project. axe-core is MPL-2.0 and is therefore fetched, not bundled.

## Platform rules

- Paths in records, reports and globs use `/`; file system calls use `path.join`. Tests run on a folder whose name contains a space.
- Text is read with CRLF, CR and a BOM normalised; line numbers count CRLF as one line. Files are written with LF.
- No symbolic links (Windows), no shell (`execFileSync` with an argument array only), no network unless a person started it.
