/*
 * `uninstall [--dry-run] [--yes]`: removes every file and block the install record lists. A file changed by a person
 * since it was written is kept and listed; folders the tool created are removed when empty. The profile and the
 * lessons stay (they are the project's data); delete .frontend-skills/ by hand to remove them too.
 */
import { readRecord, uninstall } from '../lib/install.mjs'
import { confirm, interactive, parseArgs, rootOf, UsageError } from '../lib/io.mjs'

export default async function uninstallCommand(argv) {
  const args = parseArgs(argv, ['dry-run', 'yes', 'help'])
  const out = (s) => process.stdout.write(`${s}\n`)
  if (args.help) {
    out('Usage: frontend-skills uninstall [--dry-run] [--yes]')
    return 0
  }
  const root = rootOf(args)
  const record = readRecord(root)
  if (!record) {
    out('Nothing to remove: no install record in this project.')
    return 0
  }
  const plan = uninstall(root, { dryRun: true })
  out(`Will remove ${plan.removed.length} files or blocks${plan.kept.length ? `; ${plan.kept.length} changed by you will be kept` : ''}.`)
  for (const p of plan.removed.slice(0, 40)) out(`  ${p}`)
  for (const p of plan.kept) out(`  kept: ${p}`)
  if (args['dry-run']) return 0
  if (!args.yes && !(interactive() && (await confirm('Remove them?')))) throw new UsageError('nothing removed: confirm, or pass --yes')
  const res = uninstall(root)
  out(`Removed ${res.removed.length}${res.kept.length ? `, kept ${res.kept.length}` : ''}. The profile and lessons in .frontend-skills/ were left in place.`)
  return 0
}
