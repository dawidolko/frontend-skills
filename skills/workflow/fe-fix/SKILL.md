---
name: fe-fix
description: Fixes front-end audit findings by rule id - smallest correct change first, shared components before pages, the rule's own fix and source, re-running audit --changed after each fix, and never suppressing a finding without the rule id and a reason. Use when asked to fix audit findings, a rule id such as a11y/input-label, the problems in frontend-report.md, or "make the audit pass".
license: MIT
compatibility: Any agent that reads Agent Skills. Needs Node.js 20 or newer to run the command.
metadata:
  title: Fix findings
  area: workflow
  lane: W
  requires: web
  globs: "**/frontend-report.md **/.frontend-skills/**"
  rules: "tooling/ignore-with-reason tooling/use-project-scripts"
  version: 0.1.0
---

# Fix findings

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over a rule's default fix.

## Rules

- Work from the audit, by rule id: `npx github:dawidolko/frontend-skills audit --json`, then `explain <id>` for the fix and source.
- Fix the cause in the shared component, layout or token, not each page that uses it.
- Make the smallest change that fixes the rule; do not refactor or restyle around it.
- Use the project's helpers and components (`profile.helpers`, lessons) in the fix.
- After each fix, run `audit --changed` and the project's lint and tests (tooling/use-project-scripts).
- Never suppress to pass: an `fs-ignore` names the rule id and a reason, or the finding stays (tooling/ignore-with-reason).
- Never weaken `audit.failOn`, budgets or a rule to make the audit pass.
- A static fix that needs judgement (alt text wording, error message text, labels) gets a short note for the person to confirm.
- Fixing one finding must not create another: check the rule ids of the skill for that area.

## Do this

1. Run the audit and take findings in the order critical, serious, moderate, minor; within a level, the rule with the most locations first.
2. For each rule: `explain <id>`, open the first location, find whether it comes from a shared component, and fix it there.
3. Load the skill that owns the rule (its `skill:` in `explain`) for the patterns of this stack.
4. Run `npx github:dawidolko/frontend-skills audit --changed --json` and the project's lint and tests; repeat until the rule is gone.
5. Report: rule ids fixed, files changed, findings left with the reason, and anything a person must check (browser and manual rules).

## Check

- `audit --changed` shows no finding of the fixed rule ids in the changed files.
- `git diff` shows only changes that serve the fixed rules.
- Every new `fs-ignore` has a rule id and a reason.

## References

- [references/fixing.md](references/fixing.md): typical fixes for the most common rule ids, suppression syntax per file type, profile ignores and excludes, and what to tell the person. Read it before a batch of fixes.
