/*
 * Augment: skills in .augment/skills, .claude/skills or .agents/skills; AGENTS.md read up the tree. Glob scoping of
 * rules is not documented, so no rule files are written. Sources: https://docs.augmentcode.com/using-augment/skills,
 * https://docs.augmentcode.com/cli/rules (2026-11-11).
 */
export default {
  id: 'augment',
  label: 'Augment',
  detect: ['.augment', '.augment-guidelines'],
  skillDirs: ['.agents/skills', '.augment/skills', '.claude/skills'],
  instructions: 'AGENTS.md',
  rule: null,
  notes: [],
  source: 'https://docs.augmentcode.com/using-augment/skills'
}
