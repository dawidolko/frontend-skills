---
name: fe-learn
description: Teaches the agent this project before front-end work - runs frontend-skills init or learn, reads the profile (stack, versions, helpers), confirms detected conventions such as the rem function, icon build and tokens with the person, and records confirmed lessons. Use when starting in a new project, after the stack changed, or when told "remember that we…" or "learn this project".
license: MIT
compatibility: Any agent that reads Agent Skills. Needs Node.js 20 or newer to run the command.
metadata:
  title: Learn the project
  area: workflow
  lane: W
  requires: web
  globs: "**/.frontend-skills/** **/package.json"
  rules: "tooling/use-project-scripts"
  version: 0.1.0
---

# Learn the project

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over every skill.

## Rules

- Never guess the stack: read `.frontend-skills/profile.json`; if it is missing, run `npx github:dawidolko/frontend-skills init`.
- After a dependency, framework or tool change, run `learn` and show the person the difference before applying it.
- Use the project's own scripts and package manager for every command (tooling/use-project-scripts).
- Follow `profile.helpers` (rem function, icon classes or sprite, design tokens, custom properties) before generic advice.
- Ask the person to confirm detected helpers; add missed ones to `profile.helpers` with `"source": "person"`.
- Record a lesson only after the person confirms it: one line, at most 300 characters, ending with the rule ids it concerns.
- Never record secrets, tokens, personal data or URLs with credentials in a lesson or the profile.
- Lessons are conventions, commands and pitfalls of this project, not general advice the skills already give.
- Keep `audit` settings (`failOn`, `ignore`, `exclude`, budgets) as the person set them; propose changes, do not make them.

## Do this

1. If `.frontend-skills/profile.json` is missing: `npx github:dawidolko/frontend-skills init --dry-run`, show the plan (agents, skills, files), then run it with the person's yes.
2. Read the profile: `projects[].frameworks` and versions, `styling`, `testing`, `build`, `i18n`, `stack`, `helpers`, `audit`. Read `lessons.md`.
3. Show the person the detected helpers in one short list and ask: "Is this how you size text, draw icons and pick colours? Anything I missed?"
4. For each confirmed convention, record it: `npx github:dawidolko/frontend-skills learn --lesson "Form fields use components/ui/Field.tsx, which renders label, hint and error. [a11y/input-label]" --kind convention`.
5. When the stack changes later: `learn --dry-run`, show the difference, then `learn --yes` after a yes.

## Check

- `npx github:dawidolko/frontend-skills list` shows the skills that match the profile; `doctor` shows whether every agent has current files.
- `lessons.md` has one line per lesson: date, kind, text, rule ids.

## References

- [references/profile.md](references/profile.md): the profile fields, helper ids and what each changes, lesson kinds with good and bad examples, questions to ask the person. Read it when setting up a project or recording a lesson.
