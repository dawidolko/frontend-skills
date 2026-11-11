/*
 * Gemini CLI: skills in .agents/skills (takes precedence over .gemini/skills); always-on context in GEMINI.md, since
 * AGENTS.md is read only when a person adds it to context.fileName. No glob-scoped rules.
 * Sources: https://geminicli.com/docs/cli/skills/, https://geminicli.com/docs/cli/gemini-md/ (2026-11-11).
 */
export default {
  id: 'gemini',
  label: 'Gemini CLI',
  detect: ['GEMINI.md', '.gemini'],
  skillDirs: ['.agents/skills', '.gemini/skills'],
  instructions: 'GEMINI.md',
  rule: null,
  notes: ['Gemini CLI was replaced by Antigravity CLI for unpaid tiers on 2026-06-18; choose "antigravity" too if you use it.'],
  source: 'https://geminicli.com/docs/cli/skills/'
}
