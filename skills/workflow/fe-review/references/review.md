# Review reference

Depth for the `fe-review` skill. Rule ids in brackets: `frontend-skills explain <id>`.

## Which skills a change touches

| Touched | Skills |
| --- | --- |
| Any markup (`.html`, `.jsx`, `.tsx`, `.vue`, `.svelte`, `.astro`, Angular templates) | fe-html, fe-a11y-aria, fe-a11y-keyboard, and the framework skill |
| A form or input | fe-a11y-forms |
| Dialog, menu, tabs, accordion, combobox, carousel, toast, table | fe-a11y-dialog, fe-a11y-menus, fe-a11y-tabs-accordion, fe-a11y-combobox, fe-a11y-carousel-toast, fe-a11y-tables |
| CSS, tokens, theme | fe-a11y-visual, styling skills |
| Images, video, fonts | fe-a11y-media, fe-core-web-vitals and the image and font skills |
| Head, routes, metadata | fe-seo-metadata |
| Strings, dates, money, locales | fe-i18n |
| HTML from data, env variables, headers, third parties | fe-security, fe-perf-delivery |
| Tests | fe-testing |
| Configs, dependencies, CI | fe-tooling, fe-perf-delivery |

## Manual checklist (pick the rows the diff touches)

| Area | Ask |
| --- | --- |
| Keyboard | Can every new control be reached and used with Tab, Enter, Space, Escape? Is focus visible and not hidden? [a11y/no-keyboard-trap, a11y/focus-not-obscured] |
| Screen reader | Does each new control have a name, role and state? Are new messages announced? [a11y/state-exposed, a11y/status-message-live] |
| Visual | Contrast of new colours, colour-only cues, 24px targets, reflow at 320px |
| Content | Alt text meaning, link text, error message wording |
| Motion and media | Pause controls, reduced motion, captions |
| Performance | New dependency size, new images sized and not lazy above the fold, third parties loaded late |
| Security | Data reaching HTML sinks, new env variables, new third-party origins |
| i18n | New strings through the i18n layer, no concatenation, Intl for formats |
| Tests | Behaviour covered, no `.only`, no fixed waits [test/no-focused-tests] |

## Review template

```text
Checked: audit --changed (0 critical, 1 serious, 2 minor), keyboard walk of the new dialog.
Blocking
- a11y/dialog-name src/components/ShareDialog.tsx:12, the dialog is announced without a name; add aria-labelledby="share-title".
Suggestions
- perf/no-whole-library-import src/utils/date.ts:1, moment ships the whole library and its locales; Intl.DateTimeFormat covers this use.
Left for a person
- Screen reader pass on the share dialog (VoiceOver or NVDA).
```

## Phrasing

- Say what happens to a person ("keyboard users cannot reach…"), then the fix.
- One finding per problem, at the line to change; group repeats ("and 3 more in this file").
- Mark what you are unsure about as a question, not a finding.

## Sources

- WAI, Easy Checks: https://www.w3.org/WAI/test-evaluate/preliminary/
- Repository architecture (audit, --changed, report): `docs/architecture.md`
