/*
 * `tokens [--all] [--json]`: the estimated token cost of what is installed in this project (or, with --all, of every
 * skill in the package): what each agent always loads (the names and descriptions of the skills in the folders it
 * reads, the instruction block, always-on rule files) and what it loads on use (a skill body, each reference, each
 * glob-scoped rule file). Numbers come from cli/lib/tokens.mjs and are estimates; docs/tokens.md has the method.
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { adapter } from '../../adapters/index.mjs'
import { loadSkills } from '../lib/catalog.mjs'
import { readBlock } from '../lib/blocks.mjs'
import { parseFrontMatter } from '../lib/frontmatter.mjs'
import { readRecord } from '../lib/install.mjs'
import { parseArgs, rootOf } from '../lib/io.mjs'
import { readProfile } from '../lib/profile.mjs'
import { makePlan } from '../lib/session.mjs'
import { ESTIMATOR, estimateTokens } from '../lib/tokens.mjs'

/** Tokens an agent pays for one skill in its list: the name and the description. */
export const listingTokens = (text) => {
  const { data } = parseFrontMatter(text)
  return estimateTokens(`${data?.name || ''}: ${data?.description || ''}`)
}

const refsOf = (dir) => {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ file: f, tokens: estimateTokens(readFileSync(path.join(dir, f), 'utf8')) }))
  } catch {
    return []
  }
}

/** Cost of every skill in the package. */
export function packageCost() {
  return loadSkills().map((s) => ({
    name: s.name,
    listing: listingTokens(s.text),
    body: estimateTokens(s.text),
    references: refsOf(path.join(s.dir, 'references'))
  }))
}

/** Cost of what is installed in a project, per agent. Null without an install record. */
export function projectCost(root) {
  const record = readRecord(root)
  const profile = readProfile(root)
  if (!record || !profile) return null
  const plan = makePlan(root, { profile, agents: record.agents, format: record.format || 'both' })
  const read = (p) => {
    try {
      return readFileSync(path.join(root, ...p.split('/')), 'utf8')
    } catch {
      return ''
    }
  }
  const agents = {}
  for (const id of record.agents) {
    const a = adapter(id)
    const ops = plan.ops.filter((o) => o.agents.includes(id))
    const skills = ops.filter((o) => o.what === 'skill' && o.path.endsWith('/SKILL.md'))
    const listing = skills.reduce((n, o) => n + listingTokens(read(o.path) || o.text), 0)
    const blocks = ops.filter((o) => o.what === 'instructions')
    const block = blocks.reduce((n, o) => n + estimateTokens(readBlock(read(o.path)) || ''), 0)
    const rules = ops.filter((o) => o.what === 'rule').map((o) => ({ path: o.path, tokens: estimateTokens(read(o.path) || o.text) }))
    agents[id] = { label: a.label, alwaysLoaded: listing + block, listing, block, skills: skills.length, rules }
  }
  return {
    agents,
    skills: [...new Set(plan.ops.filter((o) => o.what === 'skill' && o.path.endsWith('/SKILL.md')).map((o) => o.path))].map((p) => ({
      path: p,
      body: estimateTokens(read(p))
    }))
  }
}

export default async function tokens(argv) {
  const args = parseArgs(argv, ['all', 'json', 'help'])
  const out = (s) => process.stdout.write(`${s}\n`)
  if (args.help) {
    out('Usage: frontend-skills tokens [--all] [--json]')
    return 0
  }
  const root = rootOf(args)
  const project = args.all ? null : projectCost(root)
  if (!project) {
    const skills = packageCost()
    if (args.json) out(JSON.stringify({ estimator: ESTIMATOR, skills }))
    else {
      if (!args.all) out('No install record in this project; showing every skill in the package.')
      out(`Token estimates (${ESTIMATOR}). Listing = always loaded per skill; body = loaded when the skill is used.`)
      for (const s of skills)
        out(
          `  ${s.name.padEnd(24)} listing ~${String(s.listing).padStart(3)}  body ~${String(s.body).padStart(5)}  ${s.references.map((r) => `${r.file} ~${r.tokens}`).join(', ')}`
        )
      out(`  ${'all skills'.padEnd(24)} listing ~${skills.reduce((n, s) => n + s.listing, 0)}`)
    }
    return 0
  }
  if (args.json) {
    out(JSON.stringify({ estimator: ESTIMATOR, ...project }))
    return 0
  }
  out(`Token estimates (${ESTIMATOR}).`)
  for (const a of Object.values(project.agents)) {
    const rule = a.rules.length
      ? `; a glob rule file ~${Math.round(a.rules.reduce((n, r) => n + r.tokens, 0) / a.rules.length)} when a matching file is open`
      : ''
    out(`  ${a.label.padEnd(22)} always ~${a.alwaysLoaded} (${a.skills} skills listed ~${a.listing}, instruction block ~${a.block})${rule}`)
  }
  out('On use:')
  for (const s of project.skills) out(`  ${s.path.padEnd(52)} ~${s.body}`)
  return 0
}
