# Sources: the research behind Frontend Skills

These notes are the ground the skills and rules of Frontend Skills are written from. They record what the public
standards, the vendors' documentation and the open-source projects of this kind say, and turn it into candidate rules
that the content of this repository can be built on.

**Research date:** 2026-11-11. Every fact in these notes was read on that date unless its row says otherwise. Versions,
browser support (Baseline), Lighthouse scoring and the formats the coding agents read change often: recheck them on the
linked page before you rely on them, and update the date when you do.

## How the notes are organised

| File | What it holds |
|---|---|
| [prior-art.md](prior-art.md) | The open-source skill, rule and instruction collections for AI coding agents that touch front-end work, the formats each agent reads, the installers around them, and the conclusions: what to learn, what none of them does, how this project stands out. |
| [html.md](html.md) | Document structure, semantics, forms, tables, media, metadata, validity, the W3Schools HTML conventions. |
| [css.md](css.md) | Layout, the cascade and layers, custom properties, modern features with their Baseline status, architecture and naming, the W3Schools CSS conventions, what to avoid. |
| [responsive.md](responsive.md) | Viewport, fluid type and spacing, breakpoints and container queries, images, touch targets, reflow and zoom, orientation, print. |
| [accessibility.md](accessibility.md) | Every WCAG 2.2 level A and AA success criterion mapped to front-end work, with techniques and checks; what automated tools find and what they cannot. |
| [accessibility-patterns.md](accessibility-patterns.md) | The WAI-ARIA Authoring Practices patterns, ARIA use, focus management, and the light libraries that help. |
| [performance.md](performance.md) | Core Web Vitals and their thresholds, how the current Lighthouse scores a page, images, fonts, CSS and JavaScript delivery, third parties, caching, framework features. |
| [javascript.md](javascript.md) | JavaScript and TypeScript practices that matter in the browser, the W3Schools JavaScript conventions, types at the boundaries. |
| [react.md](react.md), [nextjs.md](nextjs.md), [vue.md](vue.md), [nuxt.md](nuxt.md), [angular.md](angular.md), [svelte.md](svelte.md), [astro.md](astro.md), [tailwind-sass.md](tailwind-sass.md), [web-components.md](web-components.md) | One file per technology: the current stable version, how a project using it is detected, and candidate rules from its own documentation, including the mistakes its docs warn about. |
| [seo.md](seo.md), [i18n.md](i18n.md), [security.md](security.md), [testing.md](testing.md), [tooling.md](tooling.md) | The cross-cutting areas at the depth a skill needs. |

### Candidate rules per file (2026-11-11)

About 1,050 candidate rules in all, no id used twice:

| File | Rules | File | Rules | File | Rules |
|---|---|---|---|---|---|
| html | 96 | accessibility | 91 | react | 44 |
| css | 65 | accessibility-patterns | 105 | nextjs | 49 |
| responsive | 45 | performance | 49 | vue | 48 |
| javascript | 68 | seo | 48 | nuxt | 43 |
| testing | 39 | i18n | 27 | angular | 50 |
| tooling | 21 | security | 38 | svelte | 39 |
| astro | 27 | tailwind-sass | 32 | web-components | 27 |

These are candidates, more than a short skill should carry. Each file's "Notes for skill authors" says which rules
belong in the short skill and which in a reference file; about a quarter of the HTML and JavaScript rules are W3Schools
style conventions at `info` level that can be merged.

### Facts that change often (recheck before relying on them)

- Versions: Lighthouse 13.6.0; React 19.3.1; Next.js 16.4.6; Vue 3.5.45; Nuxt 4.6.4; Angular 22.2.5; Svelte 5.57.3 and
  SvelteKit 3.2.0 (Kit 3 moved config out of `svelte.config.js` and renamed `$lib` to `#lib`); Astro 7.4.10; Tailwind
  CSS 4.3.5; Sass 1.108.2; TypeScript 7.0.2 (the native compiler, with no programmatic API yet); ESLint 10.14.0 (no
  `.eslintrc`); Vite 8.3.8; Node.js 26 is the active LTS line.
- Baseline statuses come from `web-features` 3.45.0; several features became Baseline in 2026 (for example scroll-driven
  animations newly available on 2026-10-27).
- The coding agents' formats moved in 2026 (Gemini CLI replaced by Antigravity CLI for free users, Roo Code shut down,
  Windsurf documented under Devin, Codex documentation moved): see [prior-art.md](prior-art.md), section 1.

### Notes for whoever writes the rule dictionary

- Ids are written with backticks in some files and without in others; the id is the same either way.
- Two ideas appear in both accessibility files; [accessibility.md](accessibility.md) owns the success-criterion ids and
  [accessibility-patterns.md](accessibility-patterns.md) names the pattern-side variants it should merge into.
- Licences that matter for libraries: axe-core and its `@axe-core/*` packages are MPL-2.0, DOMPurify is
  `(MPL-2.0 OR Apache-2.0)`, pa11y is LGPL-3.0, Lit is BSD-3-Clause. Calling such a tool on demand is fine; copying its
  source into this MIT repository is not.

### The shape of a standards file

Each standards file opens with its primary sources and then holds tables of **candidate rules**:

| Column | Meaning |
|---|---|
| id | A proposed stable id, `<area>/<short-name>`, e.g. `a11y/img-alt`. The rule dictionary may rename it; the note keeps the source. |
| rule | The rule in one sentence, in our own words. |
| why | What goes wrong for people or for the page without it. |
| source | The standard or documentation it comes from: name, URL, section or success criterion number. |
| applies to | Plain HTML, CSS, JavaScript, a framework, or any. |
| check | `static` (found in source by a script), `runtime` (needs a running page, with the tool or audit id), or `manual` (a person only). |
| bad → good | A short note for the two examples a rule needs. |
| light library | Where one really helps: name, version, licence and size as read on its registry page, and why that one. |

Every file ends with notes for skill authors and a **Not verified** list: what could not be confirmed on a primary
source was left out of the tables and is named there instead.

## The rule on sources

1. **Own words, always.** No sentence of a specification, of MDN, web.dev, W3Schools, a framework's documentation or
   another project is copied into these notes or into the skills built from them. Each rule is stated in our own words
   and links its source; short code examples are written by us.
2. **Primary sources for anything that matters.** A threshold, a weight, a version, a size, a date or a licence is
   taken from the page that owns it: the W3C or WHATWG specification, the WCAG Understanding document, the vendor's
   documentation, the package registry, the project's LICENSE file. A blog post may lead to a fact; it never is the
   source of one.
3. **Links and dates.** Every fact carries its URL; the date it was read is given at the top of each file and on any
   row read on another day.
4. **Licences are read, not assumed.** Text or code adapted from an open-source project is allowed only under a
   permissive licence (MIT, Apache-2.0, BSD, ISC, CC0, CC-BY with attribution) and is recorded in `THIRD-PARTY.md` at
   the root of the repository with the source, the licence and what was taken. Nothing is taken from a project with no
   licence, a copyleft licence or a non-commercial licence.
5. **Honest claims.** The notes never claim that following them makes a site conformant. Automated checks find only
   part of the accessibility problems; what only a person can judge is marked `manual`.

## Primary sources

- WCAG 2.2: https://www.w3.org/TR/WCAG22/ — Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/ —
  Techniques: https://www.w3.org/WAI/WCAG22/Techniques/
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/ — WAI-ARIA: https://www.w3.org/TR/wai-aria/ —
  ARIA in HTML: https://www.w3.org/TR/html-aria/ — Using ARIA: https://www.w3.org/TR/using-aria/
- W3C Accessibility Conformance Testing rules: https://www.w3.org/WAI/standards-guidelines/act/rules/
- HTML Living Standard (WHATWG): https://html.spec.whatwg.org/
- CSS specifications (W3C CSS Working Group): https://www.w3.org/Style/CSS/specs.en.html
- MDN Web Docs: https://developer.mozilla.org/
- Baseline and web-features: https://web.dev/baseline and https://webstatus.dev/
- web.dev (Core Web Vitals and performance guidance): https://web.dev/
- Chrome for Developers, Lighthouse: https://developer.chrome.com/docs/lighthouse/
- W3Schools style guides named by the owner: HTML https://www.w3schools.com/html/html5_syntax.asp, JavaScript
  https://www.w3schools.com/js/js_conventions.asp, and their related pages
- Google Search Central: https://developers.google.com/search/docs
- W3C Internationalization: https://www.w3.org/International/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- The official documentation of each framework and tool, linked in its own file.

The full list of pages read is in each file.
