/*
 * The table of coding agents and the choice of skills folders. Each agent is one file in this folder (what it reads,
 * where, in which format; sources in docs/agents.md). chooseSkillDirs() picks the smallest set of skills folders that
 * every chosen agent reads, with the fewest duplicates (an agent that reads two chosen folders lists each skill twice),
 * preferring the shared .agents/skills folder.
 */
import aider from './aider.mjs'
import amazonq from './amazonq.mjs'
import antigravity from './antigravity.mjs'
import augment from './augment.mjs'
import claude from './claude.mjs'
import cline from './cline.mjs'
import codex from './codex.mjs'
import continueAgent from './continue.mjs'
import copilot from './copilot.mjs'
import cursor from './cursor.mjs'
import devin from './devin.mjs'
import gemini from './gemini.mjs'
import junie from './junie.mjs'
import kiro from './kiro.mjs'
import opencode from './opencode.mjs'
import trae from './trae.mjs'
import zed from './zed.mjs'

export const ADAPTERS = [claude, codex, cursor, copilot, gemini, antigravity, devin, opencode, cline, zed, junie, kiro, augment, trae, continueAgent, amazonq, aider]

const BY_ID = new Map()
for (const a of ADAPTERS) {
  BY_ID.set(a.id, a)
  for (const alias of a.aliases || []) BY_ID.set(alias, a)
}

/** The adapter for an id or alias, or undefined. */
export const adapter = (id) => BY_ID.get(String(id).toLowerCase())

/** Resolves a list of ids and aliases to unique adapter ids; unknown names are returned separately. */
export function resolveAgents(names) {
  const ids = []
  const unknown = []
  for (const n of names) {
    const a = adapter(n)
    if (!a) unknown.push(n)
    else if (!ids.includes(a.id)) ids.push(a.id)
  }
  return { ids, unknown }
}

const PREFERENCE = ['.agents/skills', '.claude/skills', '.github/skills', '.kiro/skills', '.trae/skills', '.cline/skills', '.junie/skills', '.devin/skills', '.opencode/skills', '.augment/skills', '.gemini/skills', '.cursor/skills', '.codex/skills', '.windsurf/skills', '.clinerules/skills']
const rank = (d) => {
  const i = PREFERENCE.indexOf(d)
  return i === -1 ? PREFERENCE.length : i
}

function* subsets(items, size, start = 0, acc = []) {
  if (acc.length === size) {
    yield acc
    return
  }
  for (let i = start; i < items.length; i++) yield* subsets(items, size, i + 1, [...acc, items[i]])
}

/**
 * Chooses the skills folders for these agent ids. Returns { dirs, duplicates: [{ agent, dirs }], readers:
 * { agent: dir } } where readers names the folder each agent reads (null for agents with no skills folder).
 */
export function chooseSkillDirs(ids) {
  const agents = ids.map(adapter).filter((a) => a && a.skillDirs.length)
  const candidates = [...new Set(agents.flatMap((a) => a.skillDirs))].sort((a, b) => rank(a) - rank(b))
  let best = null
  for (let size = 1; size <= Math.min(4, candidates.length) && !best; size++) {
    for (const set of subsets(candidates, size)) {
      if (!agents.every((a) => a.skillDirs.some((d) => set.includes(d)))) continue
      const dupes = agents.reduce((n, a) => n + Math.max(0, a.skillDirs.filter((d) => set.includes(d)).length - 1), 0)
      const score = set.reduce((n, d) => n + rank(d), 0)
      if (!best || dupes < best.dupes || (dupes === best.dupes && score < best.score)) best = { set, dupes, score }
    }
  }
  const dirs = best ? [...best.set].sort((a, b) => rank(a) - rank(b)) : []
  const readers = {}
  const duplicates = []
  for (const id of ids) {
    const a = adapter(id)
    const read = a.skillDirs.filter((d) => dirs.includes(d))
    readers[a.id] = read[0] || null
    if (read.length > 1) duplicates.push({ agent: a.id, dirs: read })
  }
  return { dirs, duplicates, readers }
}
