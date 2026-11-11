/*
 * OpenCode: skills in .opencode/skills, .claude/skills or .agents/skills; instructions in AGENTS.md. No per-file glob
 * scoping. Sources: https://opencode.ai/docs/skills/, https://opencode.ai/docs/rules/ (2026-11-11).
 */
export default {
  id: 'opencode',
  label: 'OpenCode',
  detect: ['opencode.json', 'opencode.jsonc', '.opencode'],
  skillDirs: ['.agents/skills', '.opencode/skills', '.claude/skills'],
  instructions: 'AGENTS.md',
  rule: null,
  notes: [],
  source: 'https://opencode.ai/docs/skills/'
}
