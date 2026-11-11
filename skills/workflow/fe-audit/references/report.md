# Audit report reference

Depth for the `fe-audit` skill. Formats are defined in `docs/architecture.md` ("Report").

## Condensed JSON

```json
{"v":1,"failOn":"serious","failed":true,"counts":{"critical":1,"serious":2,"moderate":0,"minor":3},
 "rules":{"a11y/img-alt":{"s":"critical","fix":"Describe the image in alt, or alt=\"\" if decorative.","at":["src/App.tsx:12"]}}}
```

| Key | Meaning |
| --- | --- |
| `failOn` | Lowest severity that fails (`--fail-on` or `audit.failOn`) |
| `failed` | True when something is at or above `failOn` |
| `counts` | Findings per severity |
| `rules.<id>.s` | Severity |
| `rules.<id>.fix` | The fix in one sentence |
| `rules.<id>.at` | Every location, `file:line` |

Exit codes: 0 clean, 1 something at or above `failOn`, 2 usage error, 3 a requested tool is not available (for example `--url` without Chrome).

## Fix order

1. Critical findings in shared components and layouts (one fix, many pages).
2. Critical findings elsewhere.
3. Serious findings that block keyboard or screen reader use (focus, names, roles).
4. Serious and moderate findings that slow every visit (LCP image, blocking scripts, layout shift).
5. The rest, grouped by file, so each pull request touches few files.

Within a level, prefer the rule with the most locations and the smallest fix.

## Summary template

```text
Audit of <project> (static, 2026-11-11): 1 critical, 4 serious, 6 moderate, 3 minor.
Top rules:
- a11y/input-label (critical, 3×) fields without labels; fix in components/ui/Field.tsx.
- a11y/focus-visible (serious, 2×) outline removed in app.css:9; add a :focus-visible style.
Not checked without a running page: contrast, names from components, Lighthouse (run audit --url).
For a person: keyboard walk, screen reader on the form, zoom to 400%.
Full report: frontend-report.md. Details: npx github:dawidolko/frontend-skills explain <id>.
```

## Manual checklist by area

| Area | Check by hand |
| --- | --- |
| Keyboard | Tab through every control, visible focus, Escape closes, no trap |
| Screen reader | Names, roles, states and announcements of changed parts |
| Visual | Zoom 400%, 320px width, text spacing, colour-only cues |
| Content | Alt text meaning, link text, headings, error messages |
| Media | Captions, transcripts, pause controls |
| Performance | Field data (CrUX or web-vitals) at p75 |
| Security | Data flows into HTML sinks, auth, headers on the deployed site |

## Sources

- Repository architecture (report, exit codes): `docs/architecture.md`
- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
