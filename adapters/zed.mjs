/*
 * Zed: skills only in .agents/skills; always-on instructions from the first file that exists in a fixed list
 * (.rules first, AGENTS.md seventh), so the block goes into that first file. No glob scoping.
 * Sources: https://zed.dev/docs/ai/skills, https://zed.dev/docs/ai/instructions (2026-11-11).
 */
import { statSync } from 'node:fs'
import path from 'node:path'

export const ZED_ORDER = [
  '.rules',
  '.cursorrules',
  '.windsurfrules',
  '.clinerules',
  '.github/copilot-instructions.md',
  'AGENT.md',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md'
]

const isFile = (p) => {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

export default {
  id: 'zed',
  label: 'Zed',
  detect: ['.rules', '.zed'],
  skillDirs: ['.agents/skills'],
  instructions: (root) => ZED_ORDER.find((f) => isFile(path.join(root, ...f.split('/')))) || 'AGENTS.md',
  rule: null,
  notes: ['Zed reads only the first instruction file of its list; the block is placed in that file.'],
  source: 'https://zed.dev/docs/ai/instructions'
}
