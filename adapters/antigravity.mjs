/*
 * Antigravity CLI: skills in .agents/skills, rules in .agents/rules/*.md (only files directly in that folder) with
 * trigger: glob, globs (quoted, comma-separated) and description; AGENTS.md is always on. Rule files are cut at
 * 24,000 bytes. Source: https://antigravity.google/docs/rules (2026-11-11).
 */
import { digest, frontMatter, oneLine, yamlQuoted } from './shared.mjs'

export default {
  id: 'antigravity',
  label: 'Antigravity CLI',
  detect: ['.agents/rules', '.agent/rules'],
  skillDirs: ['.agents/skills'],
  instructions: 'AGENTS.md',
  rule: (skill, ctx) => ({
    path: `.agents/rules/${skill.name}.md`,
    text:
      frontMatter(['trigger: glob', yamlQuoted('globs', skill.globs.join(', ')), yamlQuoted('description', oneLine(skill.description))]) +
      digest(skill, ctx.skillPath(skill), { description: false })
  }),
  ruleGlobs: (text) => JSON.parse(/^globs: (".*")$/m.exec(text)?.[1] || '""').split(/,\s*/),
  notes: [],
  source: 'https://antigravity.google/docs/rules'
}
