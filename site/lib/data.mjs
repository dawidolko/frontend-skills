/*
 * Gathers everything the site shows from the repository itself, so no number or example on a page is typed by hand:
 * the rules and skills (through the command's own catalog loader), the coding agents and the files each adapter
 * writes, the token cost of every skill (through the command's own estimator), the real output of `audit` on an
 * example project, and the real `--help` text of every command.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { ADAPTERS } from '../../adapters/index.mjs'
import { CHECK_KINDS, RULE_AREAS, SEVERITIES, SKILL_AREAS, loadRules, loadSkills, sections } from '../../cli/lib/catalog.mjs'
import { ESTIMATOR, estimateTokens } from '../../cli/lib/tokens.mjs'
import { listingTokens } from '../../cli/commands/tokens.mjs'

export const REPO = 'https://github.com/dawidolko/frontend-skills'
export const BLOB = `${REPO}/blob/main`
export const START = 'npx github:dawidolko/frontend-skills init'
export const EXAMPLE_PROJECT = 'fixtures/projects/react-vite'

const COMMAND_ORDER = ['init', 'audit', 'learn', 'list', 'explain', 'doctor', 'update', 'uninstall', 'tokens']

/* Fills {{helper.field|fallback}} placeholders with their fallback, as `explain` does outside a project. */
export const fallback = (s) => String(s ?? '').replace(/\{\{[^|}]+\|([^}]*)\}\}/g, '$1').replace(/\{\{[^}]+\}\}/g, '…')

function runCli(root, args) {
  const r = spawnSync(process.execPath, [path.join(root, 'cli', 'index.mjs'), ...args], { cwd: root, encoding: 'utf8', timeout: 60000 })
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

/* What an adapter writes as a glob-scoped rule file, with the skill name made generic. Null when it writes none. */
function rulePattern(a, skill) {
  if (typeof a.rule !== 'function') return null
  try {
    const r = a.rule(skill, { skillPath: (s) => `.agents/skills/${s.name}/SKILL.md`, profile: null })
    return r?.path ? { path: r.path.split(skill.name).join('<skill>'), text: r.text } : null
  } catch {
    return null
  }
}

export function loadData(root) {
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  const rules = loadRules(root).map((r) => ({ ...r, title: fallback(r.title), rawTitle: r.title, fix: r.fix, hasPlaceholder: /\{\{/.test(r.title + r.fix) }))
  const ruleIds = new Set(rules.map((r) => r.id))
  const skills = loadSkills(root).map((s) => {
    const sec = sections(s.body)
    const refs = refsOf(path.join(s.dir, 'references'))
    return {
      ...s,
      rel: path.relative(root, s.dir).split(path.sep).join('/'),
      sections: sec,
      cost: { listing: listingTokens(s.text), body: estimateTokens(s.text), refs: refs.reduce((n, r) => n + r.tokens, 0) },
      references: refs,
      ruleList: s.rules.filter((id) => ruleIds.has(id))
    }
  })

  /* Rules point to their skill; a skill lists its rules. Both directions are joined so pages can link either way. */
  const skillByName = new Map(skills.map((s) => [s.name, s]))
  for (const r of rules) r.skillObj = skillByName.get(r.skill) || null

  const sample = skills.find((s) => s.name === 'fe-html') || skills[0]
  const agents = ADAPTERS.map((a) => {
    const rule = sample ? rulePattern(a, sample) : null
    return {
      id: a.id,
      label: a.label,
      skillDirs: a.skillDirs || [],
      instructions: a.instructions || null,
      rule: rule ? rule.path : null,
      source: a.source || null
    }
  })
  const cursor = ADAPTERS.find((a) => a.id === 'cursor')
  const globExample = sample && cursor ? { skill: sample.name, ...rulePattern(cursor, sample) } : null
  if (globExample?.path) globExample.path = globExample.path.split('<skill>').join(sample.name)

  const tokens = {
    estimator: ESTIMATOR,
    listing: skills.reduce((n, s) => n + s.cost.listing, 0),
    body: skills.length ? Math.round(skills.reduce((n, s) => n + s.cost.body, 0) / skills.length) : 0
  }

  /* The real audit of the example project: the terminal summary and the condensed JSON. */
  let audit = null
  if (existsSync(path.join(root, EXAMPLE_PROJECT))) {
    const summary = runCli(root, ['audit', EXAMPLE_PROJECT, '--no-report'])
    const json = runCli(root, ['audit', EXAMPLE_PROJECT, '--json', '--no-report'])
    try {
      const data = JSON.parse(json.out)
      audit = { summary: summary.out, json: json.out, data, command: `npx github:dawidolko/frontend-skills audit` }
    } catch {
      audit = null
    }
  }
  if (audit) {
    const first = Object.entries(audit.data.rules || {}).find(([id]) => ruleIds.has(id))
    if (first) {
      const rule = rules.find((r) => r.id === first[0])
      audit.finding = { rule, at: first[1].at[0], severity: first[1].s, fix: first[1].fix }
      audit.explain = runCli(root, ['explain', rule.id]).out
    }
  }

  const commands = COMMAND_ORDER.map((name) => {
    const built = existsSync(path.join(root, 'cli', 'commands', `${name}.mjs`))
    const help = built ? runCli(root, [name, '--help']).out : ''
    return { name, built, help }
  })

  const thirdParty = existsSync(path.join(root, 'THIRD-PARTY.md'))

  return {
    version: pkg.version,
    rules,
    ruleIds,
    skills,
    agents,
    globExample,
    tokens,
    audit,
    commands,
    thirdParty,
    areas: RULE_AREAS.filter((a) => rules.some((r) => r.area === a)),
    skillAreas: SKILL_AREAS.filter((a) => skills.some((s) => s.area === a)),
    severities: SEVERITIES,
    checkKinds: CHECK_KINDS
  }
}
