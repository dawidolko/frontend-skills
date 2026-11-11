---
name: fe-a11y-core
description: The entry point for accessibility in any front-end stack - WCAG 2.2 A and AA mapped to code, the page basics (language, title, landmarks, iframes, timing), what automated checks find and what needs a person, and which accessibility skill to load next. Use when starting accessibility work, auditing a page or a component library, or when asked "is this accessible" or "WCAG".
license: MIT
compatibility: Any agent that reads Agent Skills. The audit command needs Node.js 20 or newer; the page audit needs a local Chrome.
metadata:
  title: Accessibility, WCAG 2.2 map
  area: accessibility
  lane: C
  requires: web
  globs: "**/*.html **/*.jsx **/*.tsx **/*.vue **/*.svelte **/*.astro **/*.component.html"
  rules: "a11y/lang-valid a11y/no-meta-refresh a11y/iframe-title a11y/landmarks a11y/html-lang a11y/page-title a11y/img-alt a11y/control-name a11y/input-label a11y/no-click-on-static a11y/focus-visible a11y/color-contrast"
  version: 0.1.0
---

# Accessibility, WCAG 2.2 map

Read `.frontend-skills/profile.json` and `.frontend-skills/lessons.md` first when they exist; a confirmed lesson wins over this skill.

## Rules

- Work to WCAG 2.2 level AA as the target; say "helps you work to WCAG 2.2 AA", never "compliant" or "accessible".
- Use native HTML first; add ARIA only where no element does the job.
- `<html lang>` is set and every `lang` value is a valid tag (a11y/html-lang, a11y/lang-valid).
- Every page and route has a unique `<title>`; the layout has one `<main>` and labelled landmarks (a11y/page-title, a11y/landmarks).
- Images have `alt`, buttons and links have names, fields have labels (a11y/img-alt, a11y/control-name, a11y/input-label).
- Everything works with the keyboard and shows where focus is (a11y/no-click-on-static, a11y/focus-visible).
- Text contrast is at least 4.5:1, large text 3:1 (a11y/color-contrast).
- Every iframe has a `title` (a11y/iframe-title).
- No timed refresh or redirect; time limits can be turned off or extended (a11y/no-meta-refresh).
- Report results as "N problems found, M items need a person", never as a pass.

## Do this

1. Load the skill for the work at hand: forms `fe-a11y-forms`, keyboard and focus `fe-a11y-keyboard`, names and live regions `fe-a11y-aria`, colour and layout `fe-a11y-visual`, media `fe-a11y-media`, widgets `fe-a11y-dialog`, `fe-a11y-menus`, `fe-a11y-tabs-accordion`, `fe-a11y-combobox`, `fe-a11y-carousel-toast`, `fe-a11y-tables`.
2. Fix the shared layout first (document shell, skip link, landmarks, focus style, live region): one change fixes every page.
3. Fix shared components next (button, link, field, dialog, icon): find them through the profile and lessons.
4. Run the static audit on the changed files, then the page audit on a running page, then the manual checks for the criteria that tools do not cover.
5. Record decisions that the next person needs (for example "icons come from `<Icon>`, which sets `aria-hidden`") with `learn --lesson`.

## Check

- `npx github:dawidolko/frontend-skills audit --changed` runs the static rules; `audit --url <page>` adds axe-core and Lighthouse on the rendered page.
- Automated checks find only part of the problems: about half of the A and AA criteria have no automated rule at all. The manual list in the reference covers the rest.
- By hand on every change: keyboard only, screen reader on the changed part, zoom to 400%.

## References

- [references/wcag-map.md](references/wcag-map.md): all 55 WCAG 2.2 A and AA criteria with what to do in code, the rule ids and skills that cover each, and whether a tool or a person checks it. Read it for an audit, a review checklist or "which criterion is this".
