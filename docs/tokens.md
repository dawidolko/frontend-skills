# How token cost is measured

Every token number this project prints or publishes comes from `cli/lib/tokens.mjs`, a dependency-free estimator, and says so.

## Why an estimate

The command must run with no dependencies and no network, and Claude's tokenizer is not published, so the exact count for every model cannot be computed locally. The estimator counts words, long-word extra length, digits, punctuation and line breaks with weights fitted to a public tokenizer.

## Method

- Reference tokenizer: o200k_base, through the `gpt-tokenizer` dev dependency (MIT).
- Corpus: this repository's own Markdown under `skills/`, `rules/` and `docs/`.
- Fit: least squares over the five counts, no intercept, by `node tools/calibrate-tokens.mjs`.
- Check: `node tools/calibrate-tokens.mjs --check` is part of `npm run check` and fails when the total error is above 10% or any file of 200 tokens or more is off by more than 25%.

## Measured on 2026-11-11

| Corpus | Files | o200k tokens | Estimated | Total error | Mean error per file | Worst file |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Markdown (fitted on) | 33 | 27,051 | 27,176 | +0.5% | 3.0% | −6.9% |
| JavaScript under `cli/` (not fitted on) | | | | +2.4% | 3.2% | |

Commands: `node tools/calibrate-tokens.mjs`, and for the second row a one-off script that ran the same estimator on `cli/**/*.mjs`.

Other models' tokenizers count differently (Claude's typically somewhat more tokens for the same English text); treat the numbers as o200k-equivalent and use them to compare skills and budgets, not to predict a bill.

## What the numbers mean

- **Listing**: the name and description of a skill, which an agent keeps in context for every installed skill.
- **Body**: the whole `SKILL.md`, loaded when the agent uses the skill.
- **Reference**: one file under `references/`, loaded only when a step needs it.
- **Instruction block**: the marked block in `AGENTS.md`, `CLAUDE.md` or `GEMINI.md`, always loaded.
- **Glob rule**: a rule file loaded when a matching file is open (Cursor, Copilot, Claude Code rules and the others in `docs/agents.md`).

`npx github:dawidolko/frontend-skills tokens` prints these for a project; `tokens --all` for every skill in the package.

## The reference skills today

From `node cli/index.mjs tokens --all` on 2026-11-11:

| Skill | Listing | Body | Reference |
| --- | ---: | ---: | ---: |
| `fe-a11y-forms` | ~92 | ~875 | `forms.md` ~1,223 |
| `fe-html` | ~76 | ~869 | `document.md` ~1,289 |
| `fe-react` | ~83 | ~794 | `react.md` ~1,070 |

On the React fixture project with Claude Code and Cursor (41 matching skills on 2026-11-11), each agent always loads about 3,655 tokens (41 skill listings ~3,520 and the instruction block ~135); a glob rule file adds about 460 when a matching file is open (`tokens` on `fixtures/projects/react-vite` after `init`). The listings of all 50 skills come to ~4,219 (`tokens --all`).
