#!/usr/bin/env node
/*
 * Validates the dictionary: every skill against the Agent Skills specification and this repository's budgets, every
 * rule against the rule format (ids, severities, sources, owners, helpers, fixtures), and the always-on instruction
 * block against its token budget. Budgets and keys are defined in docs/architecture.md; never raise one to pass.
 * Usage: node tools/validate.mjs [--json]
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderBlock } from '../cli/lib/blocks.mjs'
import { APPLIES, CHECK_KINDS, loadRules, loadSkills, PACKAGE_ROOT, RULE_AREAS, sections, SEVERITIES, SKILL_AREAS } from '../cli/lib/catalog.mjs'
import { HELPER_IDS } from '../cli/lib/conventions.mjs'
import { STACK_KEYS } from '../cli/lib/detect.mjs'
import { parseFrontMatter } from '../cli/lib/frontmatter.mjs'
import { estimateTokens } from '../cli/lib/tokens.mjs'

export const BUDGETS = { description: 400, skillLines: 120, skillTokens: 1800, rulesBullets: 12, rulesTokens: 450, refLines: 300, refTokens: 4000, block: 250, title: 140 }
const SKILL_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']
const META_KEYS = ['title', 'area', 'lane', 'requires', 'globs', 'rules', 'version']
const RULE_KEYS = ['id', 'title', 'severity', 'check', 'applies', 'stack', 'requires', 'wcag', 'level', 'axe', 'lighthouse', 'sources', 'skill', 'since', 'status', 'replaced-by', 'tags']
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Returns a list of { file, problem } for the package at root. */
export function validate(root = PACKAGE_ROOT) {
  const problems = []
  const rel = (f) => path.relative(root, f).split(path.sep).join('/')
  const bad = (file, problem) => problems.push({ file: rel(file), problem })
  const version = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).version
  const planned = new Set([...readFileSync(path.join(root, 'docs', 'skills-plan.md'), 'utf8').matchAll(/`(fe-[a-z0-9-]+)`/g)].map((m) => m[1]))

  let skills = []
  let rules = []
  try {
    skills = loadSkills(root)
  } catch (err) {
    bad(path.join(root, 'skills'), err.message)
  }
  try {
    rules = loadRules(root)
  } catch (err) {
    bad(path.join(root, 'rules'), err.message)
  }
  const ruleIds = new Set(rules.map((r) => r.id))
  const skillNames = new Set()

  for (const s of skills) {
    const f = s.file
    const d = s.data
    for (const k of Object.keys(d)) if (!SKILL_KEYS.includes(k)) bad(f, `front matter key "${k}" is not in the Agent Skills specification`)
    if (!d.name || !NAME.test(d.name) || d.name.length > 64) bad(f, 'name must be 1-64 lowercase letters, digits and single hyphens')
    if (d.name !== s.folder) bad(f, `name "${d.name}" must equal the folder "${s.folder}"`)
    if (!String(d.name).startsWith('fe-')) bad(f, 'name must start with "fe-"')
    if (skillNames.has(d.name)) bad(f, `duplicate skill name ${d.name}`)
    skillNames.add(d.name)
    const desc = typeof d.description === 'string' ? d.description : ''
    if (!desc) bad(f, 'description is required')
    if (desc.length > BUDGETS.description) bad(f, `description is ${desc.length} characters (budget ${BUDGETS.description})`)
    if (/[<>]/.test(desc)) bad(f, 'description must not contain < or >')
    if (!/\bUse (when|for)\b/.test(desc)) bad(f, 'description must say when to use the skill ("Use when …")')
    if (d.license !== 'MIT') bad(f, 'license must be MIT')
    if (!d.compatibility || d.compatibility.length > 500) bad(f, 'compatibility is required, at most 500 characters')
    const m = d.metadata
    if (!m || typeof m !== 'object') bad(f, 'metadata is required')
    else {
      for (const k of META_KEYS) if (typeof m[k] !== 'string' || !m[k]) bad(f, `metadata.${k} is required (a string)`)
      for (const k of Object.keys(m)) if (!META_KEYS.includes(k)) bad(f, `metadata.${k} is not a known key`)
      if (m.title && m.title.length > 40) bad(f, 'metadata.title is longer than 40 characters')
      if (m.area !== s.area || !SKILL_AREAS.includes(s.area)) bad(f, `metadata.area must equal the folder area (${SKILL_AREAS.join(', ')})`)
      if (!['A', 'B', 'C', 'W'].includes(m.lane)) bad(f, 'metadata.lane must be A, B, C or W')
      for (const k of s.requires) if (!STACK_KEYS.includes(k)) bad(f, `metadata.requires: unknown stack key "${k}"`)
      for (const id of s.rules) if (!ruleIds.has(id)) bad(f, `metadata.rules: no rule "${id}"`)
      if (!s.globs.length) bad(f, 'metadata.globs needs at least one glob')
      for (const g of s.globs) if (/[,{}]/.test(g)) bad(f, `glob "${g}" must not use commas or braces (agents disagree on them); list each pattern`)
      if (m.version !== version) bad(f, `metadata.version must be ${version}`)
    }
    const lines = s.text.split('\n').length
    const tokens = estimateTokens(s.text)
    if (lines > BUDGETS.skillLines) bad(f, `SKILL.md has ${lines} lines (budget ${BUDGETS.skillLines})`)
    if (tokens > BUDGETS.skillTokens) bad(f, `SKILL.md is ~${tokens} tokens (budget ${BUDGETS.skillTokens})`)
    const sec = sections(s.body)
    for (const h of ['rules', 'do this', 'check', 'references']) if (!sec[h]) bad(f, `missing section "## ${h[0].toUpperCase()}${h.slice(1)}"`)
    if (!/profile\.json/.test(sec._ || '') || !/lessons\.md/.test(sec._ || '')) bad(f, 'the line after the title must point to .frontend-skills/profile.json and lessons.md')
    if (sec.rules) {
      const bullets = sec.rules.split('\n').filter((l) => /^- /.test(l)).length
      if (bullets > BUDGETS.rulesBullets) bad(f, `## Rules has ${bullets} bullets (budget ${BUDGETS.rulesBullets})`)
      if (estimateTokens(sec.rules) > BUDGETS.rulesTokens) bad(f, `## Rules is ~${estimateTokens(sec.rules)} tokens (budget ${BUDGETS.rulesTokens})`)
      for (const id of sec.rules.matchAll(/\(([a-z][a-z0-9]*\/[a-z0-9-]+)(?:, [a-z][a-z0-9]*\/[a-z0-9-]+)*\)/g))
        for (const x of id[0].slice(1, -1).split(', ')) if (!ruleIds.has(x)) bad(f, `## Rules cites unknown rule ${x}`)
    }
    const linked = new Set([...s.body.matchAll(/\]\((references\/[^)#]+)\)/g)].map((x) => x[1]))
    for (const l of linked) if (!existsSync(path.join(s.dir, ...l.split('/')))) bad(f, `link to missing ${l}`)
    const refDir = path.join(s.dir, 'references')
    if (existsSync(refDir))
      for (const e of readdirSync(refDir, { withFileTypes: true })) {
        const rf = path.join(refDir, e.name)
        if (!e.isFile() || !e.name.endsWith('.md')) {
          bad(rf, 'references/ holds only .md files, one level deep')
          continue
        }
        if (!linked.has(`references/${e.name}`)) bad(rf, 'not linked from SKILL.md')
        const t = readFileSync(rf, 'utf8')
        if (t.split('\n').length > BUDGETS.refLines) bad(rf, `${t.split('\n').length} lines (budget ${BUDGETS.refLines})`)
        if (estimateTokens(t) > BUDGETS.refTokens) bad(rf, `~${estimateTokens(t)} tokens (budget ${BUDGETS.refTokens})`)
        if (!/^## Sources$/m.test(t)) bad(rf, 'must end with a "## Sources" list')
      }
  }

  for (const r of rules) {
    const f = path.join(r.dir, 'rule.md')
    for (const k of Object.keys(r.data)) if (!RULE_KEYS.includes(k)) bad(f, `unknown key "${k}"`)
    if (r.id !== `${r.area}/${r.name}`) bad(f, `id must be ${r.area}/${r.name}`)
    if (!RULE_AREAS.includes(r.area)) bad(f, `area "${r.area}" is not in RULE_AREAS`)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.name)) bad(f, 'the rule folder must be kebab-case')
    if (!r.title || r.title.length > BUDGETS.title) bad(f, `title is required, at most ${BUDGETS.title} characters`)
    if (!SEVERITIES.includes(r.severity)) bad(f, `severity must be one of ${SEVERITIES.join(', ')}`)
    if (!CHECK_KINDS.includes(r.check)) bad(f, `check must be one of ${CHECK_KINDS.join(', ')}`)
    if (!r.applies.length) bad(f, 'applies needs at least one file kind')
    for (const a of r.applies) if (!APPLIES.includes(a)) bad(f, `applies: unknown kind "${a}"`)
    for (const k of r.stack) if (!STACK_KEYS.includes(k)) bad(f, `stack: unknown key "${k}"`)
    for (const h of r.requires) if (!HELPER_IDS.includes(h)) bad(f, `requires: unknown helper "${h}"`)
    for (const [, id] of `${r.title}\n${r.fix}\n${r.why}`.matchAll(/\{\{([\w-]+)\.[\w-]+(?:\|[^}]*)?\}\}/g)) if (!r.requires.includes(id)) bad(f, `placeholder for helper "${id}" without requires: [${id}]`)
    if (r.area === 'a11y' && !r.wcag.length) bad(f, 'accessibility rules name their WCAG success criteria')
    for (const w of r.wcag) if (!/^\d\.\d{1,2}\.\d{1,2}$/.test(w)) bad(f, `wcag "${w}" is not a success criterion number`)
    if (r.level && !['A', 'AA', 'AAA'].includes(r.level)) bad(f, 'level must be A, AA or AAA')
    if (!r.sources.length) bad(f, 'at least one source is required')
    for (const s of r.sources) {
      if (!s || typeof s !== 'object' || !s.title || !s.url) bad(f, 'each source needs title and url')
      else if (!/^https:\/\/[^\s]+$/.test(s.url)) bad(f, `source url must be https: ${s.url}`)
    }
    if (!r.skill || !(skillNames.has(r.skill) || planned.has(r.skill))) bad(f, `skill "${r.skill}" is neither written nor in docs/skills-plan.md`)
    if (!r.since) bad(f, 'since is required')
    if (!['active', 'deprecated'].includes(r.status)) bad(f, 'status must be active or deprecated')
    if (r.status === 'deprecated' && !ruleIds.has(r.replacedBy)) bad(f, 'a deprecated rule names an existing replaced-by')
    for (const h of ['why', 'fix', 'examples']) if (!r[h]) bad(f, `missing section "## ${h[0].toUpperCase()}${h.slice(1)}"`)
    const fixtures = path.join(r.dir, 'fixtures')
    if (r.check === 'static') {
      if (!r.hasCheck) bad(f, 'a static rule needs check.mjs')
      const fx = existsSync(fixtures) ? readdirSync(fixtures) : []
      if (!fx.some((x) => x.startsWith('bad.')) || !fx.some((x) => x.startsWith('good.'))) bad(f, 'a static rule needs fixtures/bad.* and fixtures/good.*')
    } else if (r.hasCheck) bad(f, `a ${r.check} rule has no check.mjs`)
    if (r.check === 'browser' && !r.axe.length && !r.lighthouse.length) bad(f, 'a browser rule maps to axe or lighthouse ids')
  }

  const block = estimateTokens(renderBlock())
  if (block > BUDGETS.block) bad(path.join(root, 'cli', 'lib', 'blocks.mjs'), `the instruction block is ~${block} tokens (budget ${BUDGETS.block})`)
  return problems
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  const problems = validate()
  if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(problems)}\n`)
  else {
    for (const p of problems) process.stdout.write(`${p.file}: ${p.problem}\n`)
    const s = loadSkills().length
    const r = loadRules().length
    process.stdout.write(problems.length ? `${problems.length} problem(s).\n` : `${s} skills and ${r} rules are valid.\n`)
  }
  process.exitCode = problems.length ? 1 : 0
}
