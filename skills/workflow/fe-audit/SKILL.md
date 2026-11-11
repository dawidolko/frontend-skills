---
name: fe-audit
description: Audits a front-end project with frontend-skills - runs the static audit (and the page audit with --url when a page is running), reads the condensed JSON, explains the top findings by rule id with their source, lists what needs a person, and proposes an order of fixes. Use when asked to audit, check or score a project or page, "what is wrong with this site", or before a release.
license: MIT
compatibility: Any agent that reads Agent Skills. Needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Audit the project
  area: workflow
  lane: W
  requires: web
  globs: "**/frontend-report.md **/.frontend-skills/**"
  rules: "a11y/control-name a11y/input-label a11y/img-alt a11y/color-contrast perf/lcp-image"
  version: 0.1.0
---

# Audit the project

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson or an `audit.ignore` entry wins over a finding.

## Rules

- Run the audit, do not imitate it: `npx github:dawidolko/frontend-skills audit --json` and read the JSON, not the source by eye.
- Run the page audit only on a page the person started, with their yes: `audit --url <address>`.
- Present findings by rule id, severity first: critical, serious, moderate, minor.
- For each top rule say why it matters, the fix and how many places; `explain <id>` gives the text and the source.
- Blocking problems first: missing names and labels (a11y/control-name, a11y/input-label, a11y/img-alt) before contrast (a11y/color-contrast) and speed (perf/lcp-image).
- Group fixes by file and by shared component, so one change clears many findings.
- List what the audit cannot check (browser rules without `--url`, manual rules) as a checklist for a person.
- Never claim the project is accessible, compliant, secure or fast; say "N problems found, M items need a person".
- Never change files during an audit; propose the fixes and let `fe-fix` apply them.

## Do this

1. `npx github:dawidolko/frontend-skills audit --json` (add `--changed` for only the changed files). Exit code 1 means something is at or above `failOn`; 2 is a usage error; 3 means a requested tool is missing.
2. Read `counts`, then each entry of `rules`: severity `s`, `fix`, locations `at` (`file:line`).
3. If a dev or preview server is running and the person agrees: `audit --url http://localhost:5173/ --json` for contrast, rendered names, Lighthouse scores and lab metrics.
4. Write a short summary: counts by severity, the five rules that matter most with their fix and count, the shared components to fix first, the manual checklist.
5. Point to `frontend-report.md` for the full list with sources, and to `explain <id>` for any rule.

## Check

- The summary names rule ids that exist (`frontend-skills list --rules`), and every location is `file:line` from the JSON.
- The person can rerun the same command and get the same counts.

## References

- [references/report.md](references/report.md): the JSON format, exit codes, a fix-order heuristic, the summary template, and the manual checklist per area. Read it when presenting an audit.
