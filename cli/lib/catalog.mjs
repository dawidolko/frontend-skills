/*
 * Loads the two halves of the dictionary from this package: the skills (skills/<area>/<name>/SKILL.md) and the rules
 * (rules/<area>/<name>/rule.md, with an optional check.mjs). It also holds the shape both must have, so the
 * validator, the installer, `list`, `explain` and the audit engine agree on one definition. See docs/architecture.md.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFrontMatter } from './frontmatter.mjs'

export const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export const SEVERITIES = ['critical', 'serious', 'moderate', 'minor']
export const CHECK_KINDS = ['static', 'browser', 'manual']
export const RULE_AREAS = [
  'html', 'css', 'responsive', 'a11y', 'perf', 'seo', 'i18n', 'security', 'js', 'ts', 'test', 'tooling',
  'react', 'next', 'vue', 'nuxt', 'angular', 'svelte', 'astro', 'webc', 'tailwind', 'sass', 'state'
]
export const SKILL_AREAS = ['foundations', 'styling', 'frameworks', 'accessibility', 'performance', 'quality', 'workflow']
export const APPLIES = ['html', 'angular', 'vue', 'svelte', 'astro', 'jsx', 'css', 'scss', 'less', 'image', 'svg', 'font', 'project', 'page']

const dirs = (p) => {
  try {
    return readdirSync(p, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  } catch {
    return []
  }
}

/* Front matter lists are YAML lists; metadata lists (strings by the Agent Skills spec) are space-separated. */
const list = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v.trim() ? v.trim().split(/\s+/) : [])

/** Splits a Markdown body into { heading: text } by its "## " headings. */
export function sections(body) {
  const out = {}
  let current = '_'
  for (const line of body.split('\n')) {
    const m = /^## (.+)$/.exec(line)
    if (m) current = m[1].trim().toLowerCase()
    else out[current] = `${out[current] || ''}${line}\n`
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim()
  return out
}

/** Reads one rule folder; returns the rule or throws with the file named. */
export function readRule(dir, area, name) {
  const file = path.join(dir, 'rule.md')
  const { data, body } = parseFrontMatter(readFileSync(file, 'utf8'))
  if (!data) throw new Error(`${file}: no front matter`)
  const s = sections(body)
  return {
    id: data.id,
    area,
    name,
    title: data.title,
    severity: data.severity,
    check: data.check,
    applies: list(data.applies),
    stack: list(data.stack),
    wcag: list(data.wcag),
    level: data.level || null,
    axe: list(data.axe),
    lighthouse: list(data.lighthouse),
    sources: Array.isArray(data.sources) ? data.sources : [],
    skill: data.skill || null,
    since: data.since || null,
    status: data.status || 'active',
    replacedBy: data['replaced-by'] || null,
    why: s.why || '',
    fix: s.fix || '',
    examples: s.examples || '',
    dir,
    hasCheck: existsSync(path.join(dir, 'check.mjs')),
    data
  }
}

/** Every rule of the dictionary, sorted by id. */
export function loadRules(root = PACKAGE_ROOT) {
  const out = []
  const base = path.join(root, 'rules')
  for (const area of dirs(base)) for (const name of dirs(path.join(base, area))) out.push(readRule(path.join(base, area, name), area, name))
  return out.sort((a, b) => (a.id < b.id ? -1 : 1))
}

/** Every skill: { name, area, dir, description, metadata, body, lines }. */
export function loadSkills(root = PACKAGE_ROOT) {
  const out = []
  const base = path.join(root, 'skills')
  for (const area of dirs(base))
    for (const name of dirs(path.join(base, area))) {
      const dir = path.join(base, area, name)
      const file = path.join(dir, 'SKILL.md')
      if (!existsSync(file)) continue
      const text = readFileSync(file, 'utf8')
      const { data, body } = parseFrontMatter(text)
      const meta = (data && typeof data.metadata === 'object' && data.metadata) || {}
      out.push({
        name: data?.name,
        folder: name,
        area,
        dir,
        file,
        text,
        description: data?.description || '',
        data: data || {},
        metadata: meta,
        title: meta.title || name,
        requires: list(meta.requires),
        globs: list(meta.globs),
        rules: list(meta.rules),
        lane: meta.lane || null,
        body
      })
    }
  return out.sort((a, b) => (a.name < b.name ? -1 : 1))
}

/** The rule with this id, following replaced-by for a deprecated id. Returns { rule, via } or null. */
export function findRule(rules, id) {
  const byId = new Map(rules.map((r) => [r.id, r]))
  let rule = byId.get(id)
  if (!rule) return null
  const via = []
  while (rule.status === 'deprecated' && rule.replacedBy && byId.has(rule.replacedBy) && via.length < 5) {
    via.push(rule.id)
    rule = byId.get(rule.replacedBy)
  }
  return { rule, via }
}
