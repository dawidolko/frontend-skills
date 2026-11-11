/*
 * Marked blocks in files that people also edit (AGENTS.md, CLAUDE.md, GEMINI.md, CONVENTIONS.md): the tool owns only
 * the text between its start and end markers. upsertBlock replaces the block in place or appends it; removeBlock
 * takes it out and leaves everything else byte for byte, keeping the file's own line endings. Also renders the
 * block itself, which tells an agent to read the profile and lessons first and how to run the audit.
 */

export const START = '<!-- frontend-skills:start -->'
export const END = '<!-- frontend-skills:end -->'
const BLOCK = /<!-- frontend-skills:start -->[\s\S]*?<!-- frontend-skills:end -->/

const eolOf = (text) => (/\r\n/.test(text) ? '\r\n' : '\n')

/** Inserts or replaces the block. Returns the new text. */
export function upsertBlock(text, body) {
  const eol = eolOf(text || '')
  const block = [START, body.trim(), END].join('\n').replace(/\n/g, eol)
  if (!text) return `${block}${eol}`
  if (BLOCK.test(text)) return text.replace(BLOCK, () => block)
  return `${text}${eol}${block}${eol}`
}

/** Removes the block and the line breaks it added, so the file is again byte for byte what it was. */
export function removeBlock(text) {
  if (!BLOCK.test(text)) return text
  const eol = eolOf(text)
  const out = text.replace(new RegExp(`(?:${eol})?${BLOCK.source}(?:${eol})?`), '')
  return out.trim() === '' ? '' : out
}

/** The block body of the current text, or null. */
export function readBlock(text) {
  const m = BLOCK.exec(text || '')
  return m ? m[0].slice(START.length, -END.length).trim() : null
}

/** The always-on instructions. index: one line per skill for agents that read no skills folder. */
export function renderBlock({ index = null, helpers = [] } = {}) {
  const lines = [
    '## Front-end work (frontend-skills)',
    '',
    '- Before front-end work, read `.frontend-skills/profile.json` (the stack) and `.frontend-skills/lessons.md` (confirmed conventions of this project; they win over any skill).',
    '- Use the installed `fe-*` skill that matches the files you edit.',
    '- After changing UI code, run `npx github:dawidolko/frontend-skills audit --changed --json` and fix findings at `serious` and above; `explain <rule id>` gives the reason, the source and the fix.',
    '- Name rule ids (such as `a11y/img-alt`) in reviews and commit messages.'
  ]
  if (helpers.length) lines.push('', '### This project', '', ...helpers)
  if (index) lines.push('', '### Skills', '', index)
  return lines.join('\n')
}
