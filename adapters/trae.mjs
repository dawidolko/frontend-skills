/*
 * Trae: skills in .trae/skills (.agents/skills only when enabled in its settings); rules in .trae/rules/*.md with
 * description, globs (comma-separated) and alwaysApply: false; AGENTS.md when enabled in its settings.
 * Sources: https://docs.trae.ai/ide/skills, https://docs.trae.ai/ide/rules (2026-11-11).
 */
import { digest, oneLine } from './shared.mjs'

export default {
  id: 'trae',
  label: 'Trae',
  detect: ['.trae'],
  skillDirs: ['.trae/skills'],
  instructions: 'AGENTS.md',
  rule: (skill, ctx) => ({
    path: `.trae/rules/${skill.name}.md`,
    text: `---\ndescription: ${JSON.stringify(oneLine(skill.description))}\nglobs: ${skill.globs.join(',')}\nalwaysApply: false\n---\n\n${digest(skill, ctx.skillPath(skill), { description: false })}`
  }),
  ruleGlobs: (text) => (/^globs: (.+)$/m.exec(text)?.[1] || '').split(','),
  notes: ['Trae reads AGENTS.md only after it is enabled in its settings.'],
  source: 'https://docs.trae.ai/ide/rules'
}
