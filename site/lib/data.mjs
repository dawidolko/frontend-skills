/*
 * Gathers everything the site shows from the repository itself, so no number or example on a page is typed by hand:
 * the rules and skills (through the command's own catalog loader), the coding agents with the folders they are
 * detected by, the files the installer would write for each agent (through the installer's own planner, on the
 * example project), the token cost of every skill (through the command's own estimator), the real output and
 * Markdown report of `audit` on the example project, the real `--help` text of every command, and the terminal
 * recordings made by tools/record.mjs in docs/media.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { ADAPTERS } from '../../adapters/index.mjs'
import { CHECK_KINDS, RULE_AREAS, SEVERITIES, SKILL_AREAS, loadRules, loadSkills, sections } from '../../cli/lib/catalog.mjs'
import { planInstall } from '../../cli/lib/install.mjs'
import { detectProject } from '../../cli/lib/session.mjs'
import { ESTIMATOR, estimateTokens } from '../../cli/lib/tokens.mjs'
import { listingTokens } from '../../cli/commands/tokens.mjs'

export const REPO = 'https://github.com/dawidolko/frontend-skills'
export const BLOB = `${REPO}/blob/main`
export const PKG = 'github:dawidolko/frontend-skills'
export const START = `npx ${PKG} init`
export const EXAMPLE_PROJECT = 'fixtures/projects/react-vite'

/* Package runners. "tested" says how the runner was checked; untested runners are shown with a note. */
export const RUNNERS = [
  { id: 'npx', label: 'npx', command: (args) => `npx ${PKG} ${args}`, tested: true },
  { id: 'pnpm', label: 'pnpm dlx', command: (args) => `pnpm dlx ${PKG} ${args}`, tested: true },
  { id: 'yarn', label: 'yarn dlx', command: (args) => `yarn dlx -p ${PKG} frontend-skills ${args}`, tested: false },
  { id: 'bun', label: 'bunx', command: (args) => `bunx ${PKG} ${args}`, tested: false }
]

/* The order of the dictionary's chapters, most used first; areas not listed follow in catalog order. */
const CHAPTER_ORDER = ['a11y', 'perf', 'html', 'css', 'responsive', 'js', 'ts', 'react', 'next', 'vue', 'nuxt', 'angular', 'svelte', 'astro', 'webc', 'tailwind', 'sass', 'state', 'seo', 'i18n', 'security', 'test', 'tooling']

export const AREA_ICON = {
  a11y: 'a11y', perf: 'perf', html: 'html', css: 'css', responsive: 'responsive', js: 'js', ts: 'ts', seo: 'seo', i18n: 'i18n',
  security: 'security', test: 'test', tooling: 'tooling', state: 'state', tailwind: 'css', sass: 'css'
}
export const SKILL_AREA_ICON = { foundations: 'foundations', styling: 'styling', frameworks: 'framework', accessibility: 'a11y', performance: 'perf', quality: 'quality', workflow: 'workflow' }
export const areaIcon = (a) => AREA_ICON[a] || 'framework'

const COMMAND_ORDER = ['init', 'audit', 'learn', 'list', 'explain', 'doctor', 'update', 'uninstall', 'tokens']

/* Fills {{helper.field|fallback}} placeholders with their fallback, as `explain` does outside a project. */
export const fallback = (s) => String(s ?? '').replace(/\{\{[^|}]+\|([^}]*)\}\}/g, '$1').replace(/\{\{[^}]+\}\}/g, '…')

function runCli(root, args, cwd = root) {
  const r = spawnSync(process.execPath, [path.join(root, 'cli', 'index.mjs'), ...args], { cwd, encoding: 'utf8', timeout: 60000 })
  return { code: r.status, out: (r.stdout || '').replace(/\s+$/, ''), err: r.stderr || '' }
}

function refsOf(dir) {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .sort()
      .map((f) => ({ file: f, tokens: estimateTokens(readFileSync(path.join(dir, f), 'utf8')) }))
  } catch {
    return []
  }
}

/* The quoted phrases of a skill description ("is this HTML correct") are what people type to the agent. */
const promptsOf = (description) => [...description.matchAll(/"([^"]{4,80})"/g)].map((m) => m[1])

/* The size of a recording, from its root element. */
function svgSize(file) {
  const head = readFileSync(file, 'utf8').slice(0, 400)
  const w = /\swidth="(\d+)"/.exec(head)?.[1]
  const h = /\sheight="(\d+)"/.exec(head)?.[1]
  return { width: Number(w) || 842, height: Number(h) || 584 }
}

export function loadData(root) {
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  const rules = loadRules(root).map((r) => ({ ...r, title: fallback(r.title), rawTitle: r.title, hasPlaceholder: /\{\{/.test(r.title + r.fix) }))
  const ruleIds = new Set(rules.map((r) => r.id))
  const catalog = loadSkills(root)
  const skills = catalog.map((s) => {
    const sec = sections(s.body)
    const refs = refsOf(path.join(s.dir, 'references'))
    return {
      ...s,
      rel: path.relative(root, s.dir).split(path.sep).join('/'),
      sections: sec,
      cost: { listing: listingTokens(s.text), body: estimateTokens(s.text), refs: refs.reduce((n, r) => n + r.tokens, 0) },
      references: refs,
      ruleList: s.rules.filter((id) => ruleIds.has(id)),
      prompts: promptsOf(s.description)
    }
  })
  const skillByName = new Map(skills.map((s) => [s.name, s]))
  for (const r of rules) r.skillObj = skillByName.get(r.skill) || null

  const areas = [...CHAPTER_ORDER.filter((a) => rules.some((r) => r.area === a)), ...RULE_AREAS.filter((a) => !CHAPTER_ORDER.includes(a) && rules.some((r) => r.area === a))]
  /* Rules in chapter order, so previous and next walk through one chapter after another. */
  const ordered = areas.flatMap((a) => rules.filter((r) => r.area === a))

  /* The installer's plan on the example project, per agent and per skill. */
  const example = path.join(root, EXAMPLE_PROJECT)
  const detected = existsSync(example) ? detectProject(example, []) : null
  const planCache = new Map()
  const planFor = (skillNames, agentId) => {
    const key = `${skillNames.join(',')}|${agentId}`
    if (planCache.has(key)) return planCache.get(key)
    const chosen = skillNames.map((n) => catalog.find((s) => s.name === n)).filter(Boolean)
    let result = null
    try {
      const p = planInstall({ root: example, skills: chosen, agents: [agentId], format: 'both', helpers: detected?.profile.helpers || {} })
      const files = p.ops.map((o) => ({ path: o.path, what: o.what, type: o.type }))
      const preview = p.ops.find((o) => o.what === 'rule') || p.ops.find((o) => o.what === 'instructions')
      result = { files, preview: preview ? { path: preview.path, text: preview.text || '', what: preview.what } : null, notes: p.notes || [], hints: p.hints || [], dirs: p.dirs || [] }
    } catch {
      result = null
    }
    planCache.set(key, result)
    return result
  }

  const sampleSkill = skillByName.get('fe-react') || skills[0]
  const agents = ADAPTERS.map((a) => {
    const plan = sampleSkill ? planFor([sampleSkill.name], a.id) : null
    const rule = plan?.files.find((f) => f.what === 'rule')
    return {
      id: a.id,
      label: a.label,
      detect: a.detect || [],
      skillDirs: a.skillDirs || [],
      instructions: typeof a.instructions === 'function' ? a.instructions(path.join(root, '.no-such-folder')) : a.instructions || null,
      instructionsVary: typeof a.instructions === 'function',
      rule: rule ? rule.path.split(sampleSkill.name).join('<skill>') : null,
      source: a.source || null
    }
  })

  const tokens = {
    estimator: ESTIMATOR,
    listing: skills.reduce((n, s) => n + s.cost.listing, 0),
    body: skills.length ? Math.round(skills.reduce((n, s) => n + s.cost.body, 0) / skills.length) : 0
  }

  /* The real audit of the example project, run inside it so paths read as a person sees them. */
  let audit = null
  if (existsSync(example)) {
    const work = mkdtempSync(path.join(tmpdir(), 'fs-site-report-'))
    try {
      const reportFile = path.join(work, 'frontend-report.md')
      const summary = runCli(root, ['audit', '--cwd', example, '--report', reportFile])
      const json = runCli(root, ['audit', '--cwd', example, '--json', '--no-report'])
      const data = JSON.parse(json.out)
      const report = existsSync(reportFile) ? readFileSync(reportFile, 'utf8') : ''
      const summaryText = summary.out
        .split('\n')
        .filter((l) => !l.startsWith('Report: '))
        .concat('Report: frontend-report.md')
        .join('\n')
      audit = { summary: summaryText, json: json.out, data, report, command: `npx ${PKG} audit` }
      const first = Object.entries(data.rules || {}).find(([id]) => ruleIds.has(id))
      if (first) {
        const rule = rules.find((r) => r.id === first[0])
        audit.finding = { rule, at: first[1].at[0], severity: first[1].s, fix: first[1].fix }
      }
    } catch {
      audit = null
    } finally {
      rmSync(work, { recursive: true, force: true })
    }
  }

  const commands = COMMAND_ORDER.map((name) => {
    const built = existsSync(path.join(root, 'cli', 'commands', `${name}.mjs`))
    const help = built ? runCli(root, [name, '--help']).out : ''
    return { name, built, help }
  })

  /* Recordings made by tools/record.mjs for the README: the animated SVG and its still frame. */
  const media = {}
  for (const name of ['init', 'audit', 'explain']) {
    const file = path.join(root, 'docs', 'media', `${name}.svg`)
    const still = path.join(root, 'docs', 'media', `${name}.png`)
    if (existsSync(file)) media[name] = { file, url: `/media/${name}.svg`, still: existsSync(still) ? still : null, stillUrl: existsSync(still) ? `/media/${name}.png` : null, ...svgSize(file) }
  }

  return {
    version: pkg.version,
    rules: ordered,
    ruleIds,
    skills,
    agents,
    sampleSkill,
    exampleSkills: detected ? detected.skills.map((s) => s.name) : [],
    exampleStack: detected ? detected.profile.stack : [],
    planFor,
    tokens,
    audit,
    commands,
    media,
    thirdParty: existsSync(path.join(root, 'THIRD-PARTY.md')),
    areas,
    skillAreas: SKILL_AREAS.filter((a) => skills.some((s) => s.area === a)),
    severities: SEVERITIES,
    checkKinds: CHECK_KINDS
  }
}
