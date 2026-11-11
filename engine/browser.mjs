/*
 * `audit --url`: checks a running page in the person's own Chrome with Lighthouse (performance, accessibility, best
 * practices, SEO) and a full axe-core pass (WCAG 2.0–2.2 A and AA tags). Neither tool is bundled (axe-core is MPL-2.0,
 * Lighthouse is large): after the person agrees (or --yes), pinned versions are installed once into a cache outside
 * the project (FRONTEND_SKILLS_CACHE, else ~/.cache/frontend-skills or %LOCALAPPDATA%\frontend-skills). Results are
 * mapped to dictionary ids through each rule's `axe` and `lighthouse` keys; anything unmapped keeps the tool's own id
 * (axe/<rule>, lighthouse/<audit>). No other network call is made.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { confirm, interactive } from '../cli/lib/io.mjs'

export const TOOLS = { lighthouse: '13.6.0', 'axe-core': '4.14.0' }
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const IMPACT = { critical: 'critical', serious: 'serious', moderate: 'moderate', minor: 'minor' }

export function cacheDir(env = process.env) {
  if (env.FRONTEND_SKILLS_CACHE) return path.resolve(env.FRONTEND_SKILLS_CACHE)
  if (process.platform === 'win32') return path.join(env.LOCALAPPDATA || path.join(homedir(), 'AppData', 'Local'), 'frontend-skills', 'browser-tools')
  return path.join(env.XDG_CACHE_HOME || path.join(homedir(), '.cache'), 'frontend-skills', 'browser-tools')
}

const pkgJson = (dir, name) => {
  try {
    return JSON.parse(readFileSync(path.join(dir, 'node_modules', ...name.split('/'), 'package.json'), 'utf8'))
  } catch {
    return null
  }
}

/** True when every pinned tool is in the cache at its pinned version. */
export const toolsReady = (dir) => Object.entries(TOOLS).every(([n, v]) => pkgJson(dir, n)?.version === v)

/** The ESM entry file of a package in the cache. */
function entryOf(dir, name, sub = '.') {
  const base = path.join(dir, 'node_modules', ...name.split('/'))
  const pkg = pkgJson(dir, name)
  let target = pkg?.exports?.[sub] ?? (sub === '.' ? pkg?.exports : undefined)
  while (target && typeof target === 'object') target = target.import ?? target.default ?? target.node
  if (typeof target !== 'string') target = sub === '.' ? pkg?.module || pkg?.main || 'index.js' : sub
  return pathToFileURL(path.join(base, target)).href
}

function npmCli() {
  if (process.env.npm_execpath && /npm-cli\.js$/.test(process.env.npm_execpath)) return process.env.npm_execpath
  const bin = path.dirname(process.execPath)
  for (const p of [path.join(bin, 'node_modules', 'npm', 'bin', 'npm-cli.js'), path.join(bin, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')]) if (existsSync(p)) return p
  return null
}

function install(dir, log) {
  const cli = npmCli()
  if (!cli) throw new Error('npm was not found next to this Node.js; install the tools by hand: npm install --prefix "' + dir + '" ' + Object.entries(TOOLS).map(([n, v]) => `${n}@${v}`).join(' '))
  mkdirSync(dir, { recursive: true })
  if (!existsSync(path.join(dir, 'package.json'))) writeFileSync(path.join(dir, 'package.json'), '{ "private": true }\n')
  log(`Installing ${Object.entries(TOOLS).map(([n, v]) => `${n}@${v}`).join(' and ')} into ${dir} …`)
  execFileSync(process.execPath, [cli, 'install', '--prefix', dir, '--no-audit', '--no-fund', '--save-exact', ...Object.entries(TOOLS).map(([n, v]) => `${n}@${v}`)], { stdio: ['ignore', 'ignore', 'inherit'] })
}

/** Maps a Lighthouse result (lhr) to findings and a short score summary. */
export function mapLighthouse(lhr, rules, url) {
  const byAudit = new Map()
  for (const r of rules) for (const id of r.lighthouse) byAudit.set(id, r)
  for (const r of rules) for (const id of r.axe) if (!byAudit.has(id)) byAudit.set(id, r)
  const findings = []
  for (const [id, audit] of Object.entries(lhr.audits || {})) {
    if (audit.score === null || audit.score === undefined || audit.score >= 0.9) continue
    if (['manual', 'notApplicable', 'informative'].includes(audit.scoreDisplayMode)) continue
    const rule = byAudit.get(id)
    const items = audit.details?.items || []
    const selectors = items.map((i) => i.node?.selector || i.url).filter(Boolean).slice(0, 5)
    findings.push({
      id: rule ? rule.id : `lighthouse/${id}`,
      severity: rule ? rule.severity : audit.score < 0.5 ? 'serious' : 'moderate',
      file: url,
      line: 0,
      message: `${audit.title}${audit.displayValue ? ` (${audit.displayValue})` : ''}${selectors.length ? `: ${selectors.join(', ')}` : ''}`,
      source: 'lighthouse'
    })
  }
  const scores = Object.fromEntries(Object.entries(lhr.categories || {}).map(([k, c]) => [k, c.score === null ? null : Math.round(c.score * 100)]))
  const metric = (id) => lhr.audits?.[id]?.displayValue || null
  return { findings, scores, metrics: { LCP: metric('largest-contentful-paint'), CLS: metric('cumulative-layout-shift'), TBT: metric('total-blocking-time'), FCP: metric('first-contentful-paint'), SI: metric('speed-index') } }
}

/** Maps axe-core results to findings (one per rule and page, with the first selectors). */
export function mapAxe(results, rules, url) {
  const byAxe = new Map()
  for (const r of rules) for (const id of r.axe) byAxe.set(id, r)
  return (results.violations || []).map((v) => {
    const rule = byAxe.get(v.id)
    const targets = v.nodes.map((n) => [].concat(n.target).join(' ')).slice(0, 5)
    return {
      id: rule ? rule.id : `axe/${v.id}`,
      severity: rule ? rule.severity : IMPACT[v.impact] || 'moderate',
      file: url,
      line: 0,
      message: `${v.help} (${v.nodes.length}×): ${targets.join(', ')}${rule ? '' : ` — ${v.helpUrl}`}`,
      source: 'axe-core'
    }
  })
}

/** Runs both tools on url. Returns { url, findings, scores, metrics } or { unavailable: reason }. */
export async function runBrowserAudit({ url, rules, yes = false, log = () => {}, env = process.env }) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return { unavailable: `"${url}" is not a URL (use for example http://localhost:5173/)` }
  }
  if (!/^https?:$/.test(parsed.protocol)) return { unavailable: 'only http and https pages can be audited' }
  const dir = cacheDir(env)
  if (!toolsReady(dir)) {
    const what = Object.entries(TOOLS).map(([n, v]) => `${n}@${v}`).join(' and ')
    const ok = yes || (interactive() && (await confirm(`The page audit needs ${what} (several tens of MB, fetched once from the npm registry into ${dir}). Fetch them now?`)))
    if (!ok) return { unavailable: `the page audit needs ${what}; run again with --yes to fetch them into ${dir}, or without --url for the static audit` }
    try {
      install(dir, log)
    } catch (err) {
      return { unavailable: `could not install the browser tools: ${err.message}` }
    }
  }
  const chromeLauncher = await import(entryOf(dir, 'chrome-launcher'))
  let chrome
  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check'] })
  } catch (err) {
    return { unavailable: `Chrome was not found or did not start (${err.message.split('\n')[0]}); install Google Chrome or set CHROME_PATH` }
  }
  try {
    log(`Lighthouse on ${url} …`)
    const lighthouse = (await import(entryOf(dir, 'lighthouse'))).default
    const lh = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] })
    const fromLh = mapLighthouse(lh.lhr, rules, url)
    log('axe-core …')
    const puppeteer = (await import(entryOf(dir, 'puppeteer-core'))).default
    const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` })
    let fromAxe = []
    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'load', timeout: 60000 })
      await page.addScriptTag({ path: path.join(dir, 'node_modules', 'axe-core', 'axe.min.js') })
      const results = await page.evaluate((tags) => globalThis.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS)
      fromAxe = mapAxe(results, rules, url)
      await page.close()
    } finally {
      await browser.disconnect()
    }
    const seen = new Set(fromAxe.map((f) => f.id))
    return { url, scores: fromLh.scores, metrics: fromLh.metrics, findings: [...fromAxe, ...fromLh.findings.filter((f) => !seen.has(f.id))] }
  } finally {
    await chrome.kill()
  }
}
