/*
 * `doctor [--json]`: checks the installation of this project: the profile and lessons exist, every file the record
 * lists is present and unchanged, and the files this version would write are current; lists duplicates and the
 * documented caveats of each agent. Exits 1 when something is missing or stale.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { adapter } from '../../adapters/index.mjs'
import { applyPlan, readRecord } from '../lib/install.mjs'
import { parseArgs, rootOf } from '../lib/io.mjs'
import { LESSONS, PROFILE, readProfile } from '../lib/profile.mjs'
import { makePlan } from '../lib/session.mjs'

export default async function doctor(argv) {
  const args = parseArgs(argv, ['json', 'help'])
  const out = (s) => process.stdout.write(`${s}\n`)
  if (args.help) {
    out('Usage: frontend-skills doctor [--json]')
    return 0
  }
  const root = rootOf(args)
  const problems = []
  const profile = readProfile(root)
  const record = readRecord(root)
  if (!profile) problems.push(`no ${PROFILE}: run init`)
  if (!existsSync(path.join(root, ...LESSONS.split('/')))) problems.push(`no ${LESSONS}: run init or learn`)
  if (!record) problems.push('no install record: run init')
  const report = { problems, agents: {} }
  if (profile && record) {
    const plan = makePlan(root, { profile, agents: record.agents, format: record.format || 'both' })
    const dry = applyPlan(root, plan, { dryRun: true })
    for (const id of record.agents) {
      const a = adapter(id)
      const mine = plan.ops.filter((o) => o.agents.includes(id) || o.agents.includes('support'))
      const missing = mine.filter((o) => dry.written.includes(o.path)).map((o) => o.path)
      const stale = mine.filter((o) => dry.updated.includes(o.path)).map((o) => o.path)
      const changed = mine.filter((o) => dry.kept.includes(o.path)).map((o) => o.path)
      report.agents[id] = { label: a.label, files: mine.length, missing, stale, changed, notes: a.notes }
      if (missing.length) problems.push(`${a.label}: ${missing.length} file(s) missing, for example ${missing[0]}`)
      if (stale.length) problems.push(`${a.label}: ${stale.length} file(s) out of date (run update), for example ${stale[0]}`)
    }
    report.duplicates = plan.duplicates
  }
  if (args.json) out(JSON.stringify(report))
  else {
    for (const a of Object.values(report.agents)) {
      const state = a.missing.length || a.stale.length ? 'needs attention' : 'ok'
      out(`${a.label.padEnd(22)} ${state}: ${a.files} files${a.changed.length ? `, ${a.changed.length} changed by you (kept)` : ''}`)
      for (const n of a.notes) out(`  note: ${n}`)
    }
    for (const d of report.duplicates || []) out(`Duplicate: ${adapter(d.agent).label} reads ${d.dirs.join(' and ')}.`)
    for (const p of problems) out(`Problem: ${p}`)
    if (!problems.length) out('Everything is installed and current.')
  }
  return problems.length ? 1 : 0
}
