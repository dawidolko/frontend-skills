/*
 * The project profile (.frontend-skills/profile.json) and the confirmed lessons (.frontend-skills/lessons.md):
 * building a profile from detection while keeping the person's own `audit` settings, choosing the skills that match
 * the stack, and reading, checking and adding lessons (one line each, no secrets). Shapes: docs/architecture.md.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { mergeHelpers } from './conventions.mjs'
import { STATE_DIR } from './install.mjs'

export const PROFILE = `${STATE_DIR}/profile.json`
export const LESSONS = `${STATE_DIR}/lessons.md`
export const LESSON_KINDS = ['convention', 'command', 'pitfall']
export const DEFAULT_AUDIT = { failOn: 'serious', ignore: [], exclude: [], budgets: { imageKB: 250 } }

const file = (root, rel) => path.join(root, ...rel.split('/'))

export function readProfile(root) {
  try {
    return JSON.parse(readFileSync(file(root, PROFILE), 'utf8'))
  } catch {
    return null
  }
}

export function writeProfile(root, profile) {
  mkdirSync(file(root, STATE_DIR), { recursive: true })
  writeFileSync(file(root, PROFILE), `${JSON.stringify(profile, null, 2)}\n`)
}

/** The skills whose `requires` matches the stack, sorted by area then name. */
export function matchSkills(skills, stack) {
  const keys = new Set(stack)
  return skills.filter((s) => s.requires.some((r) => keys.has(r)))
}

/** A new profile from detection, keeping audit settings and lesson-independent fields of the previous one. */
export function buildProfile({ detected, helpers = {}, agents, skills, previous, version, today }) {
  return {
    version: 1,
    tool: `frontend-skills ${version}`,
    updated: today,
    packageManager: detected.packageManager,
    monorepo: detected.monorepo,
    projects: detected.projects,
    stack: detected.stack,
    helpers: mergeHelpers(helpers, previous?.helpers),
    agents,
    skills: skills.map((s) => s.name),
    audit: { ...DEFAULT_AUDIT, ...(previous?.audit || {}), budgets: { ...DEFAULT_AUDIT.budgets, ...(previous?.audit?.budgets || {}) } }
  }
}

/** What changed between two profiles, as short lines ("+ tailwind", "react 19.2.0 -> 19.3.1"). */
export function profileDiff(before, after) {
  if (!before) return ['new profile']
  const out = []
  const b = new Set(before.stack || [])
  const a = new Set(after.stack || [])
  for (const k of a) if (!b.has(k)) out.push(`+ ${k}`)
  for (const k of b) if (!a.has(k)) out.push(`- ${k}`)
  const versions = (p) => Object.fromEntries((p.projects || []).flatMap((x) => Object.entries(x.frameworks).map(([k, v]) => [`${x.path}:${k}`, v])))
  const vb = versions(before)
  for (const [k, v] of Object.entries(versions(after))) if (k in vb && vb[k] !== v) out.push(`${k.replace(/^\.:/, '')} ${vb[k] ?? '?'} -> ${v ?? '?'}`)
  const hb = before.helpers || {}
  for (const [id, h] of Object.entries(after.helpers || {})) if (!hb[id]) out.push(`+ helper ${id}${h.name ? ` (${h.name})` : h.tool ? ` (${h.tool})` : ''}`)
  for (const id of Object.keys(hb)) if (!(after.helpers || {})[id]) out.push(`- helper ${id}`)
  return out
}

/* ---------- lessons ---------- */

const HEADER = '# Project lessons\n\nConventions of this project that a person confirmed. Every front-end skill reads this file first; a lesson wins over a skill. One line each; never secrets.\n\n'
const LINE = /^- (\d{4}-\d{2}-\d{2}) · (convention|command|pitfall) · (.+)$/
const SECRETS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY/,
  /\b(AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\b(ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}/,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./,
  /\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*\S+/i,
  /:\/\/[^/\s:@]+:[^/\s@]+@/
]

/** Why a lesson cannot be stored, or null. */
export function lessonProblem(text, kind) {
  if (!LESSON_KINDS.includes(kind)) return `the kind must be one of ${LESSON_KINDS.join(', ')}`
  if (!text || !text.trim()) return 'the lesson is empty'
  if (/[\r\n]/.test(text)) return 'a lesson is one line'
  if (text.length > 300) return 'a lesson is at most 300 characters'
  if (SECRETS.some((re) => re.test(text))) return 'the lesson looks like it contains a secret'
  return null
}

export function readLessons(root) {
  let text = ''
  try {
    text = readFileSync(file(root, LESSONS), 'utf8')
  } catch {
    return []
  }
  return text
    .split(/\r?\n/)
    .map((l) => LINE.exec(l))
    .filter(Boolean)
    .map((m) => ({ date: m[1], kind: m[2], text: m[3] }))
}

/** Appends a lesson; returns { added } or { problem }. Duplicates are not added twice. */
export function addLesson(root, { text, kind, today }) {
  const problem = lessonProblem(text, kind)
  if (problem) return { problem }
  const clean = text.trim()
  if (readLessons(root).some((l) => l.text.toLowerCase() === clean.toLowerCase())) return { added: false }
  let current = ''
  try {
    current = readFileSync(file(root, LESSONS), 'utf8')
  } catch {
    current = HEADER
  }
  mkdirSync(file(root, STATE_DIR), { recursive: true })
  writeFileSync(file(root, LESSONS), `${current.replace(/\s*$/, '\n')}- ${today} · ${kind} · ${clean}\n`)
  return { added: true }
}

/** Creates an empty lessons file when none exists. */
export function ensureLessons(root) {
  try {
    readFileSync(file(root, LESSONS))
    return false
  } catch {
    mkdirSync(file(root, STATE_DIR), { recursive: true })
    writeFileSync(file(root, LESSONS), HEADER)
    return true
  }
}
