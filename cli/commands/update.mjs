/*
 * `update [--dry-run]`: re-installs the recorded agents, format and skills from this version of the package. Files
 * changed by a person since they were written are kept and listed; the profile's detection is not redone (that is
 * `learn`).
 */
import { applyPlan, readRecord } from '../lib/install.mjs'
import { parseArgs, rootOf, today, UsageError, version } from '../lib/io.mjs'
import { readProfile } from '../lib/profile.mjs'
import { makePlan, showPlan, skillsOf } from '../lib/session.mjs'

export default async function update(argv) {
  const args = parseArgs(argv, ['dry-run', 'help'])
  const out = (s) => process.stdout.write(`${s}\n`)
  if (args.help) {
    out('Usage: frontend-skills update [--dry-run]')
    return 0
  }
  const root = rootOf(args)
  const record = readRecord(root)
  const profile = readProfile(root)
  if (!record || !profile) throw new UsageError('nothing to update: run init first')
  const plan = makePlan(root, { profile, agents: record.agents, format: record.format || 'both' })
  showPlan(root, plan, { agents: record.agents, skills: skillsOf(profile), out })
  if (args['dry-run']) return 0
  const res = applyPlan(root, plan, { meta: { ...record, files: undefined, tool: `frontend-skills ${version()}`, updated: today() } })
  out(`Updated ${res.updated.length}, new ${res.written.length}, removed ${res.removed.length}, kept ${res.kept.length} (changed by you).`)
  return 0
}
