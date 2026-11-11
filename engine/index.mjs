/*
 * The static audit engine. It lists the project's files, parses each one at most once (markup, embedded and
 * standalone CSS), runs every rule whose `applies` kinds and `stack` match, and returns the findings with rule id,
 * file and line. A rule is a folder under rules/ (rule.md for the dictionary entry, check.mjs for the code); the
 * check receives a small context (elements, css blocks, helpers, report) described in docs/architecture.md. A rule
 * that requires a project helper (rem-function, icon-classes…) runs only when the profile records it. A finding is
 * dropped when its line or the line above carries "fs-ignore <rule id>", or when the project profile ignores the
 * rule or excludes the file.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { normalizeText } from '../cli/lib/frontmatter.mjs'
import { globToRegExp } from '../cli/lib/glob.mjs'
import { parseCss } from './parse/css.mjs'
import { lineIndex, parseMarkup } from './parse/markup.mjs'
import { changedFiles, listFiles, MARKUP_KINDS, STYLE_KINDS } from './files.mjs'

const IGNORE = /fs-ignore(?![\w-])([^\n]*)/

/** Loads the check module of each rule that has one. */
export async function loadChecks(rules) {
  const out = []
  for (const rule of rules) {
    if (!rule.hasCheck || rule.status !== 'active' || rule.check !== 'static') continue
    const mod = await import(pathToFileURL(path.join(rule.dir, 'check.mjs')).href)
    const impl = mod.default
    if (!impl || typeof impl.check !== 'function') throw new Error(`${rule.id}: check.mjs must export default { check(ctx) }`)
    out.push({ rule, impl, project: rule.applies.includes('project') })
  }
  return out
}

function makeFileContext(file, text, profile) {
  let markup = null
  let css = null
  const parse = () => {
    if (!markup) markup = MARKUP_KINDS.includes(file.kind) ? parseMarkup(text, file.kind) : { elements: [], styles: [], doctype: false, line: lineIndex(text) }
    return markup
  }
  return {
    file: file.path,
    kind: file.kind,
    text,
    profile,
    elements(name) {
      const all = parse().elements
      if (!name) return all
      const names = Array.isArray(name) ? name : [name]
      return all.filter((e) => !e.component && names.includes(e.name))
    },
    get doctype() {
      return parse().doctype
    },
    lineOf(index) {
      return parse().line(index)
    },
    css() {
      if (css) return css
      if (STYLE_KINDS.includes(file.kind)) {
        css = parseCss(text, { scss: file.kind !== 'css', lineOf: lineIndex(text) }).blocks
      } else {
        const m = parse()
        css = []
        for (const st of m.styles) {
          if (!/^(css|scss|postcss|less)$/i.test(st.lang)) continue
          css.push(...parseCss(text.slice(st.start, st.end), { offset: st.start, lineOf: m.line, scss: st.lang !== 'css' }).blocks)
        }
      }
      return css
    }
  }
}

function ignoredAt(lines, line, id) {
  for (const l of [line, line - 1]) {
    const m = IGNORE.exec(lines[l - 1] || '')
    if (!m) continue
    const ids = m[1].replace(/-->|\*\/|\}/g, ' ').split(/[\s,]+/).filter((x) => /^[a-z][a-z0-9]*\/[a-z0-9-]+$/.test(x))
    if (ids.length === 0 || ids.includes(id)) return true
  }
  return false
}

/**
 * Runs the audit. options: { root, rules (from loadRules), profile, stack (Set of detected names), changed (bool),
 * base (git ref), files (override list, for tests) }. Returns { findings, files, rules, changedOnly }.
 */
export async function runAudit({ root, rules, profile = null, stack = new Set(), changed = false, base, files } = {}) {
  const checks = await loadChecks(rules)
  const audit = profile?.audit || {}
  const ignore = new Set(audit.ignore || [])
  const exclude = (audit.exclude || []).map((g) => globToRegExp(g))
  let all = files || listFiles(root)
  all = all.filter((f) => !exclude.some((re) => re.test(f.path)))
  let changedOnly = null
  if (changed) {
    changedOnly = changedFiles(root, base)
    if (changedOnly) all = all.filter((f) => changedOnly.has(f.path))
  }
  const helpers = profile?.helpers || {}
  const active = checks.filter(
    ({ rule }) =>
      !ignore.has(rule.id) &&
      (rule.stack.length === 0 || rule.stack.some((s) => stack.has(s))) &&
      rule.requires.every((h) => helpers[h])
  )
  const findings = []
  const texts = new Map()
  const read = (rel) => {
    if (!texts.has(rel)) {
      let t = ''
      try {
        t = normalizeText(readFileSync(path.join(root, rel), 'utf8'))
      } catch {
        t = ''
      }
      texts.set(rel, t)
    }
    return texts.get(rel)
  }
  const push = (rule, file, line, message, lines) => {
    if (lines && ignoredAt(lines, line, rule.id)) return
    findings.push({ id: rule.id, severity: rule.severity, file, line, message: message || rule.title })
  }

  for (const file of all) {
    const fileChecks = active.filter(({ rule, project }) => !project && rule.applies.includes(file.kind))
    if (fileChecks.length === 0) continue
    if (file.size > 2 * 1024 * 1024) continue
    const text = read(file.path)
    const lines = text.split('\n')
    const ctx = makeFileContext(file, text, profile)
    ctx.helpers = helpers
    for (const { rule, impl } of fileChecks) {
      ctx.report = (at, message) => {
        const line = typeof at === 'number' ? at : at?.line || 1
        push(rule, file.path, line, message, lines)
      }
      try {
        impl.check(ctx)
      } catch (err) {
        findings.push({ id: 'tooling/check-error', severity: 'minor', file: file.path, line: 1, message: `${rule.id} failed: ${err.message}` })
      }
    }
  }

  for (const { rule, impl } of active.filter((c) => c.project)) {
    const pctx = {
      root,
      files: all,
      profile,
      helpers,
      read,
      report(at, message) {
        push(rule, at.file || '.', at.line || 1, message, at.file ? read(at.file).split('\n') : null)
      }
    }
    impl.check(pctx)
  }

  const order = (s) => ['critical', 'serious', 'moderate', 'minor'].indexOf(s)
  findings.sort((a, b) => order(a.severity) - order(b.severity) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0) || (a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line))
  return { findings, files: all.length, rules: active.length, changedOnly: changedOnly ? changedOnly.size : null }
}
