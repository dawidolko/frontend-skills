/*
 * Plans, applies and undoes an installation. planInstall() turns the chosen skills and agents into a list of
 * operations (whole files the tool owns, marked blocks in shared files, files created only when missing);
 * applyPlan() writes them safely and keeps the record in .frontend-skills/install.json (path, SHA-256, whether the
 * tool created the file), so a later run updates only what is unchanged since it was written, never overwrites a
 * file a person wrote or edited, removes what is no longer planned, and uninstall() removes exactly what is recorded.
 */
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { adapter, chooseSkillDirs } from '../../adapters/index.mjs'
import { skillIndex } from '../../adapters/shared.mjs'
import { removeBlock, renderBlock, upsertBlock } from './blocks.mjs'
import { helperLines } from './conventions.mjs'
import { normalizeText } from './frontmatter.mjs'

export const STATE_DIR = '.frontend-skills'
export const RECORD = `${STATE_DIR}/install.json`
export const SUPPORT_DIR = `${STATE_DIR}/skills`
export const FORMATS = ['both', 'skills', 'rules']

export const sha256 = (text) => createHash('sha256').update(text).digest('hex')
const SAFE_PATH = /^[A-Za-z0-9._@+-]+(\/[A-Za-z0-9._@+-]+)*$/

/** True when rel is a plain relative path: "/"-separated segments, no "..", ".", backslash, drive or absolute path. */
export const safeRelative = (rel) => typeof rel === 'string' && SAFE_PATH.test(rel) && !rel.split('/').some((seg) => seg === '..' || seg === '.')

/*
 * The absolute path of a planned or recorded file. Refuses anything that could leave the project: a path that is not
 * plain, a symbolic link anywhere between the root and the file, or a real path outside the root. A recorded path
 * comes from a file in the repository, so it is treated as untrusted input.
 */
const unsafe = (message) => Object.assign(new Error(message), { code: 'EUNSAFE' })

function abs(root, rel) {
  if (!safeRelative(rel)) throw unsafe(`refusing a path that is not a plain project path: ${JSON.stringify(rel)}`)
  const base = realpathSync(root)
  let cur = base
  for (const seg of rel.split('/')) {
    cur = path.join(cur, seg)
    let st = null
    try {
      st = lstatSync(cur)
    } catch {
      break
    }
    if (st.isSymbolicLink()) throw unsafe(`refusing to follow a symbolic link inside the project: ${rel}`)
  }
  const file = path.join(base, ...rel.split('/'))
  if (path.relative(base, file).startsWith('..')) throw unsafe(`refusing to write outside the project: ${rel}`)
  return file
}
const readText = (file) => {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

function skillFiles(skill) {
  const out = []
  const walk = (dir, rel) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '.DS_Store' || e.name === 'node_modules') continue
      const r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) walk(path.join(dir, e.name), r)
      else if (e.isFile()) out.push({ rel: r, text: normalizeText(readFileSync(path.join(dir, e.name), 'utf8')) })
    }
  }
  walk(skill.dir, '')
  return out.sort((a, b) => (a.rel < b.rel ? -1 : 1))
}

/**
 * Builds the plan. options: { root, skills, agents (ids), format }. Returns { ops, dirs, duplicates, notes, hints,
 * skillPath } where an op is { type: 'file' | 'block' | 'createOnly', path, text, agents, what }.
 */
export function planInstall({ root, skills, agents, format = 'both', helpers = {} }) {
  if (!FORMATS.includes(format)) throw new Error(`unknown format "${format}"; use ${FORMATS.join(', ')}`)
  const adapters = agents.map(adapter)
  const cover = format === 'rules' ? { dirs: [], duplicates: [], readers: {} } : chooseSkillDirs(agents)
  const needsCopy = cover.dirs.length === 0 && adapters.some((a) => a.rule || a.withIndex)
  const copyDirs = needsCopy ? [SUPPORT_DIR] : cover.dirs
  const home = copyDirs[0] || SUPPORT_DIR
  const skillPath = (s) => `${home}/${s.name}/SKILL.md`
  const ops = []
  const add = (op) => {
    const existing = ops.find((o) => o.path === op.path)
    if (existing) existing.agents = [...new Set([...existing.agents, ...op.agents])]
    else ops.push(op)
  }

  for (const dir of copyDirs) {
    const readers = adapters.filter((a) => a.skillDirs.includes(dir)).map((a) => a.id)
    for (const s of skills) for (const f of skillFiles(s)) add({ type: 'file', path: `${dir}/${s.name}/${f.rel}`, text: f.text, agents: readers.length ? readers : ['support'], what: 'skill' })
  }

  if (format !== 'skills')
    for (const a of adapters) if (a.rule) for (const s of skills) add({ type: 'file', ...a.rule(s, { skillPath }), agents: [a.id], what: 'rule' })

  const blocks = new Map()
  for (const a of adapters) {
    if (!a.instructions) continue
    const file = typeof a.instructions === 'function' ? a.instructions(root) : a.instructions
    const entry = blocks.get(file) || { agents: [], index: false }
    entry.agents.push(a.id)
    entry.index = entry.index || !!a.withIndex
    blocks.set(file, entry)
  }
  for (const [file, { agents: ids, index }] of blocks)
    add({ type: 'block', path: file, text: renderBlock({ index: index ? skillIndex(skills, skillPath) : null, helpers: helperLines(helpers) }), agents: ids, what: 'instructions' })

  const hints = []
  for (const a of adapters)
    for (const x of a.extra ? a.extra({ root }) : []) {
      if (existsSync(abs(root, x.path))) {
        if (!/CONVENTIONS\.md/.test(readText(abs(root, x.path)) || '')) hints.push(`${a.label}: ${x.hint}`)
      } else add({ type: 'createOnly', path: x.path, text: x.text, agents: [a.id], what: 'config' })
    }

  const notes = adapters.flatMap((a) => a.notes.map((n) => `${a.label}: ${n}`))
  if (adapters.some((a) => a.id === 'cline')) {
    const cr = abs(root, '.clinerules')
    if (existsSync(cr) && statSync(cr).isFile()) {
      for (let i = ops.length - 1; i >= 0; i--) if (ops[i].path.startsWith('.clinerules/')) ops.splice(i, 1)
    }
  }
  return { ops, dirs: copyDirs, duplicates: cover.duplicates, notes, hints, skillPath }
}

/** The install record, with every entry that is not a plain project path dropped (and listed in `unsafe`). */
export function readRecord(root) {
  let r
  try {
    r = JSON.parse(readFileSync(abs(root, RECORD), 'utf8'))
  } catch {
    return null
  }
  const files = {}
  const unsafe = []
  for (const [rel, entry] of Object.entries(r && typeof r.files === 'object' && r.files ? r.files : {}))
    if (safeRelative(rel) && entry && (entry.kind === 'file' || entry.kind === 'block')) files[rel] = entry
    else unsafe.push(rel)
  return { version: 1, ...r, agents: Array.isArray(r.agents) ? r.agents.filter((a) => typeof a === 'string') : [], files, unsafe }
}

function writeRecord(root, record) {
  const file = abs(root, RECORD)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`)
}

function pruneDirs(root, rel) {
  let dir = path.dirname(abs(root, rel))
  const top = path.resolve(root)
  while (path.resolve(dir) !== top && path.resolve(dir).startsWith(top)) {
    try {
      if (readdirSync(dir).length > 0) return
      rmdirSync(dir)
    } catch {
      return
    }
    dir = path.dirname(dir)
  }
}

/** Removes one recorded entry; returns 'removed', 'kept' (changed by a person) or 'gone'. */
function removeEntry(root, rel, entry, dryRun) {
  let file
  try {
    file = abs(root, rel)
  } catch {
    return 'kept'
  }
  const text = readText(file)
  if (text === null) return 'gone'
  if (entry.kind === 'block') {
    const out = removeBlock(text)
    if (!dryRun) {
      if (out === '' && entry.created) {
        unlinkSync(file)
        pruneDirs(root, rel)
      } else writeFileSync(file, out)
    }
    return 'removed'
  }
  if (sha256(text) !== entry.sha256) return 'kept'
  if (!dryRun) {
    unlinkSync(file)
    pruneDirs(root, rel)
  }
  return 'removed'
}

/**
 * Applies a plan. Returns { written, updated, unchanged, kept, conflicts, removed } (paths). With dryRun, nothing is
 * written and the same lists say what would happen. meta goes into the record (agents, skills, format, tool).
 */
export function applyPlan(root, plan, { dryRun = false, meta = {} } = {}) {
  const old = readRecord(root) || { version: 1, files: {} }
  const files = {}
  const res = { written: [], updated: [], unchanged: [], kept: [], conflicts: [], removed: [] }
  for (const op of plan.ops) {
    const file = abs(root, op.path)
    const current = readText(file)
    const rec = old.files[op.path]
    if (op.type === 'block') {
      const next = upsertBlock(current || '', op.text)
      if (current === next) res.unchanged.push(op.path)
      else (current === null ? res.written : res.updated).push(op.path)
      if (!dryRun && current !== next) {
        mkdirSync(path.dirname(file), { recursive: true })
        writeFileSync(file, next)
      }
      files[op.path] = { kind: 'block', created: rec ? rec.created : current === null }
      continue
    }
    if (current === null) {
      res.written.push(op.path)
      if (!dryRun) {
        mkdirSync(path.dirname(file), { recursive: true })
        writeFileSync(file, op.text)
      }
      files[op.path] = { kind: 'file', sha256: sha256(op.text), created: true }
    } else if (current === op.text) {
      res.unchanged.push(op.path)
      files[op.path] = { kind: 'file', sha256: sha256(op.text), created: rec ? rec.created : false }
    } else if (op.type === 'createOnly' || !rec) {
      res.conflicts.push(op.path)
    } else if (sha256(current) !== rec.sha256) {
      res.kept.push(op.path)
      files[op.path] = rec
    } else {
      res.updated.push(op.path)
      if (!dryRun) writeFileSync(file, op.text)
      files[op.path] = { kind: 'file', sha256: sha256(op.text), created: rec.created }
    }
  }
  for (const [rel, entry] of Object.entries(old.files)) {
    if (rel in files) continue
    const r = removeEntry(root, rel, entry, dryRun)
    if (r === 'removed') res.removed.push(rel)
    else if (r === 'kept') {
      res.kept.push(rel)
      files[rel] = entry
    }
  }
  if (!dryRun) writeRecord(root, { version: 1, ...meta, unsafe: undefined, files })
  return res
}

/** Removes everything the record lists. Returns { removed, kept, gone }. */
export function uninstall(root, { dryRun = false } = {}) {
  const record = readRecord(root)
  const res = { removed: [], kept: [], gone: [] }
  if (!record) return res
  for (const [rel, entry] of Object.entries(record.files)) res[removeEntry(root, rel, entry, dryRun)].push(rel)
  if (!dryRun) {
    if (res.kept.length) writeRecord(root, { ...record, unsafe: undefined, files: Object.fromEntries(res.kept.map((k) => [k, record.files[k]])) })
    else {
      try {
        unlinkSync(abs(root, RECORD))
      } catch {
        /* already gone */
      }
    }
  }
  return res
}
