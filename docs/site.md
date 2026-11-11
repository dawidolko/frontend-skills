# The site (skills.dawidolko.pl)

The site is plain HTML built from this repository by a small Node.js script with no dependencies. Every number and
example on it comes from the repository at build time: the rules and skills through `cli/lib/catalog.mjs`, the agents
and the files each one gets through `adapters/`, the token cost through the command's own estimator, the example
report and the Markdown report by running `audit` on `fixtures/projects/react-vite`, the files each agent gets from
the installer's own planner on that project, the options of each command from its `--help`, and the terminal
recordings from `docs/media/` (made by `tools/record.mjs`; the still PNG frames are shown to people who ask for less
motion or turn animations off in the accessibility panel).

## Commands

```sh
npm run site:build   # writes site/dist/ (ignored by git)
npm run site:check   # checks site/dist/ with no network; exits 1 with the list of problems
```

`site:build` takes `--out <dir>` and `site:check` takes `--dir <dir>` when the output should go elsewhere.

To look at the result, serve `site/dist/` with any static server, for example
`python3 -m http.server 4173 --bind 127.0.0.1 --directory site/dist`, and open port 4173 on localhost in a browser.
Stop the server when you are done.

## What `site:check` proves

- Every internal link and `#fragment` resolves to a built page and an existing id.
- Every page has `lang`, one `h1`, a title, a description, `<main id="main">`, the accessibility panel and a canonical
  URL; every page except the 404 has `hreflang` links for `en`, `pl` and `x-default`, and the other language's page
  points back.
- Every rule and every skill of the repository has a page in English and in Polish; `rules/index.json` lists every
  rule once with its id, title, area, severity and check; both dictionary pages list every rule.
- The sitemap lists exactly the built pages; `CNAME`, `robots.txt` (naming the sitemap), `llms.txt`, `.nojekyll`,
  the Open Graph images, the favicon and `404.html` exist.
- No page loads a script, stylesheet, font, image or frame from another host.
- `site/i18n/en.json` and `site/i18n/pl.json` have the same keys.

## Layout of `site/`

| Path | What it is |
| --- | --- |
| `build.mjs` | The build: assets, both languages, the search index, sitemap, robots, llms.txt, Open Graph images, CNAME. |
| `check.mjs` | The checks above. |
| `lib/data.mjs` | Reads everything the pages show from the repository. |
| `lib/layout.mjs` | The page frame: head (SEO, hreflang, Open Graph, JSON-LD), header, footer; translation and plural helpers. |
| `lib/pages.mjs` | The body of each page. |
| `lib/markdown.mjs` | A small Markdown renderer that escapes everything and links known rule ids. |
| `lib/og.mjs` | The Open Graph image as SVG, rendered to PNG by a headless Chrome when one is found. |
| `i18n/en.json`, `i18n/pl.json` | Every user-facing string of the site, with the same keys. |
| `assets/styles.css` | The one stylesheet (light and dark, from 320 px up, reduced motion). |
| `assets/site.js` | Theme switch, copy buttons, install picker command, outline, drawer, dictionary search and filters; every page works without it. |
| `assets/icons.svg` | The icon sprite (drawn for this site). |
| `assets/a11y/` | The author's accessibility panel, copied unchanged; `SOURCE.md` names the commit. |
| `assets/fonts/` | Open Sans (latin and latin-ext subsets, SIL OFL 1.1, `OFL.txt`). |
| `og/` | The Open Graph PNGs used when no Chrome is available at build time. |

## Pages

English at `/`, Polish at `/pl/`, with the same paths below: `/`, `/how-it-works/`, `/rules/`, `/rules/<area>/<name>/`,
`/skills/`, `/skills/<name>/`, `/commands/`, `/faq/`, `/about/`, and one `/404.html` with both languages. Skill and rule
texts stay in English (agents read them); everything around them is translated.

## Theme, layout and motion

- The header has a day, night and system theme switch. The choice is kept in `localStorage` (`fs-theme`) and applied
  by a one-line script in the head before the first paint (allowed by its hash in the Content-Security-Policy). The
  night colours are written once in `styles.css` between `/*@dark*/` markers; the build applies them to the saved
  choice and to the system preference.
- The dictionary, the skills and the guide pages use a documentation layout: a chapter sidebar (sticky on wide
  screens, a drawer through the `popover` attribute on phones), the page, and an outline of the page on very wide
  screens.
- Hover and keyboard focus look the same and change only colour, background, border, shadow and a 2 px lift, in
  180 ms. Under `prefers-reduced-motion` or the panel's "stop animations", nothing transitions or lifts.

## Changing the site

- Text: edit both language files; `site:check` fails when their keys differ. Counted words use the `plurals` table
  (`{n:rules}` gives "1 rule", "3 rules"; in Polish "1 reguła", "3 reguły", "5 reguł").
- A new command: add it to `COMMAND_ORDER` in `lib/data.mjs` and its description under `commands.items` in both
  language files. A command without a file in `cli/commands/` is shown as "coming".
- The Open Graph image changes with the tagline and the counts. After a build on a machine with Chrome, copy
  `site/dist/og-en.png` and `site/dist/og-pl.png` to `site/og/` so builds without Chrome stay current.
- The accessibility panel: change it in the author's site repository, then copy `a11y-panel.js` and `a11y-panel.css`
  here again and update the commit in `assets/a11y/SOURCE.md`.

## Rules the site keeps

No cookies, no analytics, no request to another host (the Content-Security-Policy allows only this site). The panel
keeps its settings in the browser's local storage. The site never claims conformance: "built to WCAG 2.2 AA as a
target" is the most it says, and it states that automated checks find only part of the problems.

## Publishing

The site is published by copying `site/dist/` to the `gh-pages` branch, which GitHub Pages serves at
skills.dawidolko.pl (the `CNAME` file is part of the build). Only the maintainer publishes.
