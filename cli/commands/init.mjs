/*
 * `init [--agents a,b] [--format both|skills|rules] [--yes] [--dry-run] [--no-audit]`: detects the stack, the project
 * helpers and the coding agents, shows what it will write, asks (or takes --yes), writes the profile, the lessons
 * file and each agent's files, records them for uninstall, then runs the first audit. Never overwrites a file a
 * person wrote; shared instruction files get a marked block only.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { ADAPTERS, resolveAgents } from '../../adapters/index.mjs'
import { detectAgents } from '../lib/detect.mjs'
import { applyPlan, FORMATS } from '../lib/install.mjs'
import { choose, confirm, interactive, list, parseArgs, rootOf, today, UsageError, version } from '../lib/io.mjs'
import { ensureLessons, writeProfile } from '../lib/profile.mjs'
import { toMarkdown, toSummary } from '../lib/report.mjs'
import { describeProfile, detectProject, makePlan, showPlan } from '../lib/session.mjs'
import { runProjectAudit } from './audit.mjs'

const HELP = `Usage: frontend-skills init [options]

  --agents <ids>     comma-separated: ${ADAPTERS.map((a) => a.id).join(', ')} (windsurf = devin)
  --format <f>       both (default: skills plus glob-scoped rule files), skills, rules
  --dry-run          show the plan and write nothing
  --yes, -y          write without asking (for scripts)
  --no-audit         skip the first audit
`

export default async function init(argv) {
  const args = parseArgs(argv, ['yes', 'dry-run', 'help'])
  if (args.help) {
    process.stdout.write(HELP)
    return 0
  }
  const out = (s) => process.stdout.write(`${s}\n`)
  const root = rootOf(args)
  const format = typeof args.format === 'string' ? args.format : 'both'
  if (!FORMATS.includes(format)) throw new UsageError(`--format must be one of ${FORMATS.join(', ')}`)

  let agents
  if (typeof args.agents === 'string') {
    const r = resolveAgents(list(args.agents))
    if (r.unknown.length) throw new UsageError(`unknown agent(s): ${r.unknown.join(', ')}. Known: ${ADAPTERS.map((a) => a.id).join(', ')}`)
    agents = r.ids
  } else {
    agents = detectAgents(root, ADAPTERS)
    if (agents.length) out(`Coding agents found in this project: ${agents.join(', ')} (use --agents to choose others).`)
  }
  if (!agents.length) {
    if (!interactive())
      throw new UsageError(
        `no coding agent found in this project; pass --agents, for example --agents claude,cursor (known: ${ADAPTERS.map((a) => a.id).join(', ')})`
      )
    agents = await choose(
      'No coding agent files found. Which agents do you use?',
      ADAPTERS.map((a) => ({ label: `${a.label} (${a.id})`, value: a.id }))
    )
    if (!agents.length) throw new UsageError('no agent chosen')
  }

  const { profile, skills } = detectProject(root, agents)
  out(`Stack (frontend-skills ${version()}):`)
  for (const l of describeProfile(profile)) out(l)
  const plan = makePlan(root, { profile, agents, format })
  out('')
  showPlan(root, plan, { agents, skills, out })
  out(`Also: ${'.frontend-skills/profile.json'}, ${'.frontend-skills/lessons.md'}, ${'.frontend-skills/install.json'}`)

  if (args['dry-run']) {
    out('\nDry run: nothing was written.')
    return 0
  }
  if (!args.yes) {
    if (!interactive()) throw new UsageError('nothing written: pass --yes to write without a prompt, or --dry-run to only see the plan')
    if (!(await confirm('\nWrite these files?'))) {
      out('Nothing was written.')
      return 0
    }
  }
  writeProfile(root, profile)
  ensureLessons(root)
  const res = applyPlan(root, plan, { meta: { tool: `frontend-skills ${version()}`, agents, format, skills: skills.map((s) => s.name), updated: today() } })
  out(
    `\nWritten ${res.written.length}, updated ${res.updated.length}, unchanged ${res.unchanged.length}${res.conflicts.length ? `, not written ${res.conflicts.length} (your files)` : ''}${res.kept.length ? `, kept ${res.kept.length} (changed by you)` : ''}.`
  )
  out('Undo everything with: npx github:dawidolko/frontend-skills uninstall')

  if (args.audit === false) return 0
  out('\nFirst audit:')
  const a = await runProjectAudit(root, {})
  const stats = { files: a.files, rules: a.rulesRun, changedOnly: null }
  writeFileSync(
    path.join(root, 'frontend-report.md'),
    toMarkdown({
      findings: a.findings,
      rules: a.rules,
      failOn: a.failOn,
      root: path.basename(root),
      date: today(),
      stats,
      manual: a.manual,
      build: a.build,
      helpers: a.helpers
    })
  )
  out(toSummary({ findings: a.findings, failOn: a.failOn, reportPath: 'frontend-report.md', stats }))
  return 0
}
