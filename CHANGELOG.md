# Changelog

All notable changes are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- The command `npx github:dawidolko/frontend-skills` with `init`, `audit`, `learn`, `list`, `explain`, `doctor`, `update`, `uninstall` and `tokens`; no runtime dependencies.
- Stack detection (package manager, frameworks and versions, TypeScript, styling, testing, build, lint, data and i18n tools, plain HTML sites, pnpm, npm, Yarn, Lerna and Nx workspaces) written to `.frontend-skills/profile.json`.
- Project helpers: the project's own px-to-rem function, px-to-rem build step, icon font or SVG sprite build, design tokens and custom properties are detected and recorded, rules can require them, and fixes name them.
- Confirmed project lessons in `.frontend-skills/lessons.md`, read first by every skill.
- Adapters for 17 coding agents: Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Gemini CLI, Antigravity CLI, Devin and Windsurf, OpenCode, Cline, Zed, JetBrains Junie, Kiro, Augment, Trae, Continue, Amazon Q Developer and Aider, with glob-scoped rule files where the agent supports them and the fewest skills folders.
- A static audit engine for HTML, JSX and TSX, Vue, Svelte, Astro and Angular templates, CSS, SCSS and Less, with a Markdown report, condensed JSON for agents and exit codes by severity; `--url` adds Lighthouse and axe-core on a running page, fetched only after consent.
- 23 rules with stable ids and sources, 20 of them checked statically with bad and good fixtures; the reference skills `fe-html`, `fe-a11y-forms` and `fe-react`.
- The format, the architecture, the authoring guide, the agent table and the skills plan in `docs/`.
- The README in English and Polish (`README.pl.md`): quick start, the three steps, an example report, the agent table, the dictionary and project helpers, commands, measured token cost, the limits of automated checks, FAQ and how to add a rule.
- Terminal recordings of `init`, `audit` and `explain` as animated SVG with PNG fallbacks, made from real runs on a fixture project and shown on skills.dawidolko.pl; the banner and the mark in `docs/media/`.
