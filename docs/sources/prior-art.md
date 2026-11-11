# Prior art: skills, rules and instructions for AI coding agents that touch front-end work

Read on 2026-11-11. This file surveys what exists today so that Frontend Skills learns from it, reuses what its
licence allows, and spends its effort where nobody else does. It has three parts:

- **Part A** — the formats each coding agent reads, the vendors' own skill repositories, and the installers and sync
  tools around them (sections 1–3).
- **Part B** — the community collections that touch front-end work: catalogues, framework packs, accessibility,
  design, performance and SEO, and the projects that come closest to this one (sections 4–10).
- **Conclusions** — what to learn, what none of them does, and the six things that would make this the project a
  front-end developer picks. Read this first if you are short of time: [jump to the conclusions](#conclusions).

How the numbers were taken: stars, last push and licence from the GitHub REST API (`api.github.com/repos/<owner>/<repo>`,
fields `stargazers_count`, `pushed_at`, `license.spdx_id`) on 2026-11-11; where the API gave no clear licence, the
LICENSE file at the repository root was opened. "none found" means no LICENSE file at the root and no SPDX id: such a
project may be linked to but **nothing may be adapted from it**. npm versions and licences come from
`registry.npmjs.org/<pkg>/latest`. File counts and byte sizes come from the repository tree unless stated. Stars and
open-issue counts are approximate by nature (open issues include pull requests).

Checked again by the lead on 2026-11-11, on the primary source: the licences of midudev/autoskills (CC-BY-NC-4.0, LICENSE
read), Community-Access/accessibility-agents (MIT), pbakaus/impeccable (Apache-2.0), addyosmani/web-quality-skills
(MIT), GoogleChrome/modern-web-guidance (Apache-2.0), vercel-labs/skills (MIT), dyoshikawa/rulesync (MIT),
agentskills/agentskills (Apache-2.0); that ComposioHQ/awesome-claude-skills and vercel-labs/agent-skills report no
licence at the root; the Next.js agent guide (bundled docs path, managed `AGENTS.md` block, 100% / 79% figures); and the
Codex `AGENTS.md` page (old URL redirects with HTTP 308 to learn.chatgpt.com; 32 KiB `project_doc_max_bytes`).

---

# Part A: formats, vendor repositories, installers

## 1. Per-agent instruction and skill formats (adapter reference)

Legend: "glob" = the file can be limited to matching paths by frontmatter. "AS" = reads Agent Skills (`SKILL.md`
folders). Size = only limits the vendor states; "none stated" means the page gives no number.

| Agent | Always-on instruction file(s) | Scoped rules (path / frontmatter) | Size limit stated | Reads AGENTS.md | Agent Skills dirs (project / user) | Source |
|---|---|---|---|---|---|---|
| Claude Code | `CLAUDE.md` or `.claude/CLAUDE.md`, `CLAUDE.local.md`; ancestors at launch, subdirs on demand; `@path` imports, max 4 hops | `.claude/rules/**/*.md`, frontmatter `paths:` (YAML list or comma string, brace expansion, budget 1,000 expanded patterns / 4 MiB); `paths` is the only rule field read | target under 200 lines per CLAUDE.md (guidance); auto memory loads first 200 lines or 25KB | yes, since v2.1.277: AGENTS.md is read only when no CLAUDE.md / CLAUDE.local.md exists in cwd or above (default `claude-md-or-agents-md`); `claude-md-and-agents-md` option reads both | `.claude/skills/<n>/SKILL.md` (also nested `<subdir>/.claude/skills`, loaded on first touch) / `~/.claude/skills`; plugin `skills/`. Skill frontmatter adds `paths` (glob scoping of auto-activation), `when_to_use`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `context: fork` etc. SKILL.md under 500 lines; description + when_to_use truncated at 1,536 chars in listing; after compaction first 5,000 tokens per skill, 25,000 total | https://code.claude.com/docs/en/memory , https://code.claude.com/docs/en/skills |
| Agent Skills spec (agentskills.io) | – | – (no glob field in spec) | `name` 1–64 chars `[a-z0-9-]`, no leading/trailing/double hyphen, must equal folder name; `description` 1–1024 chars; `compatibility` ≤500; metadata ~100 tokens at startup; body < 5,000 tokens recommended; SKILL.md under 500 lines; references one level deep | – | fields: `name`, `description` (required), `license`, `compatibility`, `metadata` (string→string), `allowed-tools` (experimental). Dirs `scripts/`, `references/`, `assets/`. Validator `skills-ref validate` | https://agentskills.io/specification |
| OpenAI Codex | `AGENTS.override.md` else `AGENTS.md` in `~/.codex` (or `CODEX_HOME`); then one file per dir from git root down to cwd; `project_doc_fallback_filenames` in config.toml | no globs; directory placement only (closer file wins, later in prompt) | `project_doc_max_bytes` default 32 KiB for the combined files | yes (native) | `.agents/skills` in cwd and each parent to repo root / `~/.agents/skills` (`$HOME/.agents/skills`), `/etc/codex/skills`, bundled system skills. Skill list uses ≤2% of context window (8,000 chars if unknown), `skills.max_context_tokens` up to 10,000 tokens; optional `agents/openai.yaml` (UI, `policy.allow_implicit_invocation`, `dependencies.tools`). Install: `$skill-installer <name>` | https://learn.chatgpt.com/docs/agent-configuration/agents-md , https://learn.chatgpt.com/docs/build-skills (old developers.openai.com/codex URLs redirect here) |
| GitHub Copilot | `.github/copilot-instructions.md`; personal (CLI) `~/.copilot/copilot-instructions.md` | `.github/instructions/**/NAME.instructions.md`, frontmatter `applyTo: "**/*.ts,**/*.tsx"` (comma-separated globs), optional `excludeAgent: "code-review" \| "cloud-agent"`; repo-wide and path files both apply | GitHub changelog 2026-06-12: the 4,000-char code-review read limit "has now been removed" (older docs page still mentions 4,000) | yes: many `AGENTS.md` anywhere, nearest wins; also single root `CLAUDE.md` or `GEMINI.md`. Per surface: cloud agent, code review, Copilot CLI and VS Code chat read agent files; Visual Studio / JetBrains / Xcode chat do not | `.github/skills`, `.claude/skills`, `.agents/skills` / `~/.copilot/skills`, `~/.agents/skills`; surfaces: Copilot app, CLI, cloud agent, code review, agent mode in VS Code / Visual Studio / JetBrains. Install via `gh skill` | https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions , https://docs.github.com/en/copilot/reference/custom-instructions-support , https://docs.github.com/en/copilot/concepts/agents/about-agent-skills , https://github.blog/changelog/2026-06-12-copilot-code-review-new-configurations-and-controls/ |
| VS Code (agent host) | per harness: Copilot `.github/copilot-instructions.md` or `AGENTS.md`; Claude `CLAUDE.md`; Codex nested `AGENTS.md` | `.github/instructions/*.instructions.md` with `applyTo`; also `.claude/rules/*.md` with `paths`; `description` lets the agent choose (Local sessions) | none stated | yes | (see Copilot) | https://code.visualstudio.com/docs/copilot/customization/custom-instructions |
| Cursor | `AGENTS.md` root and subdirs (nested combine, specific wins); User Rules (settings); Team Rules (dashboard) | `.cursor/rules/**/*.mdc` only (plain `.md` there is ignored). Frontmatter `description`, `globs`, `alwaysApply`: alwaysApply true = always; globs = auto-attach on matching file; description only = agent decides; none = @-mention only. Precedence Team → Project → User | "Keep rules under 500 lines" | yes | `.agents/skills`, `.cursor/skills` (+ nested, scoped to that dir) / `~/.agents/skills`, `~/.cursor/skills`; compat `.claude/skills`, `.codex/skills`. Skill fields `name`, `description`, `paths`, `disable-model-invocation`, `metadata`, `icon`, `color`. Remote skills only via plugins (`.cursor-plugin/marketplace.json`) | https://cursor.com/docs/context/rules , https://cursor.com/docs/context/skills |
| Gemini CLI | `GEMINI.md` global `~/.gemini/GEMINI.md`, workspace dirs + parents, just-in-time on tool access; `@file.md` imports; `context.fileName` can list `AGENTS.md` | no globs | none stated | only if configured via `context.fileName` | `.gemini/skills` or alias `.agents/skills` (alias wins) / `~/.gemini/skills`, `~/.agents/skills`; `activate_skill` tool with consent prompt; `gemini skills install <git-url> [--path] [--scope]`. NOTE: banner on the docs says Gemini CLI "was replaced by Antigravity CLI on June 18th, 2026" for unpaid / Google One users; remains for paid API keys and enterprise | https://geminicli.com/docs/cli/gemini-md/ , https://geminicli.com/docs/cli/skills/ , https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli (posted 2026-05-19) |
| Google Antigravity (app, `agy` CLI, IDE) | `AGENTS.md`, `GEMINI.md`, `.agents/AGENTS.md`, `.agents/GEMINI.md` in workspace and parents up to repo root (always on, no frontmatter); global `~/.gemini/AGENTS.md`, `~/.gemini/config/rules/*.md` | `.agents/rules/*.md` (legacy `.agent/rules`), frontmatter `trigger: always_on \| model_decision \| glob \| manual`, `globs: "*.proto, **/*.pb.go"` (comma string; quote leading `*`), `description` for model_decision; subfolder rules below workspace not loaded; nested `.agents/rules/` subdirs only via `.agents/rules.json`; CLI cannot @-mention rules | 24,000 bytes per file (truncated after include expansion); 20,000-token budget for always-on + global rules, largest become pointers | yes | `.agents/skills` (and parents to repo root; legacy `.agent/skills`) / `~/.gemini/config/skills`; CLI also `~/.gemini/skills`, `~/.gemini/antigravity-cli/skills`, plugin skills. `name` optional, `description` required. Plugins: `agy plugin install` | https://antigravity.google/docs/rules , https://antigravity.google/docs/skills |
| Windsurf (now documented under Devin) | `~/.../global_rules.md`; AGENTS.md always-on (Devin Local docs) | `.windsurf/rules/*.md` in workspace, subdirs, parents to git root; frontmatter `trigger: always_on \| glob \| model_decision \| manual`, `globs`; Devin Desktop also `.devin/rules/`; enterprise system dirs | "Rules files are limited to 12000 characters each" (Windsurf plugin docs page) | yes (Devin Local: `AGENTS.md`, `AGENTS.local.md`, `AGENT.md`, root to cwd) | Devin Local: `.devin/skills`, `.agents/skills`, legacy `.windsurf/skills` / `~/.config/devin/skills`, `~/.agents/skills` | https://docs.devin.ai/windsurf/plugins/cascade/memories , https://docs.devin.ai/desktop/cascade/memories (docs.windsurf.com redirects to docs.devin.ai) |
| OpenCode | `AGENTS.md` (walks up from cwd, first match) / `~/.config/opencode/AGENTS.md`; falls back to `CLAUDE.md`, `~/.claude/CLAUDE.md` | no frontmatter globs; `instructions` array in `opencode.json` takes file globs (e.g. `.cursor/rules/*.md`, `packages/*/AGENTS.md`) and remote URLs (5 s timeout) | none stated | yes (native) | `.opencode/skills` (cwd up to root), compat `.claude/skills`, `.agents/skills` / `~/.config/opencode/skills`, `~/.claude/skills`, `~/.agents/skills`; extra `skills` array (paths, HTTP catalogs); loaded via `skill` tool, permission `allow/ask/deny`; V2 does not enforce name regex or description length | https://opencode.ai/docs/rules/ , https://opencode.ai/docs/skills/ |
| Cline | `.clinerules/` or `.cline/rules/` (all files); global `~/Documents/Cline/Rules`, `~/.cline/rules`; `~/.agents/AGENTS.md` | frontmatter `paths:` list of globs (`*`, `**`, `?`, `[abc]`, `{a,b}`); no frontmatter = always; `paths: []` = never; invalid YAML fails open | none numeric ("rules consume context tokens") | yes (`AGENTS.md`, also auto-detects `.cursorrules`, `.windsurfrules`) | `.cline/skills`, `.clinerules/skills`, `.claude/skills` / `~/.cline/skills` (global wins on clash); `description` max 1024; "Keep SKILL.md under 5k tokens" | https://docs.cline.bot/features/cline-rules , https://docs.cline.bot/features/skills |
| Roo Code | `.roo/rules/`, `.roo/rules-{mode}/`, fallback `.roorules`; `AGENTS.md` (setting `roo-cline.useAgentRules`) | no globs on the page | none stated | yes | – | https://roocodeinc.github.io/Roo-Code/features/custom-instructions . **Shut down** ("The Roo Code Extension was shut down on May 15th"; repo archived, last push 2026-05-15): https://roocodeinc.github.io/Roo-Code/ , https://github.com/RooCodeInc/Roo-Code |
| Zed | first match only, in order: `.rules`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md`, `AGENT.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`; personal `~/.config/zed/AGENTS.md` | no globs | none stated | yes, but loses to any earlier file in the list | `.agents/skills` (direct children only) / `~/.agents/skills`; fields `name`, `description` (>1024 warns), `disable-model-invocation` | https://zed.dev/docs/ai/instructions , https://zed.dev/docs/ai/skills |
| JetBrains Junie | project: `.junie/AGENTS.md` (exclusive if present), else root `AGENTS.md` + `.junie/playbook.md` + `.junie/rules/*.md`, else legacy `.junie/guidelines.md`; global `~/.junie/AGENTS.md` | no globs on the page | none stated | yes | `.junie/skills`, `.agents/skills` (trusted project) / `~/.junie/skills`, `~/.agents/skills`; `name` required, `description` optional (falls back to first paragraph) | https://junie.jetbrains.com/docs/guidelines-and-memory.html , https://junie.jetbrains.com/docs/agent-skills.html |
| Aider | no auto file; load with `--read CONVENTIONS.md` / `/read` or `read:` in `.aider.conf.yml` (read-only, cached with prompt caching) | no | none stated | not stated on the page | – | https://aider.chat/docs/usage/conventions.html (repo last push 2026-05-22) |
| Amp | `AGENTS.md` cwd and parents up to `$HOME`, subtree files on read; fallback `AGENT.md` or `CLAUDE.md` per dir; `~/.config/amp/AGENTS.md`, `~/.config/AGENTS.md`; `@`-mentions incl. globs | a mentioned file may carry frontmatter `globs:`; included only after Amp read a matching file; globs implicitly prefixed `**/` | none stated | yes (native) | `.agents/skills`, `.claude/skills` (cwd and parents) / `~/.config/agents/skills`, `~/.agents/skills`, `~/.config/amp/skills`, `~/.claude/skills`; `amp skill add <source>` | https://ampcode.com/docs/customize/agents-md , https://ampcode.com/docs/customize/skills |
| Kiro | `.kiro/steering/*.md` / `~/.kiro/steering/` | frontmatter `inclusion: always` (default) \| `fileMatch` + `fileMatchPattern` (glob or array) \| `manual` (`#name`) \| `auto` + `name` + `description`; CLI V3 supports all four, V1/V2 only `always`. Refs `#[[file:path]]` | none stated | yes (always included; root, subdirs, `~/.kiro/steering/`) | `.kiro/skills` / `~/.kiro/skills` (agentskills.io fields); import via UI | https://kiro.dev/docs/steering/ , https://kiro.dev/docs/skills/ |

### Adapter takeaways (from the table only)

- `.agents/skills/<name>/SKILL.md` is read natively by Codex, Cursor, Copilot, Gemini CLI (alias), Antigravity, Devin/
  Windsurf, OpenCode, Zed, Junie, Amp. Claude Code reads `.claude/skills`; Cline reads `.cline/skills` / `.claude/skills`;
  Kiro reads `.kiro/skills`. So two or three skill copies (or links) cover nearly all.
- Glob-scoped always-on rules exist in: Claude Code (`.claude/rules` `paths`), Copilot (`applyTo`), Cursor (`.mdc`
  `globs`), Antigravity and Windsurf (`trigger: glob` + `globs`), Cline (`paths`), Kiro (`fileMatchPattern`), Amp
  (`globs` in mentioned files). Skills can also be path-scoped in Claude Code and Cursor (`paths`). Codex, Gemini CLI,
  OpenCode, Zed, Junie, Aider have no glob scoping: directory placement only.
- `AGENTS.md` is the lowest common always-on file, with caveats: Claude Code skips it when any CLAUDE.md exists; Zed
  takes only the first file of its list; Gemini CLI needs `context.fileName`.
- Hard size numbers: Codex 32 KiB total AGENTS chain; Antigravity 24,000 bytes per rule and 20,000 tokens always-on;
  Windsurf 12,000 chars per rule file; Claude Code 200-line target, 500-line SKILL.md, 1,536-char listing; spec 1024-char
  description, <5,000-token body; Codex skill list 2% of context.
- A Claude Code plugin cannot ship always-on instructions: "A `CLAUDE.md` at the plugin root isn't loaded as context";
  instructions must be skills (https://code.claude.com/docs/en/plugins-reference , Standard layout).
- Review-specific files exist: Copilot `REVIEW.md` for code review (support matrix page), Cursor Bugbot
  `.cursor/BUGBOT.md`, Amp `.agents/checks/<name>.md`, Kilo `REVIEW.md` (as described by rulesync docs, see section 3).

### Framework-shipped agent context (official, front-end)

- **Next.js** (https://nextjs.org/docs/app/guides/ai-agents , lastUpdated 2026-10-15): 16.2+ bundles version-matched docs at
  `node_modules/next/dist/docs/`; 16.3+ `next dev` writes a managed block into root `AGENTS.md` between
  `<!-- BEGIN:nextjs-agent-rules -->` / `<!-- END:nextjs-agent-rules -->` and only rewrites inside the markers
  (config `agentRules`). Older versions: `npx @next/codemod@canary agents-md` writes `.next-docs/`. Next.js skills
  (`next-dev-loop`, `next-bundle-optimizer` with an audit-only report mode, cache-components / partial-prefetching
  adoption) live in `vercel/next.js/skills` and install via `npx skills add vercel/next.js --skill <name>`.
- Vercel eval (https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals , 2026-01-27): Next.js 16 API
  evals: no docs 53%, skill default 53% (skill not invoked in 56% of cases), skill + explicit AGENTS.md instruction
  79%, AGENTS.md docs index 100%; index compressed from ~40KB to 8KB with no loss. Their conclusion: passive
  always-on context wins for framework knowledge; skills suit user-triggered workflows.
- Design hint for Frontend Skills: the marker-block pattern lets a tool own a section of a shared `AGENTS.md` /
  `CLAUDE.md` without clobbering user text, and is idempotent on re-run.

## 2. Official / vendor skill repositories (front-end relevant)

| Repo | Licence (read) | Contents (counts on 2026-11-11) | Agents served / install | Adapts to stack | Audits or instructs | Token handling | Cites sources | Maintenance |
|---|---|---|---|---|---|---|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | no root LICENSE; per-skill `LICENSE.txt` = Apache-2.0 (read for `frontend-design`, `docx`); README says docx/pdf/pptx/xlsx are also Apache 2.0 | 19 skills; FE: `frontend-design` (visual direction, anti-"templated" typography), `web-artifacts-builder`, `webapp-testing`, `theme-factory`; also `spec/` and `template/` | Claude Code plugin marketplace: `/plugin marketplace add anthropics/skills`, `/plugin install example-skills@anthropic-agent-skills`; also any `SKILL.md` reader | no | instructs | short SKILL.md, scripts kept out of context | no standard citations in `frontend-design` | push 2026-11-06, ~192.8k stars, 1,516 open issues+PRs |
| [openai/skills](https://github.com/openai/skills) | no root LICENSE; README: licence per skill in `LICENSE.txt` (read `playwright`: Apache-2.0) | `.system` 5 (auto-installed in Codex), `.curated` 39 (FE-adjacent: `playwright`, `playwright-interactive`, `screenshot`, figma-* x7, `vercel-deploy`, `netlify-deploy`), `.experimental` | Codex `$skill-installer <name>` | no | instructs | Agent Skills layout (`references/`, `scripts/`, `agents/openai.yaml`) | – | push 2026-10-28, ~28.7k stars, 296 open |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | no LICENSE file found; README "License: MIT"; `react-best-practices` and `react-view-transitions` frontmatter `license: MIT` | 9 skill dirs: `react-best-practices` (70 rule files in `rules/`, prefixes `async-`, `bundle-`, `server-`, `client-`…, priority CRITICAL→LOW; compiled `AGENTS.md` 108,261 bytes), `composition-patterns`, `react-native-skills`, `react-view-transitions`, `web-design-guidelines`, `writing-guidelines`, `vercel-optimize`, deploy skills | `npx skills add vercel-labs/agent-skills` (any of ~80 agents) | no | `web-design-guidelines` is a review skill: fetches rules live from `vercel-labs/web-interface-guidelines/command.md` (191 lines, MIT) and prints findings as terse `file:line` grouped by file, no rule ids; `react-best-practices` has stable rule slugs (file names) usable as ids | progressive: SKILL.md index + per-rule files; but compiled AGENTS.md is large | `metadata.json` lists references (react.dev, nextjs.org, Vercel blog posts) | push 2026-10-28, ~33.9k stars, 196 open |
| [GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance) (+ source repo [modern-web-guidance-src](https://github.com/GoogleChrome/modern-web-guidance-src), Apache-2.0) | Apache-2.0 (LICENSE read) | skills `modern-web-guidance` (~205 tokens) and `chrome-extensions` (~175 tokens); 209 guide `.md` files; README lists 140 CSS, 36 HTML, 74 JS features | `npx modern-web-guidance@latest install` wizard; also `npx skills add`, Claude/Codex/Cursor/Grok/Kimi plugin manifests, `agy plugin install`, Gemini extension | Baseline-aware: default target "Baseline Widely available"; user can set a custom policy; `.mwgrc` gates Origin Trial / volatile features | both: `search` / `retrieve` (offline embedding + BM25) for guidance, and **`legacy-scan <path> --json`**: static scan for legacy patterns, covers "~20% of the catalog" that has deterministic rules, findings map to guide ids | very small SKILL.md; guides pulled one at a time by CLI; evals used to prune content models already know | guides link web-features / Baseline data | push 2026-11-10, ~3.8k stars, 1 open; telemetry on by default (`DISABLE_TELEMETRY=1`) |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Apache-2.0 | 7 skills: `a11y-debugging` (web.dev-based a11y audit with tree snapshot + `lighthouse_audit`), `debug-optimize-lcp`, `chrome-devtools`, `chrome-devtools-cli`, `cookie-debugging`, `memory-leak-debugging`, `troubleshooting` | Claude Code plugin (`/plugin marketplace add ChromeDevTools/chrome-devtools-mcp`), manual copy | no | runtime audit via a browser (needs a running page) | skills short, data via MCP tools | points to web.dev (`.md.txt` trick) | push 2026-11-11, ~55.1k stars, 121 open |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | MIT | 461 skills, 227 agents, 195 instructions, 112 plugins, 8 hooks, 8 workflows. FE instructions: `a11y`, `astro`, `nextjs`, `nextjs-tailwind`, `svelte`, `vue`, `tailwind-v4-vite`, `performance-optimization`, `html-css-style-color-guide`… FE skills: `web-design-reviewer`, `react-audit-grep-patterns`, `react18-*`/`react19-*`, `premium-frontend-ui`, `anti-ui-slop`, `webapp-testing` | `copilot plugin install <name>@awesome-copilot` (marketplace pre-registered in Copilot CLI / VS Code); `gh skill install github/awesome-copilot`; `llms.txt` index | no | mostly instructs; some review skills | example of cost: `a11y.instructions.md` is 27,608 bytes with `applyTo: '**'`, i.e. attached to every file | varies; README warns content is third-party | push 2026-11-11, ~41k stars, 51 open |
| [cloudflare/skills](https://github.com/cloudflare/skills) | Apache-2.0 | 22 skills; FE: `web-perf` (CWV / Lighthouse audit; tells agent to prefer retrieval over pre-training for numbers), `nextjs-on-cloudflare`, `frameworks-on-cloudflare`, `turnstile-spin`; `rules/workers.mdc` | Codex / Claude / Cursor / Antigravity plugin manifests; `npx skills add` | no | `web-perf` audits (runtime) | – | – | push 2026-11-10, ~3.3k stars, 36 open |
| [microsoft/skills](https://github.com/microsoft/skills) | MIT | README: 174–175 skills, Azure SDK / Foundry focused; custom agents incl. "frontend" | `npx skills add microsoft/skills` | no | instructs | – | – | push 2026-11-11, ~3.2k stars. Low FE relevance |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) | MIT (API) | Postgres / Supabase skills | Claude plugin, skills CLI | no | instructs | – | – | push 2026-11-10, ~3k stars. Not FE |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Apache-2.0 | marketplace.json lists 317 plugins; FE-relevant entries include `frontend-design`, `modern-web-guidance`, `playwright`, `figma`, `vercel`, `superdesign`, `ui5`, `ui-theme-designer`, `browser-use` | Claude Code `/plugin install <name>@claude-plugins-official` | – | – | – | – | push 2026-11-11, ~46.8k stars, 1,293 open |
| [agentskills/agentskills](https://github.com/agentskills/agentskills) | Apache-2.0 | spec + `skills-ref` validator | – | – | validates SKILL.md format only | defines the 100-token / 5,000-token / 500-line guidance | – | push 2026-11-04, ~27.2k stars |
| [agentsmd/agents.md](https://github.com/agentsmd/agents.md) (site https://agents.md) | MIT | AGENTS.md convention site; "stewarded by the Agentic AI Foundation under the Linux Foundation"; plain Markdown, no required fields, nearest file wins | – | – | – | – | – | push 2026-09-10, ~25.4k stars (repo moved from openai/agents.md) |

## 3. Installers, registries, sync tools

| Tool | Licence | What it does | Agents | Stack detection | Condenses / measures tokens | Audit | Maintenance |
|---|---|---|---|---|---|---|---|
| `skills` CLI / skills.sh ([vercel-labs/skills](https://github.com/vercel-labs/skills), https://skills.sh) | MIT | `npx skills add owner/repo [--skill x] [-a agent]`, `find`, `list`, `use` (run without install), `check`, `update`, `remove`, `init`; canonical copy in `.agents/skills/` plus **symlinks** per agent (or `--copy`); `skills-lock.json` v2 with content hash and `install --frozen-lockfile`. `experimental_sync` links skills shipped inside npm dependencies (root `SKILL.md`, `skills/<n>/SKILL.md`, `dist/skills/...`) and a `skills` array in `package.json` | README: OpenCode, Claude Code, Codex, Cursor "and 75 more" (docs/agents.md table: per-agent project/global dirs) | detects **installed agents**, not the stack; `experimental_sync` is dependency-driven (installs skills that packages in `package.json` ship) | no condensing | skills.sh shows third-party security audits per skill (Gen Agent Trust Hub, Socket, Snyk) at https://skills.sh/audits; no code audit | push 2026-11-10, ~38.9k stars, 741 open; telemetry on (`DISABLE_TELEMETRY=1`). skills.sh leaderboard: `find-skills` 4.3M installs; FE: `frontend-design` 1.1M, `vercel-react-best-practices` 889.5K, `web-design-guidelines` 849.5K |
| `gh skill` (GitHub CLI, preview; read from `gh skill install --help`, gh 2.100.0, and https://cli.github.com/manual/gh_skill) | MIT (GitHub CLI) | `install`, `list`, `preview`, `publish [--dry-run]`, `search`, `update`; discovers `skills/*/SKILL.md`; version = latest tag else HEAD, `--pin` tag/SHA; injects source-tracking metadata into frontmatter; copies (no symlinks) | ~50 `--agent` values; Copilot, Cursor, Codex, Gemini CLI, Antigravity, Amp, Cline, OpenCode, Warp share `.agents/skills` (installed once) | no | no | `publish --dry-run` validates | in gh 2.100.0 (2026-09-03) |
| [rulesync](https://github.com/dyoshikawa/rulesync) | MIT | one source in `.rulesync/` (rules with `root`, `targets`, `globs`, `description` frontmatter; commands; subagents; skills; hooks; MCP; permissions; **checks**) → `rulesync generate --targets "*" --features "*"`; `import` from existing files; converts Cursor→Copilot/Claude directly | README AI-tools table: 65 rows (incl. Claude Code, Codex, Copilot, Cursor, Antigravity IDE/CLI, Kiro, Junie, Zed, Devin Desktop, OpenCode, Cline…); tracks deprecations (Roo → Zoo Code, Continue EOL 2026-06-18) | no | no condensing; knows per-target limits (e.g. Antigravity 24,000 bytes/file) and warns on Agent Skills name/description constraints | `checks` = per-check code-review instructions with `severity` (low…critical), emitted to Amp `.agents/checks/<n>.md`, Cursor `.cursor/BUGBOT.md`, Kilo `REVIEW.md`, Qwen `.qwen/review-rules.md`, Rovo Dev `.rovodev/.review-agent.md` — the agent does the review, rulesync does not scan code | push 2026-11-09, ~1.6k stars, 68 open. Docs https://rulesync.dyoshikawa.com/reference/file-formats |
| [ruler](https://github.com/intellectronica/ruler) | MIT | `.ruler/*.md` (+ `ruler.toml`) concatenated and written to each agent's file by `npx @intellectronica/ruler apply`; `--nested` for per-directory `.ruler/`; MCP config too; skills dirs per agent | 32 agents in README table (e.g. Copilot/Codex/Cursor/Windsurf/Gemini CLI/Amp/OpenCode/Zed → `AGENTS.md`; Claude → `CLAUDE.md`; Junie `.junie/guidelines.md`; Kiro steering; Antigravity `.agent/rules/ruler.md`) | no | no (plain concatenation, no glob translation) | no | push 2026-11-04, ~3k stars, 21 open |
| Claude Code plugin marketplaces (https://code.claude.com/docs/en/plugins-reference) | – | `.claude-plugin/marketplace.json` lists plugins; plugin = `skills/`, `agents/`, `hooks/`, `.mcp.json`, `bin/`, etc.; `claude plugin validate [--strict]`; `claude plugin eval` (eval suites); root `CLAUDE.md` in a plugin is **not** loaded | Claude Code (Codex, Cursor, Copilot CLI, Antigravity, Grok, Kimi have their own plugin manifests, as seen in modern-web-guidance and cloudflare/skills repos) | no | Claude Code `/doctor prompt-audit` audits CLAUDE.md / AGENTS.md / rules / skills for conflicts (https://code.claude.com/docs/en/memory) | no code audit | – |
| Tessl registry (https://tessl.io/registry) | not checked | skill registry; each skill shows Quality score, Impact score (measured agent behaviour change via eval scenarios) and Security (Snyk scan); `npx tessl i github:<owner>/<repo> --skill <n>`, `npx tessl search` | not stated | not stated | evals per skill | security scan of skills, not of the user's code | – |
| cursor.directory ([cursor/community-plugins](https://github.com/cursor/community-plugins), moved from pontusab/cursor.directory) | no LICENSE file found | Next.js app; "The directory of plugins from the Cursor community"; data in Supabase, not in repo | Cursor | no | no | no | push 2026-11-05, ~4k stars; site returned HTTP 429 on 2026-11-11 |

### What already overlaps with Frontend Skills' plan

- **Multi-agent install**: solved and crowded (`skills` CLI ~80 agents, `gh skill` ~50, rulesync 65, ruler 32, vendor
  plugin manifests). Frontend Skills should reuse `.agents/skills` + `.claude/skills` (+ `.kiro/skills`, `.cline/skills`)
  conventions, or simply be installable by `npx skills add` / `gh skill install`, rather than invent a new installer.
- **Stack detection**: no official tool found that reads the project stack and picks skills. Nearest: `skills
  experimental_sync` (installs skills shipped *by* dependencies in `package.json`), Next.js `next dev` writing its own
  managed block when it sees an agent, modern-web-guidance's Baseline target / `.mwgrc`. Community claims (stack-detector
  skill in drvoss/everything-copilot-cli, mcp-skills) were seen only in search results, not verified.
- **Audit with stable ids**: closest official piece is modern-web-guidance `legacy-scan --json` (static, deterministic,
  ~20% of its catalog, findings keyed to guide ids). Vercel `web-design-guidelines` outputs `file:line` findings but
  without rule ids or standard citations; `react-best-practices` has 70 slug-named rules (usable as ids) but no
  scanner. Chrome DevTools `a11y-debugging` and Cloudflare `web-perf` audit at runtime. Review-rule formats with
  severity exist as targets (rulesync `checks`, Cursor `BUGBOT.md`, Amp `.agents/checks`, Copilot `REVIEW.md`).
  Nothing found combines stack detection + per-agent install + static audit report with rule ids + public-standard
  citations.
- **Token cost**: only modern-web-guidance (eval-pruned guides, on-demand retrieval, ~200-token skill) and Vercel's
  8KB compressed AGENTS.md index show measurement. Counter-examples: awesome-copilot `a11y.instructions.md` 27.6KB on
  `**`; Vercel compiled `AGENTS.md` 108KB.

---

# Part B: community collections that touch front-end work

## 4. Awesome lists and big catalogues

| repo (URL) | licence (read) | ★ / last push | what it holds (counts) | front-end entries seen | agents | notes on quality |
|---|---|---|---|---|---|---|
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | MIT | 37,073 / 2026-11-05 | README of 2,015 lines, ~669 GitHub links; groups skills by publishing team | anthropics/frontend-design, web-artifacts-builder; vercel-labs react-best-practices, web-design-guidelines, composition-patterns, next-best-practices; cloudflare/web-perf; google-labs-code shadcn-ui and design-md; angular/angular-developer; microsoft/frontend-design-review; openai/frontend-skill; Figma skills; an "Addy Osmani (Web Quality)" section; coreyhaines31 seo-audit and schema | CC, CX, GE, CU and others (repo description) | Links only, no content. Best map of **vendor** front-end skills. Web accessibility is thin: apart from the Addy section I found only a Flutter a11y entry. |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | **CC-BY-NC-ND-4.0** (LICENSE read) | 57,753 / 2026-11-11 | 881-line README, ~243 GitHub links | "Design & UI/UX" section: atelier, UI Craft, Diagram Design; chrome-cdp-ex (browser skill) | CC | Non-commercial, no derivatives: link only, never copy. |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | none found | 79,244 / 2026-09-18 | 503-line README | artifacts-builder, canvas-design, brand-guidelines, webapp-testing | CC | Hardly any front-end entries; no licence. |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | none found | 15,778 / 2026-04-28 | 453-line README | frontend-design, web-artifacts-builder, canvas-design, frontend-slides | CC | No licence. Pushed about 6 months ago. |
| [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | CC0-1.0 | 41,146 / 2026-05-30 | 257 `.mdc` files in `rules/`; ~90 have a front-end name (React, Next, Vue, Angular, Svelte, Tailwind…) | `cypress-accessibility-testing…`, `playwright-accessibility-testing…`, `nextjs-seo-dev…`, `cursor-ai-nextjs-14-tailwind-seo-setup` | CU (`.mdc`) | Public domain, so text **can** be reused. The rules are user-submitted prompt files: many are pinned to old versions (the file names say "nextjs-14"), and I saw no source links. Treat it as a list of topics, not as a source of facts. |
| [sanjeed5/awesome-cursor-rules-mdc](https://github.com/sanjeed5/awesome-cursor-rules-mdc) | CC0-1.0 | 3,585 / 2026-05-19 | generated `.mdc` rule files per library | per-library rules | CU | Generated by a model, not reviewed per rule; same caution as above. |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) (community part) | MIT | 41,037 / 2026-11-11 | 195 `instructions/*.md`, 227 `agents/*`, 476 `SKILL.md` | instructions: `a11y`, `performance-optimization`, `nextjs`, `nextjs-tailwind`, `vue`, `svelte`, `astro`, `tailwind-v4-vite`, `html-css-style-color-guide`; agents: `accessibility`, `accessibility-runtime-tester`, `frontend-performance-investigator` (uses Chrome DevTools MCP), `expert-react-frontend-engineer`, `nuxt-expert`, `vuejs-expert`, react18/react19 auditors; skill `react-audit-grep-patterns` | CP (also VS Code) | **Token cost problem**: `a11y.instructions.md` is 27,608 bytes with `applyTo: '**'`, and `performance-optimization.instructions.md` is 27,249 bytes with `applyTo: '**'`, so each one loads for **every** file. The a11y file cites WCAG 2.2 criteria by number but has **no URLs**. The globs overlap (`nextjs`, `nextjs-tailwind` and `vue` all match `**/*.ts`), so installing several stacks them up. |
| [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) (the old name `antigravity-awesome-skills` redirects here) | MIT | 49,525 / 2026-11-11 | 9,448 `SKILL.md` paths in the tree (plugin copies included); ~986 with a front-end word in the path | includes copies of the AccessLint skills (`accesslint-audit/diff/scan`), `fixing-accessibility`, `screen-reader-testing` | CC, CX, CU, GE | Mass aggregation. It **vendors skills whose source repo has no licence** (AccessLint/skills, see §6), so its MIT label does not clear those files. Do not copy from it; trace each file to its source. |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) (was `everything-claude-code`) | MIT | 301,045 / 2026-11-09 | 1,068 `SKILL.md` (translations included); ~84 front-end | `skills/frontend-a11y` (12,860 B, 1 URL, no WCAG version named), `skills/accessibility` (6,545 B, says WCAG 2.2, 5 URLs), `seo` | CC, CX, OC, CU | Very large harness. Front-end skills are generic; they cite few sources. |
| [wshobson/agents](https://github.com/wshobson/agents) | MIT | 42,412 / 2026-11-09 | 185 `SKILL.md`; ~23 front-end | plugin `accessibility-compliance`: `wcag-audit-patterns` (2,510 B, WCAG 2.2, 0 URLs), `screen-reader-testing`; plugin `ui-design` | CC, CX, CU, OC, CP and more; written once in Markdown, then generators adapt it to each tool (repo description) | Good build pattern (one source, generated per agent, validated). The a11y skill is short and unsourced. |
| [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) | MIT | 33,304 / 2026-11-11 | 926 `SKILL.md`; ~92 front-end | `creative-design/accessibility-auditor` (12,119 B, WCAG 2.1, 2 URLs); several SEO skills | CC | Registry plus CLI. The a11y skill targets WCAG 2.1, not 2.2. |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | MIT | 29,628 / 2026-11-11 | 482 `SKILL.md`; ~28 front-end | `engineering-team/a11y-audit` (9,695 B, mentions WCAG 2.1 and 2.2, 4 URLs), `seo-audit`, `seo-auditor` | CC, CX, GE, CU and 8 more (description) | Broad, mostly non-front-end. |
| [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills) | MIT (LICENSE read; the API says NOASSERTION) | 7,153 / 2026-11-10 | 94 `SKILL.md`; ~17 front-end | `(performance)/core-web-vitals` (12,000 B; thresholds ≤2.5 s / ≤200 ms / ≤0.1; links to web.dev), `perf-lighthouse`, `(quality)/seo`, `(quality)/web-accessibility` | CC, CU, CP, Antigravity… | `web-accessibility` is an **older copy of Addy Osmani's skill** (front matter `author: web-quality-skills`, `version 1.0`, WCAG 2.1), while upstream has moved to WCAG 2.2. Copies drift. |
| [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) | MIT | 12,316 / 2026-11-11 | 67 skills; ~8 front-end | React/Next/Vue/Angular "specialist" skills | CC | Persona-style guidance, no audit. |
| [cursor/community-plugins](https://github.com/cursor/community-plugins) (the old `pontusab/cursor.directory` redirects here) | none found | 4,023 / 2026-11-05 | — | — | CU | No licence; content not assessed. |

---

## 5. Framework packs (React / Next.js / Vue / Nuxt / Svelte / Tailwind)

| repo | licence | ★ / push | contents | agents / install | adapts? | audits? | tokens | sources cited | notes |
|---|---|---|---|---|---|---|---|---|---|
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (vendor; mention only) | README says MIT and each `SKILL.md` front matter says `license: MIT`; **no LICENSE file at root** | 33,877 / 2026-10-28 | `react-best-practices`, `web-design-guidelines`, `composition-patterns`, `react-view-transitions`, `react-native-guidelines`… | skills CLI | no | `web-design-guidelines` reviews files and reports `file:line` | `react-best-practices` ships a compiled `AGENTS.md` of 108,261 B next to 72 rule files | React rules: impact tiers (CRITICAL…LOW) with rule-id prefixes (`async-`, `bundle-`…) | **Contradictory counts**: the README says "40+ rules", `SKILL.md` says "70 rules", and `rules/` holds 72 files. `web-design-guidelines` **fetches its rules from a remote URL** (`raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`) every run, so it is unpinned and depends on the network ([SKILL.md](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)). |
| [vuejs-ai/skills](https://github.com/vuejs-ai/skills) | MIT | 3,324 / 2026-10-23 | 8 skills: `vue-best-practices` (23 files), `vue-router-…`, `vue-pinia-…`, `vue-testing-…`, `vue-options-api-…`, `vue-jsx-…`, `vue-debug-guides`, `create-adaptable-composable` | skills CLI; any agent | partly: it switches to Options API or JSX skills if the project uses them | no | `vue-best-practices` says four core references must stay "in active working context for the entire task" (always loaded) | references, not checked here | Description starts "MUST be used for Vue.js tasks", which pushes it to load often. Vue core people are involved (per [Vue School article](https://vueschool.io/articles/vuejs-tutorials/vue-agent-skills-for-reliable-ai-development/); not a primary source). |
| [antfu/skills](https://github.com/antfu/skills) | MIT | 6,065 / 2026-11-11 | 14 skills: `vue`, `nuxt`, `pinia`, `vite`, `vitepress`, `vitest`, `unocss`, `pnpm`, `nitro` + personal ones | skills CLI or `skills-npm` (installs through the package manager so skills stay in sync) | no | no | per-skill | **each generated skill names its docs source repo** (vuejs/docs, nuxt/nuxt…) | Skills are generated from official docs and then hand-tuned. The README says it is a proof of concept and has not been fully tested. The "generate from docs, keep in sync" idea is worth copying. |
| [onmax/nuxt-skills](https://github.com/onmax/nuxt-skills) | none found | 723 / 2026-11-10 | 30 skills (nuxt, nuxt-ui, nuxt-seo, nuxt-i18n, reka-ui, vueuse…) | skills CLI | no | no | – | – | No licence: link only. |
| [sveltejs/ai-tools](https://github.com/sveltejs/ai-tools) (official Svelte MCP) | MIT | 338 / 2026-11-11 | MCP tools `list-sections`, `get-documentation`, **`svelte-autofixer`**, `playground-link` ([docs](https://svelte.dev/docs/mcp/tools)); skills `svelte-code-writer`, `svelte-core-bestpractices` packaged for CC, CU, OC, Pi | MCP + plugins | yes: the autofixer reads the code it is given | **yes**: static analysis of Svelte code, called in a loop until clean | docs fetched by section on demand | official docs | Best example of "audit tool the agent calls itself". Framework-specific only. |
| [spences10/svelte-skills-kit](https://github.com/spences10/svelte-skills-kit) | none found | 95 / 2026-10-12 | 10 skills (runes, SvelteKit data flow, remote functions…) | CC plugin | no | no | – | – | No licence. |
| [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT | 248 / 2026-10-31 | 187 `SKILL.md`; React, Tailwind v4, `web-performance-audit`, `nuxt-seo` | CC | no | no | short | 0 URLs in the perf skill | **Stale facts**: `web-performance-audit` still lists FID next to INP and imports `getCLS/getFID/getLCP` from `web-vitals`. `getXXX` was renamed `onXXX` in web-vitals v3.0.0 and `onFID` was removed in v5.0.0 (2025-05-07) ([CHANGELOG](https://github.com/GoogleChrome/web-vitals/blob/main/CHANGELOG.md)). |
| [sergiodxa/agent-skills](https://github.com/sergiodxa/agent-skills) | MIT | 92 / 2026-02-01 | `frontend-accessibility-best-practices` (4,065 B) and others | skills CLI | no | no | small | 0 URLs | Built around react-aria-components; no WCAG links. |

Tailwind and shadcn: I found no stand-alone community Tailwind or shadcn pack with real use beyond the vendor ones
(`shadcn-ui/ui` ships `skills/shadcn/SKILL.md` and `skills/migrate-radix-to-base/SKILL.md`; awesome-copilot has
`tailwind-v4-vite.instructions.md`; UI UX Pro Max has `stacks/shadcn.csv` and `stacks/html-tailwind.csv`, see §7).

---

## 6. Accessibility packs and a11y MCP servers

| repo | licence | ★ / push | contents | agents / install | adapts? | audits? | tokens | sources | notes |
|---|---|---|---|---|---|---|---|---|---|
| [Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents) | MIT (LICENSE read); npm `@community-access/accessibility-agents-mcp` 7.1.0 MIT | 445 / 2026-11-09 | **113 skills**: 6 router skills (`accessibility-lead` for HTML/JSX/TSX/Vue/Svelte/CSS, `web-accessibility-wizard`…), specialists, `kb-*` reference skills; hooks; MCP server with 39 tools (axe-core via Playwright, Office/PDF/ePub, report rendering) | CC, CX, CP, GE, Antigravity, ChatGPT (plugins); `npm run setup` copies to `~/.agents/skills` | yes: routers pick specialists by file type | **yes**: scanners plus a **findings JSON schema**; a script renders the report and the score and shows the change since the previous run | README claims about 1,100 tokens before the first prompt because only the 6 routers are visible; `AGENTS.md` kept under 1,200 tokens; `npm run measure` reports cost per client | `references/sources.md`, `wcag22-criteria.json`, URL registries | **Closest to our audit format.** [`findings.schema.json`](https://github.com/Community-Access/accessibility-agents/blob/main/skills/a11y-core/schemas/findings.schema.json) requires `rule` (stable id, e.g. `ARIA-002`), `wcag` (e.g. `1.3.1 A`), `severity` (critical/serious/moderate/minor), `location` (`file:line` or selector), `summary` (≤240 chars), `fix` (≤480); optional `confidence`, `evidence`, `component`; a `passed` list separates "clean" from "not checked". An **edit gate** hook blocks writes to user-facing files until the a11y lead has reviewed. It is a11y only, with no stack-wide rules. |
| [AccessLint/skills](https://github.com/AccessLint/skills) | **none found** in this repo (npm `@accesslint/core` 0.21.0, `@accesslint/cli` 0.13.0 and `@accesslint/mcp` 0.11.1 each say MIT) | 120 / 2026-08-25 | 5 skills: `accessibility-scan` (rule engine on live DOM → selector, `file:line` where source maps allow, evidence, fix), `accessibility-inspect` (keyboard, focus, names, reflow, reduced motion, target size), `accessibility-audit` (WCAG-EM sampling, per-criterion pass/fail/undetermined), `accessibility-fix`, `accessibility-diff` (only what a change introduced) | skills CLI; CC plugin; MCP | yes (live page) | **yes** | small skills; the engine does the work | methodology file | Each finding is graded on **two axes**: severity, and evidence (verified / confirm with a person / person required). The **diff-only mode** fits pull requests. The skills text cannot be adapted (no licence); the npm packages are MIT. |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) `accessibility` | MIT | (see §8) | `accessibility/SKILL.md` (14,358 B) + `references/WCAG.md`, `A11Y-PATTERNS.md` | — | — | — | — | links to [WCAG 2.2 quickref](https://www.w3.org/WAI/WCAG22/quickref/), [ARIA APG](https://www.w3.org/WAI/ARIA/apg/), [Deque axe rules](https://dequeuniversity.com/rules/axe/) | See §8. |
| [mastepanoski/claude-skills](https://github.com/mastepanoski/claude-skills) | MIT | 72 / 2026-10-29 | 14 skills; `wcag-accessibility-audit` (12,033 B; WCAG 2.1 and 2.2; 0 URLs); Nielsen heuristics, Norman | CC and others | no | review by the model | – | none linked | Unsourced. |
| [hoodini/ai-agents-skills](https://github.com/hoodini/ai-agents-skills) | none found | 296 / 2026-11-03 | 40 skills; `web-accessibility` (4,927 B, WCAG 2.1) | CC, CP, CU, WS | no | no | – | 2 URLs | No licence; WCAG 2.1. |
| [ibelick/ui-skills](https://github.com/ibelick/ui-skills) `fixing-accessibility`, `fixing-metadata`, `fixing-motion-performance` | MIT | (see §7) | short "fixing-*" skills (4–6 KB) | — | — | — | — | — | See §7. |
| [dequelabs/axe-mcp-server-public](https://github.com/dequelabs/axe-mcp-server-public) | **Proprietary** (LICENSE: "Proprietary License … All rights reserved"; needs an Axe DevTools for Web subscription) | 9 / 2026-11-10 | docs for Deque's axe MCP Server (Docker); [product page](https://www.deque.com/axe/mcp-server/) | CP, CU, CC, WS, VS Code (Deque page) | yes (live page) | yes (axe + remediation advice) | – | Deque University | Commercial. We may point to it as an optional tool, nothing more. |
| [ronantakizawa/a11ymcp](https://github.com/ronantakizawa/a11ymcp) | MIT; npm `a11y-mcp-server` 1.1.0 MIT | 95 / 2026-03-10 | axe-core + Puppeteer; test URL or HTML string; pick WCAG tags; contrast check | any MCP client | – | yes (runtime) | raw axe output | axe rule help | Says it is not a Deque product. Last push 8 months ago. |
| [JustasMonkev/mcp-accessibility-scanner](https://github.com/JustasMonkev/mcp-accessibility-scanner) | MIT; npm 5.0.0 | 59 / 2026-11-08 | axe scans, keyboard-focus checks, saved reports, annotated screenshots | any MCP client | – | yes | – | – | The README says plainly that automated checks do not certify WCAG conformance. That is good wording to follow. |
| [priyankark/a11y-mcp](https://github.com/priyankark/a11y-mcp) | MPL-2.0 | 53 / 2026-10-26 | axe-core audits of pages | Amp, Cline, CU, CP | – | yes | – | – | MPL-2.0 is file-level copyleft: do not copy its code into MIT files. |
| [ICJIA/axecap-mcp](https://github.com/ICJIA/axecap-mcp) | MIT | 0 / 2026-11-03 | axe-core via Playwright; **compresses and groups results to save context** (description) | CC | – | yes | explicit goal | – | Tiny, but its idea (send grouped results, not raw axe JSON) is useful. |

---

## 7. Design / UI quality packs

| repo | licence | ★ / push | contents (counts) | agents / install | adapts? | audits? | tokens | sources | notes |
|---|---|---|---|---|---|---|---|---|---|
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 (LICENSE read; NOTICE credits MIT content from ehmo/platform-design-skills); npm `impeccable` 4.8.2 | 107,949 / 2026-11-11 | 1 skill with 24 sub-commands (`audit`, `critique`, `polish`, `harden`, `adapt`, `optimize`…); `SKILL.md` 11,608 B plus 45 reference files loaded per command; README claims **62 deterministic detector rules** | `npx impeccable install` detects installed tools: CC, CU, CX, CP, GE, OC, Kiro, Devin and ~10 more; per-tool builds committed (`.claude/`, `.cursor/`, `.agents/`, `.github/`…) | **yes**: `init` writes `PRODUCT.md`, `document` writes `DESIGN.md`, and later commands read them | **yes**: `npx impeccable detect src/` or a URL; `--json`, `--github` (Actions annotations), `--list-rules` with rule ids; exit code 2 = findings; ignores by value or by `<!-- impeccable-disable rule -->` comment; P0–P3 ranking; a hook scans every UI file the agent edits | references load only for the command used | rules come from the author's taste; little external sourcing | **Closest to our "install + rule ids + CLI audit" shape**, but for visual design, not standards. Warning: "live mode" may launch `codex`/`claude` with approvals and sandbox **off** (README), so do not copy that. JSX/TSX get pattern rules only; contrast and tiny-text rules need a rendered URL. |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | 148,030 / 2026-11-10 | README counts: 80 styles (51 active), 192 palettes, 74 font pairings, 25 chart types, **22 stacks**, 120 UX guidelines, 192 reasoning rules; data in CSV files searched by Python (`scripts/search.py`, BM25) | `uipro init --ai claude/cursor/windsurf/copilot/codex/gemini/kiro/…`; CC plugin; skills CLI | yes: generates a design system from the product type | no (generates, does not check) | **good pattern**: big data stays in CSV; only search hits enter context | stack CSVs have `Docs URL` and `Verified At` columns (e.g. `stacks/react.csv` rows link react.dev, verified 2026-08-13); `ux-guidelines.csv` has **no source column** | Mixed quality: UX row 1 tells you to use `scroll-behavior: smooth` at "High" severity with no reduced-motion caveat. Needs Python 3. Its data includes Google Fonts licence data (433 KB JSON). |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT | 113,249 / 2026-11-08 | `SKILL.md` 30,970 B; scripts check the built page in a real browser and apply a "finish gate" | skills CLI; CC and CX plugins; needs Node 22 + Chrome | yes (brief) | browser check of its own rules | one large file | credits for photos | Aimed at marketing sites; a large always-read skill. |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT | 56,000 / 2026-11-09 | 18 skills (animation review, `animation-performance`, `mobile-native`, `break-ui`, `pick-ui-library`…); `emil-design-eng/SKILL.md` 27,509 B | skills CLI | no | review skills (`review-animations`, `improve-animations`) | main skill is large | links to the author's own articles and easing sites | Opinion from experience; useful for motion; not standards-based. |
| [ibelick/ui-skills](https://github.com/ibelick/ui-skills) | MIT | 10,956 / 2026-11-11 | 9 skills: `baseline-ui` (3,419 B), `fixing-accessibility` (4,718 B), `fixing-metadata`, `fixing-motion-performance`, `improve-ui`, `create-design-md`… | `npx ui-skills get <name>`; MCP at `https://www.ui-skills.com/mcp` (`list_skills`, `get_skill`) | no | "fixing-*" skills review code | **small files**; a registry served on demand | – | Short, focused skills, a good size model. |
| [Dammyjay93/interface-design](https://github.com/Dammyjay93/interface-design) | MIT | 5,961 / 2026-06-20 | design "memory" across sessions for app UIs (not marketing sites) | CC | yes (remembers decisions) | consistency checks (README) | – | – | Same idea as Impeccable's `DESIGN.md`. |
| [anthropics/skills](https://github.com/anthropics/skills) `frontend-design` (vendor; mention) | none found at root (only `THIRD_PARTY_NOTICES.md`) | 192,807 / 2026-11-06 | — | — | — | — | — | — | Listed by almost every awesome list. Licence per skill is for part A. |

---

## 8. Web performance, Lighthouse and SEO packs, plus perf MCP servers

| repo | licence | ★ / push | contents | agents / install | adapts? | audits? | tokens | sources | notes |
|---|---|---|---|---|---|---|---|---|---|
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT | 3,067 / 2026-08-24 | 6 skills: `web-quality-audit`, `performance`, `core-web-vitals`, `accessibility`, `seo`, `best-practices`; `SKILL.md` files of 9.7–14.4 KB, each with 1–3 `references/*.md` (3–9 KB) | skills CLI; CC plugin (`.claude-plugin`), CX plugin, GE extension | partly: routes to whatever tool is present | **yes, two layers**: (1) `scripts/analyze.sh`, a read-only bash/grep smoke test of HTML that prints JSON and caps findings (100 total, 20 per check per file; needs `jq`; checks doctype, charset, viewport, `lang`, `<title>`, `<img>` without `alt`, `http://` URLs); (2) live evidence via Chrome DevTools MCP (`performance_start_trace`, `performance_analyze_insight`, `lighthouse_audit`, `take_snapshot`) or the Lighthouse CLI | split into SKILL + references | WCAG 2.2 quickref, APG, Deque rules, Chrome blog on Lighthouse 13 insights | **Closest to our perf/a11y audit content** and MIT. Weak spots: the static script only reads `.html` (not JSX/Vue/Svelte); thresholds are written as "< 2.5s", "< 200ms", "< 0.1", but the official "good" limits are "≤" at the 75th percentile, so recheck before reuse; it tells you to keep measured findings apart from guesses based on code, which is a good rule. |
| [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills) perf skills | MIT | (see §4) | `core-web-vitals`, `perf-lighthouse`, `seo` | — | — | — | — | web.dev links | Thresholds written with "≤". The a11y skill is a stale fork (§4). |
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | MIT | 28,023 / 2026-11-10 | 26 sub-skills + 19 agents (description): technical SEO, schema, Core Web Vitals, E-E-A-T, AI search, local, international; 9 optional extensions for live data | CC | yes (site crawl) | yes (report in Markdown/PDF/JSON) | many agents | – | The README is heavy on marketing (price comparison with agencies). Broad SEO, beyond what a front-end dictionary needs. |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Apache-2.0; npm 1.12.0 | 55,092 / 2026-11-11 | MCP tools (trace, insights, `lighthouse_audit`, snapshots…); skills `a11y-debugging`, `debug-optimize-lcp`, `chrome-devtools`, `memory-leak-debugging`, `troubleshooting` | any MCP client; `--slim` exposes fewer tools | live page | yes (runtime) | `--slim` mode exists to cut tool count | — | The de-facto runtime partner. Addy's skill notes that `lighthouse_audit` leaves out performance, so a trace is needed for that ([SKILL.md](https://github.com/addyosmani/web-quality-skills/blob/main/skills/web-quality-audit/SKILL.md)); I did not check this in the MCP's own docs. |
| [danielsogl/lighthouse-mcp-server](https://github.com/danielsogl/lighthouse-mcp-server) | MIT; npm `@danielsogl/lighthouse-mcp` 2.0.1 | 75 / 2026-11-09 | 13+ tools: `run_audit`, `get_core_web_vitals`, `check_performance_budget`, mobile/desktop compare; every tool declares an `outputSchema` (typed results) | any MCP client; Node 22 + Chrome | – | yes | structured output | Lighthouse | Typed output is the right idea for feeding an audit report. |
| [priyankark/lighthouse-mcp](https://github.com/priyankark/lighthouse-mcp) | MIT; npm `lighthouse-mcp` 0.1.21 | 219 / 2026-11-10 | Lighthouse audits, device and throttling options | Amp, Cline, CU, CC, CX, CP | – | yes | – | – | Simple wrapper. |

---

## 9. Stack detection + install (+ audit): who already does what we plan

| project | licence | ★ / push | detects stack? | installs per agent? | audit report with rule ids? | notes |
|---|---|---|---|---|---|---|
| [midudev/autoskills](https://github.com/midudev/autoskills) | **CC-BY-NC-4.0** (LICENSE read; npm `autoskills` 0.4.1 says the same) | 6,997 / 2026-11-08 | **yes**: reads `package.json`, Gradle files and config files; covers React, Next, Vue, Nuxt, Svelte, Angular, Astro, Tailwind, shadcn and ~40 more | yes (`-a cursor claude-code`); `--dry-run`; writes `skills-lock.json` | **no** | **The nearest to our start command.** Skills come from a curated registry; each change is screened by a model for prompt injection, stored with SHA-256 hashes and checked on install. It ships no rules of its own and no audit. **Non-commercial licence: we must not copy its code or registry; we may describe it and link to it.** |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | (§7) | detects agents, not stack | yes, ~20 agents | **yes** (62 detector rules, JSON/GitHub output) | Design only. |
| [Community-Access/accessibility-agents](https://github.com/Community-Access/accessibility-agents) | MIT | (§6) | routes by file type | yes (plugins for CC/CP/CX/GE; setup script) | **yes** (schema with rule + WCAG SC + severity + `file:line` + fix) | A11y only. |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | MIT | (§8) | no | plugins for CC/CX/GE | partly (`file:line` JSON from a grep script, without stable rule ids) | Perf/a11y/SEO advice. |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | (§7) | user picks a stack (22) | yes (`uipro init --ai …`) | no | Generates, does not audit. |
| [sveltejs/ai-tools](https://github.com/sveltejs/ai-tools) | MIT | (§5) | Svelte only | MCP + plugins | autofixer findings, no public rule-id list seen | Framework-owned checker. |

**No project I found combines all of: stack detection → installing only the matching skills in each agent's format →
one cross-area audit report (a11y + perf + framework + SEO) with stable rule ids, standard sources and fixes, under a
permissive licence.** The pieces exist separately: detection and install (autoskills, non-commercial), a findings
schema (accessibility-agents, MIT), a deterministic CLI detector with rule ids and CI output (Impeccable, Apache-2.0),
and perf/a11y content with a live-evidence workflow (web-quality-skills, MIT).

---

## 10. Framework AI docs (llms.txt, MCP, bundled docs) as sources

HTTP status and byte size from `curl -sL` on 2026-11-11.

| framework | what exists today | size | notes for us |
|---|---|---|---|
| Next.js | [`/docs/llms.txt`](https://nextjs.org/docs/llms.txt), [`/docs/llms-full.txt`](https://nextjs.org/docs/llms-full.txt); every docs page also at `.md`; **docs bundled in `node_modules/next/dist/docs/` since 16.2**; from 16.3 `next dev` writes a managed block in `AGENTS.md` pointing to them (`agentRules` config); MCP at `/_next/mcp`; workflow skills in [vercel/next.js/skills](https://github.com/vercel/next.js/tree/canary/skills) (6 folders, e.g. `next-dev-loop`, `next-bundle-optimizer`) ([guide](https://nextjs.org/docs/app/guides/ai-agents)) | 51,443 B / 4,474,883 B | The guide reports 100% pass with bundled docs against up to 79% for skill-based setups, and says framework knowledge should come from bundled docs while skills cover workflows. **Our Next skills should not repeat framework API docs; they should point to the bundled docs and keep to checks.** Never edit inside its managed block. |
| Svelte | [`/llms.txt`](https://svelte.dev/llms.txt) index plus `llms-small.txt`, `llms-medium.txt`, `llms-full.txt`, and per package `/docs/svelte/llms.txt`, `/docs/kit/llms.txt` ([page](https://svelte.dev/docs/llms)); official MCP with `svelte-autofixer` | 1,676 / 52,700 / 884,580 / 1,278,147 B | Size tiers are a good model; we can point to `llms-small.txt`. |
| Angular | [`/llms.txt`](https://angular.dev/llms.txt), [`llms-full.txt`](https://angular.dev/assets/context/llms-full.txt), [`best-practices.md`](https://angular.dev/assets/context/best-practices.md); per-editor rules files (`GEMINI.md`, `AGENTS.md`, `angular-20.mdc`, `guidelines.md`); experimental Angular CLI MCP server; an "Agent Skills" page ([page](https://angular.dev/ai/develop-with-ai)) | 6,745 / 861,890 / 2,909 B | `best-practices.md` is tiny and official: link it rather than rewrite it. The page's Cursor link text says `cursor.md` but the file is `angular-20.mdc`. |
| Vue | [`/llms.txt`](https://vuejs.org/llms.txt), `/llms-full.txt`; each guide page offers a `.md` version | 7,415 / 953,556 B | – |
| Nuxt | [`/llms.txt`](https://nuxt.com/llms.txt), `/llms-full.txt` | 69,963 / 5,448,286 B | The full file is too big for any context; use the index. |
| React | [`/llms.txt`](https://react.dev/llms.txt) | 14,571 B | – |
| shadcn/ui | [`/llms.txt`](https://ui.shadcn.com/llms.txt); vendor skill in `shadcn-ui/ui/skills/shadcn` | 12,260 B | – |
| Astro | `docs.astro.build/llms.txt` returned **404** today; the [Build with AI page](https://docs.astro.build/en/guides/build-with-ai/) offers the Astro Docs MCP at `https://mcp.docs.astro.build/mcp` and a dev-server health endpoint `/_astro/status` | – | Do not link an Astro llms.txt until it is confirmed again. |
| Tailwind CSS | `tailwindcss.com/llms.txt` returned **404** | – | No official llms.txt; link the normal docs. |
| MDN, web.dev | `/llms.txt` returned 404 on both | – | Link normal pages. |

---

## Patterns seen

**Strengths worth learning from** (licence of the example in brackets; ideas are free to reuse, text only under
the licence):

1. **Routers + lazy specialists to keep base cost low.** Six visible router skills, 107 hidden ones, about 1,100 tokens
   at start, and a `measure` script that reports cost per client (accessibility-agents, MIT). Impeccable loads one
   reference per command (Apache-2.0). Small single-purpose skills of 3–6 KB (ibelick, MIT).
2. **Big data outside the prompt.** UI UX Pro Max keeps catalogues in CSV and returns only search hits (MIT).
   axecap groups axe output to save context (MIT). Lighthouse MCP returns typed `structuredContent` (MIT).
3. **A findings schema, not prose.** Stable rule id + WCAG SC + severity + `file:line` + one-sentence summary + fix +
   a `passed` list; scripts render the report and the change since last run (accessibility-agents, MIT). AccessLint
   adds an **evidence axis** (verified / confirm with a person / person only), which fits our "honest about tool
   limits" rule (AccessLint repo: no licence, so take the idea only).
4. **A deterministic detector next to the skill.** `impeccable detect --json|--github`, exit codes, ignore lists and
   inline disable comments (Apache-2.0); Svelte's `svelte-autofixer` loop (MIT); Addy's capped JSON grep script (MIT).
5. **Static vs runtime kept apart.** Addy's audit skill says to collect live evidence first and to keep measured
   findings apart from code-only guesses; it routes to Chrome DevTools MCP or the Lighthouse CLI, whichever is present
   (MIT).
6. **Diff-only audits** for pull requests (AccessLint `accessibility-diff`; accessibility-agents shows the change since
   the previous run).
7. **Project context files.** `PRODUCT.md`/`DESIGN.md` (Impeccable), design memory (interface-design): the audit reads
   the project's own tokens before judging.
8. **Provenance per row.** `Docs URL` + `Verified At` columns (UI UX Pro Max stack CSVs); `Source` column per generated
   skill (antfu/skills). This matches our "source for every rule" rule.
9. **One source, generated per agent, with validation** (wshobson/agents; Impeccable commits each tool's build).
10. **Supply-chain care.** A curated registry with hashes and a lock file (autoskills, idea only: CC-BY-NC-4.0).

**Weaknesses common to them**

1. **Few or no sources.** Most a11y/perf skills sampled have 0–2 URLs (wshobson `wcag-audit-patterns` 0, mastepanoski 0,
   sergiodxa 0, ECC `frontend-a11y` 1, awesome-copilot `a11y.instructions.md` 0 for 27.6 KB).
2. **Stale facts.** WCAG 2.1 still used in several (davila7, hoodini, tech-leads-club copy); FID and the removed
   `getFID` API in secondsky; old version pins in Cursor rule names.
3. **Copies drift and licences get lost.** Forks of Addy's skill stay at v1.0; sickn33 re-ships AccessLint skills
   whose source repo has no licence; many popular repos (ComposioHQ, travisvn, hoodini, onmax, spences10, AccessLint,
   cursor/community-plugins) have **no licence file**; hesreallyhim is CC-BY-NC-ND and autoskills CC-BY-NC.
4. **Always-loaded giants.** 27 KB instruction files with `applyTo: '**'` (awesome-copilot); overlapping globs; 27–31 KB
   single skills (emil, taste); a 108 KB compiled `AGENTS.md` (Vercel); Vue skill keeps four references always in context.
5. **Contradictions.** Vercel React rules counted as 40+, 70 and 72 in three places; Impeccable's command count differs
   across sites; Addy writes "<" where the official limits are "≤".
6. **Advice that is not checked.** Most packs only instruct; few audit, and fewer emit stable rule ids. Static checkers
   that exist mostly read HTML only (Addy) or give JSX pattern rules only (Impeccable); runtime checks need a running
   page and Chrome.
7. **Unpinned remote rules.** Vercel `web-design-guidelines` fetches its rules from `main` at every run.
8. **Risky automation.** Impeccable live mode can start an agent with approvals and sandbox off.
9. **Overclaiming.** Several descriptions say "WCAG compliance"; only a few (JustasMonkev scanner, AccessLint) say
   plainly that automated checks cover part of the problems.

---

---

# Conclusions

Written by the lead from parts A and B, 2026-11-11. Every claim here points back to a row above.

## The honest picture

The field is crowded and moving fast. Installing skills into many agents is **solved**: the `skills` CLI (MIT, about
80 agents, lockfile with hashes), `gh skill` (about 50 agents, pinning), rulesync (MIT, 65 tools, translates globs) and
ruler (MIT, 32 agents) all do it. Framework knowledge is **owned by the frameworks**: Next.js ships version-matched docs in
`node_modules/next/dist/docs` and a managed `AGENTS.md` block, and its guide reports that bundled docs beat skills
(100% against up to 79%); Svelte has an official MCP with an autofixer; Angular publishes a small official
best-practices file. Modern HTML/CSS/JS feature guidance is **covered by Google**: modern-web-guidance (Apache-2.0) has
209 Baseline-aware guides, a skill of about 200 tokens and a static `legacy-scan`. Visual taste is **covered by**
Impeccable (Apache-2.0, ~108k stars) and Anthropic's `frontend-design`. Deep accessibility work is **covered by**
accessibility-agents (MIT, 113 skills, a findings schema). If Frontend Skills tried to beat any one of these at its own
game, it would lose.

What is missing is the **join**: no project found reads the project's stack, installs only the matching skills into each
agent in that agent's own format (with glob scoping where the agent has it), and then audits the project's source across
areas — HTML, CSS, accessibility, performance, the framework, SEO — with one report whose findings carry a stable rule
id, a severity, `file:line`, a source in a public standard and a fix. The pieces exist apart:

| Piece | Who has it | Licence | Gap |
|---|---|---|---|
| Stack detection + install | midudev/autoskills | CC-BY-NC-4.0 | no rules of its own, no audit; licence forbids reuse |
| Install into many agents | skills CLI, gh skill, rulesync, ruler | MIT | no stack detection (skills CLI's `experimental_sync` only links skills that dependencies ship) |
| Glob translation per agent | rulesync | MIT | no content, no detection |
| Findings schema with rule id + WCAG SC + fix | accessibility-agents | MIT | accessibility only |
| Deterministic CLI detector, JSON / CI output, inline ignores | Impeccable; modern-web-guidance `legacy-scan` | Apache-2.0 | design taste only; legacy-feature patterns only (~20% of its catalogue) |
| Perf / a11y / SEO content with a live-evidence workflow | addyosmani/web-quality-skills | MIT | static script reads `.html` only; no stable ids; writes "<" where the limits are "≤" |
| Framework self-check | Svelte `svelte-autofixer` | MIT | one framework |

## What they do well, to learn from

Ideas are free to learn from; text or code only under the licence named (and then recorded in `THIRD-PARTY.md`).

1. **Follow the open format, not a new one.** `.agents/skills/<name>/SKILL.md` by the Agent Skills specification
   (agentskills.io, Apache-2.0) is read natively by Codex, Cursor, Copilot, Gemini CLI, Antigravity, Devin/Windsurf,
   OpenCode, Zed, Junie and Amp; Claude Code reads `.claude/skills`, Cline `.cline/skills` or `.claude/skills`, Kiro
   `.kiro/skills`. Two or three copies (or links) reach nearly every agent. Keep the spec's limits: `name` 1–64 characters
   equal to the folder, `description` ≤ 1024 characters, body under 5,000 tokens, SKILL.md under 500 lines.
2. **A managed block in a shared file.** Next.js writes only between its own `BEGIN`/`END` markers in `AGENTS.md` and
   re-runs idempotently. Same idea for our always-on index (idea only; no text taken).
3. **Low base cost, measured.** accessibility-agents keeps 6 router skills visible and 107 hidden, claims about 1,100
   tokens at start and ships a `measure` script (MIT). modern-web-guidance keeps its skill near 200 tokens, fetches guides
   one at a time and prunes with evals (Apache-2.0). Small single-purpose skills of 3–6 KB (ibelick/ui-skills, MIT).
4. **Findings as data.** accessibility-agents' `findings.schema.json` (MIT): rule id, WCAG SC, severity, location,
   summary ≤ 240 characters, fix ≤ 480, and a `passed` list that separates "clean" from "not checked". AccessLint grades
   each finding on an **evidence axis** — verified / confirm with a person / person only (no licence: idea only).
5. **A detector beside the skill.** `impeccable detect --json | --github` with exit codes and inline disable comments
   (Apache-2.0); Svelte's autofixer the agent calls in a loop (MIT); Addy Osmani's capped JSON grep script (MIT).
6. **Static and runtime kept apart.** web-quality-skills tells the agent to gather live evidence (Chrome DevTools MCP or
   the Lighthouse CLI, whichever is present) and keep measured findings apart from guesses from code (MIT).
7. **Provenance per row.** UI UX Pro Max keeps a `Docs URL` and a `Verified At` column in its stack data (MIT); antfu's
   skills name the docs repository each was generated from (MIT).
8. **Supply-chain care.** Lockfiles with content hashes (skills CLI, MIT; autoskills as idea only).
9. **Diff-only audits** for pull requests (AccessLint `accessibility-diff`; accessibility-agents' change since the last
   run).

## What none of them does

1. **Choose by stack and write every agent's own format, scoped by file type, from one source.** rulesync translates
   globs but does not detect a stack; autoskills detects a stack but writes skills only and may not be reused; the
   skills CLI installs everything you name. Nobody turns "this is a Vue 3 + Tailwind 4 project" into a CSS rule that
   Cursor loads only for `*.css,*.vue` (`globs`), Copilot only via `applyTo`, Claude Code only via `paths`, Kiro via
   `fileMatchPattern`, and an index line for the agents with no glob scoping.
2. **One cross-area audit with stable ids tied to public standards.** Each finding: `a11y/img-alt` or
   `perf/lcp-image-priority`, severity, `file:line`, evidence level, the WCAG SC / spec section / vendor doc it rests on,
   and the fix. The existing auditors are single-area (a11y, design, legacy features) or have no ids.
3. **The same id everywhere.** Report, skill, `explain <id>`, site page, ignore comment: one dictionary. Nobody has this
   across areas.
4. **Every rule sourced and dated, checked by a test.** Part B found most a11y/perf skills with 0–2 links, several still
   on WCAG 2.1, one still teaching FID and the removed `getFID` call, forks drifting from upstream, counts that disagree.
   A rule that cannot cite a primary source and a verified date should fail the build.
5. **Token cost counted and published per skill and for the always-on index.** Only two projects measure at all; the
   counter-examples are 27 KB instruction files on `applyTo: '**'` and a 108 KB compiled `AGENTS.md`.
6. **Lessons per project.** Impeccable's `PRODUCT.md`/`DESIGN.md` and interface-design's memory are the nearest, for
   design only; none keeps confirmed fixes and exceptions per project for standards work.

## Six things that would make Frontend Skills the one a front-end developer picks

1. **One start command that learns the project.** `npx github:dawidolko/frontend-skills init` reads `package.json`,
   lockfiles and config files (the detection signals are listed per technology in [react.md](react.md),
   [nextjs.md](nextjs.md), [vue.md](vue.md), [tooling.md](tooling.md) and the other technology files), writes a profile,
   shows what it will install (`--dry-run`), and installs only what fits — then reruns idempotently, owning only its
   marked block in shared files. Also stay installable by the tools people already use: keep the standard
   `skills/<name>/SKILL.md` layout so `npx skills add` and `gh skill install` work too.
2. **An audit people can act on.** Zero-dependency static checks first; findings as data (id, severity, `file:line`,
   evidence level, source URL, fix), rendered to a short Markdown report and to JSON; a diff mode for pull requests;
   ignore comments that must carry a reason. Runtime checks (axe-core, Lighthouse) only when the person asks, fetched on
   demand, with their rule ids mapped onto ours so there is still one report.
3. **A dictionary of stable, sourced, dated ids.** `explain <id>` prints the rule, why, the source and a bad/good pair.
   A test fails any rule without a primary-source URL and a verified-at date. This is the clearest gap in the field and
   the easiest to show on LinkedIn: every claim links to WCAG, WHATWG, MDN, web.dev or the framework's own docs.
4. **The right file for every agent, scoped by file type.** One source, written out per agent with its own glob syntax
   and within its documented size limits (Codex 32 KiB for the whole `AGENTS.md` chain; Antigravity 24,000 bytes per rule
   file and 20,000 tokens always-on; Claude Code under 200 lines per `CLAUDE.md`; Cursor rules under 500 lines). A CSS
   rule never loads while the agent edits a test.
5. **Measured token cost, with a budget.** A script counts the tokens of the index and of each skill, the numbers are
   published with the command that made them, and a test fails when the always-on part grows past its budget. Framework
   skills stay thin: they point to the framework's own agent docs (Next.js bundled docs, Svelte MCP, Angular's
   best-practices file) and hold only checks and the mistakes those docs warn about.
6. **Honest by construction.** Each finding says whether a tool verified it, a person must confirm it, or only a person
   can judge it; the report lists the WCAG criteria no tool can decide; the wording never goes past "helps you work to
   WCAG 2.2 AA; automated checks find only part of the problems".

## Licence notes for anything worth adapting

| Project | Licence (read) | May we adapt text or code? |
|---|---|---|
| agentskills/agentskills (spec) | Apache-2.0 | yes, with notice; we follow the format anyway |
| GoogleChrome/modern-web-guidance | Apache-2.0 | yes, with notice; better to link than to duplicate |
| ChromeDevTools/chrome-devtools-mcp | Apache-2.0 | yes, with notice (we call it, not copy it) |
| pbakaus/impeccable | Apache-2.0 (NOTICE credits MIT content) | yes, with notice; do **not** copy its "live mode" that turns approvals and sandbox off |
| anthropics/skills, openai/skills | Apache-2.0 per skill (no root LICENSE) | per skill, with notice |
| Community-Access/accessibility-agents | MIT | yes, with notice (findings schema is the best model) |
| addyosmani/web-quality-skills | MIT | yes, with notice; recheck every number ("<" vs "≤") |
| vercel-labs/skills, rulesync, ruler | MIT | yes, with notice (installer and glob-translation ideas) |
| github/awesome-copilot | MIT (content is third-party per its README) | with care, file by file |
| antfu/skills, vuejs-ai/skills, ibelick/ui-skills, wshobson/agents | MIT | yes, with notice |
| PatrickJS/awesome-cursorrules, sanjeed5/awesome-cursor-rules-mdc | CC0-1.0 | allowed, but the content is unsourced and often stale: topics only |
| vercel-labs/agent-skills | no LICENSE file (README and frontmatter say MIT) | **not until a LICENSE file exists**; link only |
| midudev/autoskills | CC-BY-NC-4.0 | **no** (non-commercial) |
| hesreallyhim/awesome-claude-code | CC-BY-NC-ND-4.0 | **no** |
| priyankark/a11y-mcp | MPL-2.0 | **no** copying into MIT files (file-level copyleft) |
| dequelabs/axe-mcp-server-public | proprietary | **no**; may be named as an optional paid tool, nothing more |
| AccessLint/skills, ComposioHQ, travisvn, onmax/nuxt-skills, spences10, hoodini, cursor/community-plugins | none found | **no**; link only (AccessLint's npm packages are MIT, its skills repo has no licence) |
| sickn33/agentic-awesome-skills | MIT label, but vendors unlicensed files | **no**; trace each file to its source |

Note on axe-core itself: it is **MPL-2.0** (see [accessibility-patterns.md](accessibility-patterns.md)). Calling it as
an on-demand tool is fine; copying its source into this MIT repository is not.

# Not verified

What could not be confirmed on a primary source was left out of the conclusions or is marked in its row.

### From part A

- Windsurf per-file limit: 12,000 chars is stated on docs.devin.ai Windsurf-plugins page; older 6,000-char figures for
  `global_rules.md` appear only in search snippets of the old docs.windsurf.com page (now redirects). The Devin Desktop
  memories page states no limit. Treat the limit for the Windsurf editor as unconfirmed.
- Copilot code review limit: the docs page still mentions 4,000 chars (seen in search snippet only); changelog says
  removed. Not re-read on the live docs page.
- Cursor `.cursorrules` legacy status and whether Cursor reads `CLAUDE.md`: not on the rules page.
- Roo Code skills support, Zed rules page (`/docs/ai/rules` 404s; used `/docs/ai/instructions`), Aider AGENTS.md
  auto-read: not documented on pages read.
- Junie custom guidelines path setting (only in a search snippet of the IDE plugin page).
- Cline `.agents/skills` support and agentskills.io conformance: not stated on its skills page.
- Antigravity conformance to the full Agent Skills spec (page links the spec but lists only `name`/`description`).
- skillsmp.com: HTTP 403; cursor.directory: HTTP 429. No counts.
- modern-web-guidance `legacy-scan` output schema (fields, ids): only the SKILL.md description was read; the CLI's
  JSON format was not inspected.
- Tessl licence, supported agents; agent-skills-cli (Karanjot786), drvoss/everything-copilot-cli, mcp-skills: seen in
  search results only (community, belongs to part B).
- Stars / open-issue counts are GitHub API values at read time; open_issues_count includes PRs.

### From part B

- **Token claims**: accessibility-agents' "about 1,100 tokens" and "under 1,200 tokens" are the README's figures; I did
  not run `npm run measure`.
- **Impeccable "62 deterministic rules"** and "24 commands": from the README; I did not run `--list-rules` (no installs allowed).
- **UI UX Pro Max counts** (80 styles, 192 palettes, 22 stacks, 120 guidelines): from the README; I counted only files.
- **Front-end entry counts** in §4 ("~90", "~84", "~986") are path or line matches on keywords, not a manual review.
- **ECC / sickn33 totals** include translated and duplicated copies; I did not deduplicate.
- **Deque axe MCP tool list** and pricing: Deque's page says it is included with Axe DevTools for Web; I did not see the
  product docs behind the login.
- **Chrome DevTools MCP `lighthouse_audit` leaving out performance**: read in Addy's skill, not in the MCP's own tool
  reference.
- **Next.js "100% vs up to 79%"**: stated on the Next.js guide; I did not open the evals page.
- **Astro llms.txt**: 404 at `docs.astro.build/llms.txt`, `/en/llms.txt` and `astro.build/llms.txt` today; it may have
  moved, and I found no new path.
- **Vue skills' Vue-core involvement**: from a Vue School article, not a primary source.
- **Stars and installs on aggregator sites** (skills.sh, skillselion, mcpservers.org): not used; all stars above are
  from the GitHub API on 2026-11-11.
- Not assessed: cursor/community-plugins content, Jeffallan skill quality, AgriciDaniel/claude-seo sub-skill quality,
  OneRedOak/claude-code-workflows, educlopez/ui-craft, EthanY33/atelier (listed by hesreallyhim).
