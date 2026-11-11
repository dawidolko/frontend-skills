/*
 * `list [--all] [--rules] [--json]`: the skills that match this project's stack with their estimated token cost, or
 * every skill (--all), or the rule dictionary (--rules).
 */
import { loadRules, loadSkills } from '../lib/catalog.mjs'
import { detectStack } from '../lib/detect.mjs'
import { parseArgs, rootOf } from '../lib/io.mjs'
import { matchSkills, readProfile } from '../lib/profile.mjs'
import { estimateTokens } from '../lib/tokens.mjs'

export default async function list(argv) {
  const args = parseArgs(argv, ['all', 'rules', 'json', 'help'])
  const out = (s) => process.stdout.write(`${s}\n`)
  if (args.help) {
    out('Usage: frontend-skills list [--all] [--rules] [--json]')
    return 0
  }
  if (args.rules) {
    const rules = loadRules().filter((r) => args.all || r.status === 'active')
    if (args.json)
      out(JSON.stringify(rules.map((r) => ({ id: r.id, severity: r.severity, check: r.check, title: r.title, skill: r.skill, requires: r.requires }))))
    else for (const r of rules) out(`${r.id.padEnd(34)} ${r.severity.padEnd(9)} ${r.check.padEnd(7)} ${r.title}`)
    return 0
  }
  const root = rootOf(args)
  const stack = readProfile(root)?.stack || detectStack(root).stack
  const all = loadSkills()
  const matched = new Set(matchSkills(all, stack).map((s) => s.name))
  const shown = args.all ? all : all.filter((s) => matched.has(s.name))
  if (args.json) {
    out(
      JSON.stringify(
        shown.map((s) => ({
          name: s.name,
          area: s.area,
          title: s.title,
          matches: matched.has(s.name),
          tokens: estimateTokens(s.text),
          description: s.description
        }))
      )
    )
    return 0
  }
  out(`Stack: ${stack.join(', ')}`)
  for (const s of shown)
    out(`${matched.has(s.name) ? '✓' : ' '} ${s.name.padEnd(24)} ${s.area.padEnd(14)} ~${String(estimateTokens(s.text)).padStart(5)} tokens  ${s.title}`)
  if (!args.all) out(`${all.length - shown.length} more skills do not match this stack (--all).`)
  return 0
}
