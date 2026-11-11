/*
 * `explain <rule id> [--json]`: prints a rule from the dictionary (title, severity, check kind, WCAG criteria, why,
 * fix, examples, sources, owning skill). Inside a project, placeholders name the project's own helpers. A deprecated
 * id is followed to the rule that replaced it.
 */
import { findRule, loadRules } from '../lib/catalog.mjs'
import { fillHelpers } from '../lib/conventions.mjs'
import { parseArgs, rootOf, UsageError } from '../lib/io.mjs'
import { readProfile } from '../lib/profile.mjs'

export default async function explain(argv) {
  const args = parseArgs(argv, ['json', 'help'])
  const out = (s) => process.stdout.write(`${s}\n`)
  const id = args._[0]
  if (args.help || !id) {
    if (!id && !args.help) throw new UsageError('name a rule id, for example: explain a11y/img-alt (list them with: list --rules)')
    out('Usage: frontend-skills explain <rule id> [--json]')
    return 0
  }
  const rules = loadRules()
  const found = findRule(rules, id)
  if (!found) {
    const near = rules.filter((r) => r.id.includes(id.split('/').pop())).map((r) => r.id)
    throw new UsageError(`no rule "${id}"${near.length ? `; did you mean ${near.slice(0, 5).join(', ')}?` : ''}`)
  }
  const r = found.rule
  const fill = (t) => fillHelpers(t, readProfile(rootOf(args))?.helpers || {})
  if (args.json) {
    out(
      JSON.stringify({
        id: r.id,
        via: found.via,
        title: fill(r.title),
        severity: r.severity,
        check: r.check,
        wcag: r.wcag,
        level: r.level,
        requires: r.requires,
        why: fill(r.why),
        fix: fill(r.fix),
        sources: r.sources,
        skill: r.skill
      })
    )
    return 0
  }
  if (found.via.length) out(`${found.via.join(' -> ')} was replaced by ${r.id}.\n`)
  out(`${r.id}  (${r.severity}, ${r.check}${r.wcag.length ? `, WCAG ${r.wcag.join(', ')}${r.level ? ` level ${r.level}` : ''}` : ''})`)
  out(fill(r.title))
  out(`\nWhy\n${fill(r.why)}`)
  out(`\nFix\n${fill(r.fix)}`)
  if (r.examples) out(`\nExamples\n${r.examples}`)
  out(`\nSources\n${r.sources.map((s) => `- ${s.title}: ${s.url}`).join('\n')}`)
  if (r.requires.length) out(`\nRuns only in projects with: ${r.requires.join(', ')}`)
  out(`\nTaught by the skill ${r.skill}.`)
  return 0
}
