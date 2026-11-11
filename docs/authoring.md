# Writing skills and rules

This is the guide for everyone who adds to the dictionary. Read `docs/architecture.md` (data model and budgets) first. The three example skills are the reference implementation: `skills/foundations/fe-html`, `skills/accessibility/fe-a11y-forms`, `skills/frameworks/fe-react`, with their rules under `rules/`.

## What makes a skill good here

- **Specific to one technology or one task.** "React components", "Accessible forms", "CSS layout": not "frontend best practices".
- **Short.** An agent pays for every line. The body tells the agent what to do and what never to do; background and long tables go to a reference file.
- **Imperative and concrete.** "Give every `<img>` an `alt`", not "consider adding alternative text". Code over prose.
- **Tied to rules.** Every rule bullet that has an id names it in parentheses at the end: `(a11y/img-alt)`. The id is how the agent, the audit and the person find the reason and the source.
- **Current.** Versions and APIs are checked on the official page on the day you write, and the reference file says the date ("latest stable checked 2026-11-11: 19.3").
- **Project first.** The first line after the title tells the agent to read the profile and lessons; lessons win.
- **Honest.** "helps you work to WCAG 2.2 AA as a target"; never "compliant", "accessible by default" or "guaranteed".

## Skill template

```markdown
---
name: fe-<topic>
description: <What it does, for which files or stacks, and the outcome>. Use when <the tasks and phrases that should trigger it>.
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer.
metadata:
  title: <Human title, at most 40 characters>
  area: <foundations | styling | frameworks | accessibility | performance | quality | workflow>
  lane: <A | B | C | W>
  requires: "<stack keys, space-separated; web = every front-end project>"
  globs: "<globs of the files this skill is about, space-separated>"
  rules: "<rule ids this skill teaches, space-separated>"
  version: 0.1.0
---

# <Title>

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- <Do X> (<rule id>).
- <Never Y> (<rule id>).
  (at most 12 bullets; this section is copied alone into glob-scoped rule files, so it must make sense without the rest)

## Do this

1. <Step: where to look first in this kind of project.>
2. <Step: the pattern to apply, with the API names of the current version.>

## Check

- `npx github:dawidolko/frontend-skills audit --changed` <what it finds for this topic>.
- <The one or two checks a person or the agent runs by hand.>

## References

- [references/<file>.md](references/<file>.md): <what is in it>. Read it when <situation>.
```

Notes:

- Quote a YAML value that contains `: ` or ` #`, or starts with a quote, bracket or brace. Write the description on one line. No `<` or `>` in it.
- `requires` keys come from the list in `docs/skills-plan.md` ("Stack keys"). If you need a new key, add its detection to `cli/lib/detect.mjs` in the same change (or ask the core agent).
- Reference files: `references/<topic>.md`, linked from `SKILL.md` with a relative link, one level deep, ending with a "Sources" list of URLs.
- Scripts (rare): `scripts/<name>.mjs`, Node 20+, no dependencies, a block comment at the top, short output, `--json` for machines.

## Rule template

```markdown
---
id: <area>/<name>
title: <The rule in one sentence, at most 140 characters.>
severity: <critical | serious | moderate | minor>
check: <static | browser | manual>
applies:
  - <file kinds>
wcag:
  - <x.y.z>            (accessibility rules)
level: <A | AA>        (accessibility rules)
axe:
  - <axe-core rule id> (when axe reports the same problem)
lighthouse:
  - <audit id>         (when Lighthouse reports it)
stack:
  - <stack key>        (only when the rule is framework-specific)
requires:
  - <helper id>        (only when the rule follows a project helper: rem-function, icon-classes…)
skill: fe-<topic>
since: 0.1.0
sources:
  - title: <Publisher, page title (section)>
    url: <https://…>
---

## Why

<One short paragraph: what goes wrong for whom.>

## Fix

<What to change, concretely, with the API or attribute names.>

## Examples

<bad and good, in a fenced block>
```

Severity guide (the axe-core scale):

| Severity | Use when |
| --- | --- |
| critical | Blocks a task for some people (no accessible name on an image or field, zoom disabled). |
| serious | Makes a task very hard or measurably slows every visit (no `lang`, focus removed, keyboard cannot reach a control). |
| moderate | Degrades the experience or a metric (layout shift from unsized images, blocking scripts, index keys). |
| minor | Good practice with a small effect (missing `type` on a button, `100vh` on mobile). |

Project helpers: when a rule enforces a project's own convention (its rem function, its icon classes, its tokens), declare `requires: [<helper id>]` and write the title and fix with placeholders, `{{rem-function.call|rem-calc(16px)}}`, so the report names the project's helper and still reads well without it. Add a `fixtures/profile.json` with the `helpers` the fixtures assume. See `docs/architecture.md`, "Project helpers", and `rules/css/rem-helper/`.

Choosing `check`:

- `static` when the source alone proves the problem in most real projects, without guessing what a component renders. Write `check.mjs` and both fixtures.
- `browser` when only the rendered page knows (contrast, names computed through components, Lighthouse metrics). Fill `axe` or `lighthouse` so `audit --url` reports it under this id.
- `manual` when a person must judge (quality of alt text, wording of errors). The skill's `## Check` says how.

## Sources

- Allowed: W3C and WAI (WCAG 2.2 with the success criterion number, Understanding documents, WAI-ARIA Authoring Practices, tutorials), WHATWG, MDN, web.dev and developer.chrome.com, the framework's or library's own documentation, the W3Schools style guides, and the notes in `docs/sources/`.
- Use the most specific page (the Understanding document of the criterion, the section anchor of the spec).
- **Own words only.** State the rule in your words and link the source. Never copy prose from a specification, MDN, web.dev, W3Schools or another project. Code examples are your own.
- Something adapted from an open-source project (only MIT, Apache-2.0, BSD, ISC, CC0 or CC-BY) is listed in `THIRD-PARTY.md` with the source, the licence and what was taken.

## Checklist for a content agent

For each skill:

1. Check the current version of the technology on its official page or the npm registry; write the date in the reference file.
2. Copy the template; fill the front matter; keep the description under 400 characters and make it say when to use the skill.
3. Write `## Rules` first: the 6 to 12 things an agent must do or never do for this technology. Find or create a rule id for each one that can be stated as a rule.
4. For each new rule: `rules/<area>/<name>/rule.md` with at least one source; for `check: static`, `check.mjs` plus `fixtures/bad.<ext>` and `fixtures/good.<ext>` (the good fixture includes the tricky cases the check must accept, such as spreads and bound values).
5. Write `## Do this` (where to look in a project of this kind, the patterns of the current version), `## Check` and `## References`.
6. Write the reference file: tables over paragraphs, a "Sources" list at the end.
7. Run `npm run check`. It validates the front matter, budgets, rule ids, sources, fixtures and headers, and runs the tests. Fix everything; never raise a budget or weaken a check to pass.
8. Run `node cli/index.mjs tokens --all` and note the skill's cost in your report.
9. Commit one skill (with its rules) per commit: `feat(skills): add fe-vue` with explicit paths.

## Lanes

Who writes what is in `docs/skills-plan.md`. Rule areas are shared: before creating a rule, search `rules/` for an existing id (`node cli/index.mjs list --rules`); a rule belongs to the skill named in its `skill:` key, and other skills cite it by id.
