/*
 * Turns audit findings into the three outputs of `audit`: the short terminal summary, frontend-report.md (grouped by
 * severity, then rule, with why, sources, fix and every location) and the condensed JSON for agents (one entry per
 * rule, locations as file:line). Also decides the exit code from the severity threshold.
 */
import { SEVERITIES } from './catalog.mjs'
import { fillHelpers } from './conventions.mjs'

/** A finding's location: file:line, or the page address (with its selector) for browser findings. */
export const loc = (f) => (f.line ? `${f.file}:${f.line}` : f.file)

export const failsAt = (severity, failOn) => failOn !== 'none' && SEVERITIES.indexOf(severity) <= SEVERITIES.indexOf(failOn)

/** Counts per severity and whether the threshold is reached. */
export function summarize(findings, failOn) {
  const counts = Object.fromEntries(SEVERITIES.map((s) => [s, 0]))
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1
  return { counts, failed: findings.some((f) => failsAt(f.severity, failOn)) }
}

function groupByRule(findings) {
  const map = new Map()
  for (const f of findings) {
    if (!map.has(f.id)) map.set(f.id, { id: f.id, severity: f.severity, items: [] })
    map.get(f.id).items.push(f)
  }
  return [...map.values()]
}

const firstSentence = (text) => {
  const plain = text.replace(/`/g, '').replace(/\s+/g, ' ').trim()
  const m = /^(.+?[.!?])(\s|$)/.exec(plain)
  return (m ? m[1] : plain).slice(0, 240)
}

/** The condensed JSON for agents. */
export function toJson({ findings, rules, failOn, helpers = {}, extra = {} }) {
  const byId = new Map(rules.map((r) => [r.id, r]))
  const { counts, failed } = summarize(findings, failOn)
  const out = { v: 1, failOn, failed, counts, rules: {} }
  for (const g of groupByRule(findings)) {
    const r = byId.get(g.id)
    out.rules[g.id] = { s: g.severity, fix: r ? firstSentence(fillHelpers(r.fix, helpers)) : g.items[0].message, at: g.items.map(loc) }
  }
  return { ...out, ...extra }
}

/** The Markdown report. */
export function toMarkdown({ findings, rules, failOn, root, date, stats, manual = [], browser = null, build = null, helpers = {} }) {
  const byId = new Map(rules.map((r) => [r.id, r]))
  const { counts, failed } = summarize(findings, failOn)
  const L = []
  L.push('# Front-end report', '')
  L.push(`Project: \`${root}\` · ${date} · ${stats.files} files read, ${stats.rules} static rules run${stats.changedOnly !== null ? ` (changed files only)` : ''}${browser ? ` · page: ${browser.url}` : ''}.`, '')
  L.push(`| critical | serious | moderate | minor |`, `| ---: | ---: | ---: | ---: |`, `| ${counts.critical} | ${counts.serious} | ${counts.moderate} | ${counts.minor} |`, '')
  L.push(failed ? `**Result: findings at \`${failOn}\` or above.**` : `Result: nothing at \`${failOn}\` or above.`, '')
  L.push('Automated checks find only part of the problems; the checklist at the end needs a person.', '')
  if (browser?.scores) {
    L.push(`Page \`${browser.url}\`: Lighthouse ${Object.entries(browser.scores).map(([k, v]) => `${k} ${v ?? '–'}`).join(', ')}.`)
    L.push(`Lab metrics (one run, not field data): ${Object.entries(browser.metrics).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ')}.`, '')
  }
  for (const sev of SEVERITIES) {
    const groups = groupByRule(findings.filter((f) => f.severity === sev))
    if (!groups.length) continue
    L.push(`## ${sev[0].toUpperCase()}${sev.slice(1)}`, '')
    for (const g of groups) {
      const r = byId.get(g.id)
      L.push(`### \`${g.id}\` ${r ? fillHelpers(r.title, helpers) : ''}`.trim(), '')
      if (r?.why) L.push(`Why: ${firstSentence(r.why)}`, '')
      if (r?.fix) L.push(`Fix: ${fillHelpers(r.fix, helpers).replace(/\n+/g, ' ')}`, '')
      if (r?.sources.length) L.push(`Sources: ${r.sources.map((s) => `[${s.title}](${s.url})`).join(' · ')}`, '')
      const shown = g.items.slice(0, 50)
      for (const f of shown) L.push(`- \`${loc(f)}\`${f.message && f.message !== r?.title ? ` ${f.message}` : ''}`)
      if (g.items.length > shown.length) L.push(`- … and ${g.items.length - shown.length} more (see \`--json\`)`)
      L.push('')
    }
  }
  if (build?.length) {
    L.push('## Build output', '', '| File | Size | Gzip |', '| --- | ---: | ---: |')
    for (const b of build) L.push(`| \`${b.file}\` | ${Math.round(b.size / 1000)} KB | ${Math.round(b.gzip / 1000)} KB |`)
    L.push('')
  }
  if (!browser) L.push('## Not checked', '', 'Rules that need a rendered page (contrast, names computed through components, Lighthouse metrics) were not run. Start the app and run `audit --url <address>`.', '')
  if (manual.length) {
    L.push('## Checklist for a person', '')
    for (const r of manual) L.push(`- [ ] \`${r.id}\` ${r.title}`)
    L.push('')
  }
  L.push('Explain any rule: `npx github:dawidolko/frontend-skills explain <rule id>`.', '')
  return L.join('\n')
}

/** The terminal summary: a few lines. */
export function toSummary({ findings, failOn, reportPath, stats }) {
  const { counts, failed } = summarize(findings, failOn)
  const L = [`${stats.files} files, ${stats.rules} rules: ${counts.critical} critical, ${counts.serious} serious, ${counts.moderate} moderate, ${counts.minor} minor.`]
  const top = groupByRule(findings).slice(0, 5)
  for (const g of top) L.push(`  ${g.severity.padEnd(8)} ${g.id}  ${g.items.length}× (first: ${loc(g.items[0])})`)
  if (reportPath) L.push(`Report: ${reportPath}`)
  if (top.length) L.push(`Explain a rule: frontend-skills explain ${top[0].id}`)
  L.push(failed ? `Failed: findings at ${failOn} or above.` : `Passed: nothing at ${failOn} or above.`)
  return L.join('\n')
}
