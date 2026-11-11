# How coding agents read skills and rules

Checked on **2026-11-11** on each vendor's official documentation (links per row). Where a page did not confirm a fact, the cell says _not verified_ and the installer does not depend on it. Re-check this table before changing an adapter; `frontend-skills doctor` prints the same facts for the agents a project uses.

## The open Agent Skills format

Source: https://agentskills.io/specification

- A skill is a folder `<name>/` with `SKILL.md` (YAML front matter, then Markdown) and optional `scripts/`, `references/` and `assets/`.
- `name`: 1–64 characters, lowercase letters, digits and single hyphens, not starting or ending with a hyphen, equal to the folder name. `description`: 1–1024 characters, says what the skill does and when to use it. Optional: `license`, `compatibility` (up to 500 characters), `metadata` (a map of string to string), `allowed-tools` (experimental).
- Progressive disclosure: about 100 tokens of name and description per skill are loaded at start; the body on activation (the spec recommends under 5,000 tokens and under 500 lines); references only when a step needs them, one level deep, with relative links.

## Per agent

| Agent | Skills folder in a project | Glob-scoped rule files | Always-on instructions | Documented limits | Source |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `.claude/skills/` (not `.agents/skills`) | `.claude/rules/*.md` with `paths:` (globs) | `CLAUDE.md`; reads `AGENTS.md` only when no `CLAUDE.md` exists | listing truncates description at 1,536 chars; CLAUDE.md under 200 lines advised | https://code.claude.com/docs/en/skills, https://code.claude.com/docs/en/memory |
| OpenAI Codex | `.agents/skills/` (cwd up to repo root) | none (directory scoping only) | `AGENTS.md`, `AGENTS.override.md` | `project_doc_max_bytes` 32 KiB; skills list at most 2% of context | https://learn.chatgpt.com/docs/agent-configuration/agents-md, https://learn.chatgpt.com/docs/build-skills |
| Cursor | `.agents/skills/`, `.cursor/skills/`; also `.claude/skills/`, `.codex/skills/` | `.cursor/rules/*.mdc` with `description`, `globs`, `alwaysApply` (plain `.md` there is ignored) | `AGENTS.md` (nested allowed) | rules under 500 lines advised | https://cursor.com/docs/context/rules, https://cursor.com/docs/context/skills |
| GitHub Copilot (VS Code, CLI, cloud agent, code review) | `.github/skills/`, `.claude/skills/`, `.agents/skills/` | `.github/instructions/*.instructions.md` with `applyTo` | `.github/copilot-instructions.md`, `AGENTS.md` | code review's 4,000-char limit removed 2026-06-12 | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills, https://code.visualstudio.com/docs/copilot/customization/custom-instructions |
| Gemini CLI | `.agents/skills/` (wins) or `.gemini/skills/` | none | `GEMINI.md`; `AGENTS.md` only if added to `context.fileName` | not stated | https://geminicli.com/docs/cli/skills/, https://geminicli.com/docs/cli/gemini-md/ |
| Antigravity CLI (replaced Gemini CLI for unpaid tiers on 2026-06-18) | `.agents/skills/` | `.agents/rules/*.md` with `trigger: glob` and `globs` | `AGENTS.md`, `GEMINI.md` | 24,000 bytes per rule file; 20,000 tokens for always-on rules | https://antigravity.google/docs/rules |
| Devin Desktop (formerly Windsurf) and Devin CLI | `.agents/skills/`, `.devin/skills/`, legacy `.windsurf/skills/` | `.devin/rules/*.md` (legacy `.windsurf/rules/`) with `trigger: glob` and `globs` | `AGENTS.md` | 12,000 chars per rule on the Windsurf plugin page; _not verified_ for Desktop | https://docs.devin.ai/desktop/cascade/memories, https://docs.devin.ai/desktop/cascade/skills |
| Devin (cloud) | `.agents/skills/` (recommended) and nine others | via CLI rules | `AGENTS.md` | first 16 KiB of each AGENTS.md auto-included | https://docs.devin.ai/product-guides/skills, https://docs.devin.ai/onboard-devin/agents-md |
| OpenCode | `.opencode/skills/`, `.claude/skills/`, `.agents/skills/` | none per file | `AGENTS.md` (falls back to `CLAUDE.md`) | not stated | https://opencode.ai/docs/skills/, https://opencode.ai/docs/rules/ |
| Cline | `.cline/skills/`, `.clinerules/skills/`, `.claude/skills/` | `.clinerules/*.md` with `paths:` | root `AGENTS.md`, `.clinerules/` | not stated | https://docs.cline.bot/features/skills, https://docs.cline.bot/features/cline-rules |
| Zed | `.agents/skills/` only | none | the first of `.rules`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md`, `AGENT.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | 50 KB for the skills catalog | https://zed.dev/docs/ai/skills, https://zed.dev/docs/ai/instructions |
| JetBrains Junie | `.junie/skills/`; `.agents/skills/` in trusted projects | none | `.junie/AGENTS.md`, else `AGENTS.md` | not stated | https://junie.jetbrains.com/docs/agent-skills.html, https://junie.jetbrains.com/docs/guidelines-and-memory.html |
| Kiro | `.kiro/skills/` | `.kiro/steering/*.md` with `inclusion: fileMatch` and `fileMatchPattern` | `AGENTS.md`, steering with `inclusion: always` | not stated | https://kiro.dev/docs/skills/, https://kiro.dev/docs/steering/ |
| Augment | `.augment/skills/`, `.claude/skills/`, `.agents/skills/` | _not documented_ | `AGENTS.md` (or `CLAUDE.md`) | 49,512 chars for workspace guidelines and rules | https://docs.augmentcode.com/using-augment/skills, https://docs.augmentcode.com/cli/rules |
| Trae | `.trae/skills/`; `.agents/skills/` when enabled in settings | `.trae/rules/*.md` with `globs` and `alwaysApply: false` | `AGENTS.md` when enabled in settings | not stated | https://docs.trae.ai/ide/skills, https://docs.trae.ai/ide/rules |
| Continue | _not verified_ | `.continue/rules/*.md` with `globs`, `description`, `alwaysApply` | _not verified_ | not stated | https://docs.continue.dev/customize/deep-dives/rules |
| Amazon Q Developer (IDE plugins end of support 2027-04-30) | none | none: `.amazonq/rules/*.md` always apply | none documented | not stated | https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html |
| Aider | none | none | files listed under `read:` in `.aider.conf.yml` (for example `CONVENTIONS.md`) | not stated | https://aider.chat/docs/usage/conventions.html |

Not installed by default:

- **Roo Code**: its site says the extension was shut down on May 15 (https://roocodeinc.github.io/Roo-Code/). It read `.agents/skills/`, so a remaining install still sees the skills written for Codex and the others.
- **JetBrains AI Assistant**: `.aiassistant/rules/*.md` exist, but how the rule type and file patterns are stored is not documented (https://www.jetbrains.com/help/ai-assistant/configure-project-rules.html).

## What the installer concludes from this

1. **One folder serves most agents.** `.agents/skills/` is read by Codex, Cursor, Copilot, Gemini CLI, Antigravity, Devin, OpenCode, Zed, Junie, Augment and Trae (opt-in). Claude Code and Cline need `.claude/skills/` (Cline also `.cline/skills/`), Kiro needs `.kiro/skills/`, Trae is safest with `.trae/skills/`.
2. **Duplicates are real.** Cursor, Copilot, OpenCode, Augment and Devin read both `.agents/skills/` and `.claude/skills/`; writing both makes them list each skill twice. The installer picks the smallest set of folders that reaches every chosen agent and reports any duplicate it could not avoid (see `docs/architecture.md`, "Adapters").
3. **Glob scoping exists in eight formats** with different keys: Claude Code and Cline `paths`, Cursor `globs` in `.mdc`, Copilot `applyTo`, Devin and Antigravity `trigger: glob` + `globs`, Kiro `inclusion: fileMatch` + `fileMatchPattern`, Trae and Continue `globs`. Each adapter writes its own key; a test proves the globs match the fixture files they should.
4. **`AGENTS.md` is the shared always-on file**, except for Claude Code when a `CLAUDE.md` exists (the block goes into `CLAUDE.md` then), Gemini CLI (`GEMINI.md`), and Zed when an earlier file in its list exists (`doctor` warns).
5. **Agents without skills** (Continue, Amazon Q, Aider) get short files that point to one copy of the skills in the project, so nothing is duplicated and nothing large is always loaded.
