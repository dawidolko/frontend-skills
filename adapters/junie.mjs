/*
 * JetBrains Junie: skills in .junie/skills, and in .agents/skills in trusted projects; guidelines from
 * .junie/AGENTS.md, else AGENTS.md. No glob scoping. Sources: https://junie.jetbrains.com/docs/agent-skills.html,
 * https://junie.jetbrains.com/docs/guidelines-and-memory.html (2026-11-11).
 */
import { existsSync } from 'node:fs'
import path from 'node:path'

export default {
  id: 'junie',
  label: 'JetBrains Junie',
  detect: ['.junie'],
  skillDirs: ['.agents/skills', '.junie/skills'],
  instructions: (root) => (existsSync(path.join(root, '.junie', 'AGENTS.md')) ? '.junie/AGENTS.md' : 'AGENTS.md'),
  rule: null,
  notes: ['Junie reads .agents/skills only in a trusted project.'],
  source: 'https://junie.jetbrains.com/docs/agent-skills.html'
}
