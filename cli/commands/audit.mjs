/*
 * `audit [path] [--url <address>] [--json] [--changed] [--base <ref>] [--fail-on <level>] [--report <file>]
 * [--no-report]`: runs the static rules on the project's source (and with --url the browser checks on a running
 * page), writes frontend-report.md, prints a short summary or, with --json, the condensed JSON for agents, and exits
 * 1 when a finding is at or above the threshold. Also exported as runProjectAudit() for `init`.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { buildDirs, listFiles } from '../../engine/files.mjs'
import { runAudit } from '../../engine/index.mjs'
import { loadRules, loadSkills, SEVERITIES } from '../lib/catalog.mjs'
import { detectHelpers } from '../lib/conventions.mjs'
import { detectStack } from '../lib/detect.mjs'
import { parseArgs, rootOf, today, UsageError } from '../lib/io.mjs'
import { matchSkills, readProfile } from '../lib/profile.mjs'
import { toJson, toMarkdown, toSummary } from '../lib/report.mjs'

const HELP = `Usage: frontend-skills audit [path] [options]

  --url <address>     also check a running page (Lighthouse and axe-core in your Chrome; asks before fetching them)
  --changed           only files changed against --base (default HEAD), staged, unstaged or new
  --base <ref>        the git ref for --changed
  --fail-on <level>   critical | serious | moderate | minor | none (default: profile audit.failOn or serious)
  --json              print the condensed JSON for agents instead of the summary
  --report <file>     where to write the Markdown report (default frontend-report.md)
  --no-report         do not write the report
  --yes               fetch the browser tools without asking (with --url)
`

function buildSummary(root) {
  const out = []
  for (const dir of buildDirs(root)) {
    const walk = (abs, rel, depth) => {
      if (depth > 6) return
      for (const e of readdirSync(abs, { withFileTypes: true })) {
        const r = `${rel}/${e.name}`
        if (e.isDirectory()) walk(path.join(abs, e.name), r, depth + 1)
        else if (/\.(m?js|css)$/.test(e.name)) {
          const size = statSync(path.join(abs, e.name)).size
          if (size > 1000) out.push({ file: r, size, gzip: size > 5e6 ? 0 : gzipSync(readFileSync(path.join(abs, e.name))).length })
        }
      }
    }
    walk(path.join(root, ...dir.split('/')), dir, 0)
  }
  return out.sort((a, b) => b.gzip - a.gzip).slice(0, 10)
}

/** Runs the audit for a project and returns everything the outputs need. */
export async function runProjectAudit(root, { scope = null, changed = false, base, failOn, url = null, yes = false, log = () => {} } = {}) {
  const profile = readProfile(root)
  const stack = new Set(profile?.stack || detectStack(root).stack)
  const helpers = profile?.helpers || detectHelpers(root)
  const rules = loadRules()
  let files
  if (scope) {
    const prefix = scope.replace(/\\/g, '/').replace(/^\.\/?/, '').replace(/\/$/, '')
    files = listFiles(root).filter((f) => !prefix || f.path === prefix || f.path.startsWith(`${prefix}/`))
  }
  const result = await runAudit({ root, rules, profile: { ...(profile || {}), helpers }, stack, changed, base, files })
  let browser = null
  if (url) {
    const { runBrowserAudit } = await import('../../engine/browser.mjs')
    browser = await runBrowserAudit({ url, rules, yes, log })
    result.findings.push(...browser.findings)
  }
  const installed = new Set(profile?.skills || matchSkills(loadSkills(), [...stack]).map((s) => s.name))
  const manual = rules.filter((r) => r.check === 'manual' && r.status === 'active' && installed.has(r.skill) && (r.stack.length === 0 || r.stack.some((s) => stack.has(s))))
  const effectiveFailOn = failOn || profile?.audit?.failOn || 'serious'
  if (![...SEVERITIES, 'none'].includes(effectiveFailOn)) throw new UsageError(`--fail-on must be one of ${SEVERITIES.join(', ')}, none`)
  return { ...result, rulesRun: result.rules, rules, helpers, manual, browser, build: buildSummary(root), failOn: effectiveFailOn }
}

export default async function audit(argv) {
  const args = parseArgs(argv, ['json', 'changed', 'yes', 'help'])
  if (args.help) {
    process.stdout.write(HELP)
    return 0
  }
  const root = rootOf(args)
  const log = args.json ? () => {} : (s) => process.stderr.write(`${s}\n`)
  const res = await runProjectAudit(root, {
    scope: args._[0] || null,
    changed: !!args.changed,
    base: typeof args.base === 'string' ? args.base : undefined,
    failOn: typeof args['fail-on'] === 'string' ? args['fail-on'] : undefined,
    url: typeof args.url === 'string' ? args.url : null,
    yes: !!args.yes,
    log
  })
  if (res.browser?.unavailable) {
    process.stderr.write(`frontend-skills: ${res.browser.unavailable}\n`)
    return 3
  }
  const stats = { files: res.files, rules: res.rulesRun, changedOnly: res.changedOnly }
  let reportPath = null
  if (args.report !== false) {
    reportPath = typeof args.report === 'string' ? args.report : 'frontend-report.md'
    const md = toMarkdown({ findings: res.findings, rules: res.rules, failOn: res.failOn, root: path.basename(root), date: today(), stats, manual: res.manual, browser: res.browser, build: res.build, helpers: res.helpers })
    writeFileSync(path.resolve(root, reportPath), md)
  }
  if (args.json) process.stdout.write(`${JSON.stringify(toJson({ findings: res.findings, rules: res.rules, failOn: res.failOn, helpers: res.helpers, extra: reportPath ? { report: reportPath } : {} }))}\n`)
  else process.stdout.write(`${toSummary({ findings: res.findings, failOn: res.failOn, reportPath, stats })}\n`)
  return toJson({ findings: res.findings, rules: res.rules, failOn: res.failOn }).failed ? 1 : 0
}
