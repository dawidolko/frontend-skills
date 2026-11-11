/*
 * Claude Code: skills in .claude/skills (it does not read .agents/skills), glob-scoped rules in .claude/rules with a
 * `paths` list, and the always-on block in CLAUDE.md when one exists, otherwise in AGENTS.md, which Claude Code
 * reads only while no CLAUDE.md exists (so CLAUDE.md is never created beside an AGENTS.md).
 * Sources: https://code.claude.com/docs/en/skills, https://code.claude.com/docs/en/memory (2026-11-11).
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { digest, frontMatter, yamlList } from './shared.mjs'

export default {
  id: 'claude',
  label: 'Claude Code',
  detect: ['CLAUDE.md', '.claude', 'CLAUDE.local.md'],
  skillDirs: ['.claude/skills'],
  instructions: (root) => (existsSync(path.join(root, 'CLAUDE.md')) ? 'CLAUDE.md' : existsSync(path.join(root, '.claude', 'CLAUDE.md')) ? '.claude/CLAUDE.md' : 'AGENTS.md'),
  rule: (skill, ctx) => ({ path: `.claude/rules/${skill.name}.md`, text: frontMatter([yamlList('paths', skill.globs)]) + digest(skill, ctx.skillPath(skill)) }),
  ruleGlobs: (text) => [...text.matchAll(/^ {2}- "(.+)"$/gm)].map((m) => m[1]),
  notes: [],
  source: 'https://code.claude.com/docs/en/skills'
}
