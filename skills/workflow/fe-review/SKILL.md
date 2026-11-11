---
name: fe-review
description: Reviews a diff or pull request of front-end code - runs audit --changed, maps the touched files to their skills, walks the manual rules of those skills (keyboard, screen reader, motion, content), and reports findings by rule id with file, line and fix. Use when asked to review a pull request, a branch, staged changes or a component, or "check my changes before I push".
license: MIT
compatibility: Any agent that reads Agent Skills. Needs Node.js 20 or newer and git to run the command.
metadata:
  title: Review a change
  area: workflow
  lane: W
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.js **/*.vue **/*.svelte **/*.astro **/*.css **/*.scss"
  rules: "tooling/ignore-with-reason a11y/no-keyboard-trap a11y/status-message-live a11y/focus-not-obscured test/no-focused-tests"
  version: 0.1.0
---

# Review a change

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over a rule.

## Rules

- Start with the tool: `npx github:dawidolko/frontend-skills audit --changed --base <target branch> --json`.
- Review only what the change touches; mention older problems once, separately, without blocking on them.
- Map each touched file to its skills (by file type and framework) and walk their manual rules too.
- Report every finding as rule id, `file:line`, one sentence why, and the fix; link `explain <id>` instead of pasting rule text.
- New `fs-ignore` comments need a rule id and a reason (tooling/ignore-with-reason).
- Interactive changes get a keyboard and screen reader check: no traps, announced status messages, focus not hidden (a11y/no-keyboard-trap, a11y/status-message-live, a11y/focus-not-obscured).
- Test changes: no `.only`, no fixed waits, assertions that users would notice (test/no-focused-tests).
- Separate blocking findings (at or above `failOn`) from suggestions; never block on taste.
- Never approve on the audit alone; say what was checked automatically and what still needs a person.

## Do this

1. Get the diff: `git diff --name-only <base>...HEAD` (or the pull request's files). Note the frameworks from the profile.
2. Run `audit --changed --base <base> --json`; every finding on a changed line is in scope.
3. For each touched area, open its skill's `## Rules` and check the manual ones against the diff: forms (`fe-a11y-forms`), widgets (`fe-a11y-dialog`, `-menus`, `-tabs-accordion`, `-combobox`), media, i18n, security sinks, performance of new dependencies and images.
4. If a preview URL exists and the person agrees, run `audit --url <preview>` for contrast, rendered names and Lighthouse.
5. Write the review: blocking findings, suggestions, manual checks done, manual checks left for a person.

## Check

- Every finding has a real rule id (`list --rules`) or is clearly marked as a suggestion without one.
- The review says which commands ran and their result.

## References

- [references/review.md](references/review.md): file type to skill map, manual checklist per area, the review template, and how to phrase findings. Read it for every review.
