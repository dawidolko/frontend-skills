/*
 * `learn [--lesson "<text>" --kind convention|command|pitfall] [--yes] [--dry-run]`: re-detects the stack and the
 * project helpers, shows what changed, then updates the profile and re-installs the skills for the recorded agents
 * (keeping the person's audit settings and helpers marked "person"). With --lesson, records one confirmed lesson.
 */
import { applyPlan, readRecord } from '../lib/install.mjs'
import { confirm, interactive, parseArgs, rootOf, today, UsageError, version } from '../lib/io.mjs'
import { addLesson, ensureLessons, LESSON_KINDS, profileDiff, writeProfile } from '../lib/profile.mjs'
import { describeProfile, detectProject, makePlan, showPlan } from '../lib/session.mjs'

const HELP = `Usage: frontend-skills learn [options]

  (no options)          refresh the profile and the installed skills after the stack changed
  --lesson "<text>"     record a confirmed lesson (one line, no secrets)
  --kind <kind>         ${LESSON_KINDS.join(' | ')} (with --lesson; default convention)
  --dry-run             show the changes, write nothing
  --yes, -y             apply without asking
`

export default async function learn(argv) {
  const args = parseArgs(argv, ['yes', 'dry-run', 'help'])
  if (args.help) {
    process.stdout.write(HELP)
    return 0
  }
  const out = (s) => process.stdout.write(`${s}\n`)
  const root = rootOf(args)
  const ask = async (q) => args.yes || (interactive() && (await confirm(q)))

  if (args.lesson !== undefined) {
    if (typeof args.lesson !== 'string') throw new UsageError('--lesson needs the text of the lesson')
    const kind = typeof args.kind === 'string' ? args.kind : 'convention'
    out(`Lesson (${kind}): ${args.lesson}`)
    if (args['dry-run']) return 0
    if (!(await ask('Record this lesson in .frontend-skills/lessons.md?'))) throw new UsageError('not recorded: confirm, or pass --yes')
    const r = addLesson(root, { text: args.lesson, kind, today: today() })
    if (r.problem) throw new UsageError(`not recorded: ${r.problem}`)
    out(r.added ? 'Recorded. Every skill reads it first.' : 'Already recorded.')
    return 0
  }

  const record = readRecord(root)
  const agents = record?.agents || []
  const { profile, previous, skills } = detectProject(root, agents)
  const diff = profileDiff(previous, profile)
  out('Stack:')
  for (const l of describeProfile(profile)) out(l)
  out(diff.length ? `Changes: ${diff.join('; ')}` : 'No change in the stack.')
  const plan = agents.length ? makePlan(root, { profile, agents, format: record.format || 'both' }) : null
  if (plan) showPlan(root, plan, { agents, skills, out })
  else out('No install record: run init to install skills for your agents.')
  if (args['dry-run']) return 0
  if (!(await ask('Update the profile and the installed files?'))) throw new UsageError('nothing written: confirm, or pass --yes')
  writeProfile(root, profile)
  ensureLessons(root)
  if (plan) {
    const res = applyPlan(root, plan, {
      meta: { ...record, files: undefined, tool: `frontend-skills ${version()}`, skills: skills.map((s) => s.name), updated: today() }
    })
    out(`Written ${res.written.length}, updated ${res.updated.length}, removed ${res.removed.length}, kept ${res.kept.length}.`)
  }
  return 0
}
