/*
 * Devin Desktop (formerly Windsurf), Devin CLI and Devin cloud: skills in .agents/skills (also .devin/skills and the
 * legacy .windsurf/skills); rules in .devin/rules/*.md with trigger: glob and globs; AGENTS.md always on (the cloud
 * agent includes the first 16 KiB). The documented example shows one quoted glob; several are written comma-separated,
 * which the page does not show (see docs/agents.md). Sources: https://docs.devin.ai/desktop/cascade/memories,
 * https://docs.devin.ai/desktop/cascade/skills (2026-11-11).
 */
import { digest, frontMatter, yamlQuoted } from './shared.mjs'

export default {
  id: 'devin',
  aliases: ['windsurf'],
  label: 'Devin / Windsurf',
  detect: ['.devin', '.windsurf', '.windsurfrules'],
  skillDirs: ['.agents/skills', '.devin/skills', '.windsurf/skills', '.claude/skills', '.github/skills', '.kiro/skills', '.cursor/skills', '.codex/skills'],
  instructions: 'AGENTS.md',
  rule: (skill, ctx) => ({
    path: `.devin/rules/${skill.name}.md`,
    text: frontMatter(['trigger: glob', yamlQuoted('globs', skill.globs.join(','))]) + digest(skill, ctx.skillPath(skill))
  }),
  ruleGlobs: (text) => JSON.parse(/^globs: (".*")$/m.exec(text)?.[1] || '""').split(','),
  notes: ['Devin CLI also reads .cursor/rules; with Cursor chosen too, the CLI sees both rule files of a skill.'],
  source: 'https://docs.devin.ai/desktop/cascade/skills'
}
