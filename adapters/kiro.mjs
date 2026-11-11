/*
 * Kiro: skills in .kiro/skills (not .agents/skills); steering files in .kiro/steering/*.md with inclusion: fileMatch
 * and fileMatchPattern (an array); AGENTS.md is always included. Sources: https://kiro.dev/docs/skills/,
 * https://kiro.dev/docs/steering/ (2026-11-11).
 */
import { digest, frontMatter, yamlFlow } from './shared.mjs'

export default {
  id: 'kiro',
  label: 'Kiro',
  detect: ['.kiro'],
  skillDirs: ['.kiro/skills'],
  instructions: 'AGENTS.md',
  rule: (skill, ctx) => ({
    path: `.kiro/steering/${skill.name}.md`,
    text: frontMatter(['inclusion: fileMatch', yamlFlow('fileMatchPattern', skill.globs)]) + digest(skill, ctx.skillPath(skill))
  }),
  ruleGlobs: (text) => JSON.parse(/^fileMatchPattern: (\[.*\])$/m.exec(text)?.[1] || '[]'),
  notes: [],
  source: 'https://kiro.dev/docs/steering/'
}
