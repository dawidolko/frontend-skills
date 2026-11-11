/*
 * Cline: skills in .cline/skills, .clinerules/skills or .claude/skills (not .agents/skills); conditional rules in
 * .clinerules/*.md with a `paths` list; reads the root AGENTS.md. Sources: https://docs.cline.bot/features/skills,
 * https://docs.cline.bot/features/cline-rules (2026-11-11).
 */
import { digest, frontMatter, yamlList } from './shared.mjs'

export default {
  id: 'cline',
  label: 'Cline',
  detect: ['.clinerules', '.cline'],
  skillDirs: ['.claude/skills', '.cline/skills', '.clinerules/skills'],
  instructions: 'AGENTS.md',
  rule: (skill, ctx) => ({ path: `.clinerules/${skill.name}.md`, text: frontMatter([yamlList('paths', skill.globs)]) + digest(skill, ctx.skillPath(skill)) }),
  ruleGlobs: (text) => [...text.matchAll(/^ {2}- "(.+)"$/gm)].map((m) => m[1]),
  notes: ['If .clinerules is a single file rather than a folder, Cline rule files are not written; skills still are.'],
  source: 'https://docs.cline.bot/features/cline-rules'
}
