/*
 * Cursor: skills in .agents/skills (also .cursor, .claude and .codex skills folders), glob-scoped rules as .mdc files
 * in .cursor/rules with description, globs (unquoted, comma-separated) and alwaysApply: false; plain .md files there
 * are ignored. Instructions in AGENTS.md. Sources: https://cursor.com/docs/context/rules,
 * https://cursor.com/docs/context/skills (2026-11-11).
 */
import { digest, oneLine } from './shared.mjs'

export default {
  id: 'cursor',
  label: 'Cursor',
  detect: ['.cursor', '.cursorrules'],
  skillDirs: ['.agents/skills', '.cursor/skills', '.claude/skills', '.codex/skills'],
  instructions: 'AGENTS.md',
  rule: (skill, ctx) => ({
    path: `.cursor/rules/${skill.name}.mdc`,
    text: `---\ndescription: ${oneLine(skill.description).replace(/^[-?:,[\]{}#&*!|>'"%@`]/, '')}\nglobs: ${skill.globs.join(', ')}\nalwaysApply: false\n---\n\n${digest(skill, ctx.skillPath(skill), { description: false })}`
  }),
  ruleGlobs: (text) => (/^globs: (.+)$/m.exec(text)?.[1] || '').split(/,\s*/),
  notes: [],
  source: 'https://cursor.com/docs/context/rules'
}
