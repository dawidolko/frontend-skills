# Profile and lessons reference

Depth for the `fe-learn` skill. The file formats are defined in `docs/architecture.md` ("Project profile", "Project helpers", "Lessons").

## Profile fields that change what you do

| Field | Use it to |
| --- | --- |
| `packageManager`, `monorepo` | Run commands with the right tool, in the right package |
| `projects[].frameworks` (with versions) | Load the framework skill and use the APIs of that version |
| `projects[].styling` | Choose Tailwind utilities, CSS modules or Sass partials |
| `projects[].testing`, `linting`, `build` | Run the right test, lint and build scripts |
| `projects[].i18n` | Add strings through the i18n library (`fe-i18n`) |
| `stack` | Know which skills and rules apply |
| `helpers` | Follow the project's own conventions (below) |
| `agents`, `skills` | Know what is installed where |
| `audit` | Respect the person's `failOn`, ignores, excludes and budgets |

## Helpers

| Helper id | Means | Do |
| --- | --- | --- |
| `rem-function` | A Sass or Less function converts px to rem | Write `rem-calc(16px)` (its `call`), not raw px or hand-computed rem |
| `px-to-rem-build` | A PostCSS plugin converts px at build time | Write px as the convention says |
| `icon-classes` | An icon font build generates classes | Use `icon-<name>` classes from its `prefix` and `sourceDir` |
| `icon-sprite` | An SVG sprite build | Use `<svg><use href="#name"></svg>` from the sprite |
| `design-tokens` | Token files (Style Dictionary, Tokens Studio) | Use the generated variables, never raw values |
| `custom-properties` | Many `--variables` on `:root` | Reuse them (`prefixes` shows the families) |

A helper the person adds or corrects gets `"source": "person"` and survives `learn` and `update`.

## Lessons

Format: `- <date> · <kind> · <text> [<rule ids>]`, one line, at most 300 characters.

| Kind | Good | Not a lesson |
| --- | --- | --- |
| convention | "Buttons come from `components/ui/Button.tsx`; never style a raw `<button>`. [html/button-type]" | "Use semantic HTML" (the skills say it) |
| command | "E2E tests need `pnpm dev:mock` running first; then `pnpm test:e2e`." | "Run the tests" |
| pitfall | "The CMS returns HTML in `body`; always render it through `lib/safeHtml.ts`. [security/raw-html-sink]" | A secret, a token, a password, a private URL |

## Questions to ask the person (short)

1. "These are the helpers I found: … Correct? Anything missing?"
2. "Where do shared components live (button, field, dialog, icon)?"
3. "Which command must pass before a pull request?"
4. "Any rule you deliberately do not follow, and why?" (record as a lesson with the rule id, or as `audit.ignore` if they want it silenced)

## Sources

- Repository architecture (profile, helpers, lessons): `docs/architecture.md`
- Agent Skills specification: https://agentskills.io/specification
