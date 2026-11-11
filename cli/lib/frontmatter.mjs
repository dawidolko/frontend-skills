/*
 * Reads the YAML front matter of SKILL.md and rule.md files with a strict subset of YAML: plain, single-quoted and
 * double-quoted scalars, block lists of scalars or of flat maps, and one level of nested maps. Anything else is an
 * error with a line number, so a file that some agent would read differently is refused here first. Line endings
 * (LF, CRLF, CR) and a byte order mark are accepted. Also serialises such data back for generated files.
 */

const KEY = /^([A-Za-z0-9_][A-Za-z0-9_.-]*):(?:\s+(.*))?$/

export class FrontMatterError extends Error {
  constructor(message, line) {
    super(line ? `line ${line}: ${message}` : message)
    this.line = line
  }
}

/** Normalises line endings to LF and drops a byte order mark. */
export const normalizeText = (text) => text.replace(/^﻿/, '').replace(/\r\n?/g, '\n')

function scalar(raw, line) {
  const v = raw.trim()
  if (v === '') return ''
  if (v.startsWith('"')) {
    if (!/^"(?:[^"\\]|\\.)*"$/.test(v)) throw new FrontMatterError('unterminated double-quoted value', line)
    try {
      return JSON.parse(v)
    } catch {
      throw new FrontMatterError('invalid escape in double-quoted value', line)
    }
  }
  if (v.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/.test(v)) throw new FrontMatterError('unterminated single-quoted value', line)
    return v.slice(1, -1).replace(/''/g, "'")
  }
  if (/^[[{>|&*!%@`]/.test(v)) throw new FrontMatterError(`unsupported YAML syntax "${v[0]}"; quote the value`, line)
  if (/:\s/.test(v) || /\s#/.test(v)) throw new FrontMatterError('a plain value may not contain ": " or " #"; quote it', line)
  return v
}

/**
 * Splits a document into { data, body, bodyLine } where bodyLine is the 1-based line the body starts on.
 * A document without front matter returns data null.
 */
export function parseFrontMatter(input) {
  const text = normalizeText(input)
  if (!text.startsWith('---\n')) return { data: null, body: text, bodyLine: 1 }
  const end = text.indexOf('\n---', 3)
  if (end === -1 || (text[end + 4] !== undefined && text[end + 4] !== '\n')) throw new FrontMatterError('front matter is not closed by a line with ---')
  const lines = text.slice(4, end + 1).split('\n')
  lines.pop()
  const body = text.slice(end + 5)
  const bodyLine = lines.length + 3
  return { data: parseBlock(lines), body, bodyLine }
}

function indentOf(s) {
  const m = /^( *)/.exec(s)
  if (/^ *\t/.test(s)) return -1
  return m[1].length
}

function parseBlock(lines) {
  const data = {}
  let i = 0
  const lineNo = (k) => k + 2
  const skip = (s) => s.trim() === '' || /^\s*#/.test(s)
  while (i < lines.length) {
    const raw = lines[i]
    if (skip(raw)) {
      i++
      continue
    }
    const ind = indentOf(raw)
    if (ind !== 0) throw new FrontMatterError(ind < 0 ? 'tabs are not allowed for indentation' : 'unexpected indentation', lineNo(i))
    const m = KEY.exec(raw)
    if (!m) throw new FrontMatterError(`expected "key: value", got "${raw.trim()}"`, lineNo(i))
    const key = m[1]
    if (Object.hasOwn(data, key)) throw new FrontMatterError(`duplicate key "${key}"`, lineNo(i))
    if (m[2] !== undefined && m[2].trim() !== '') {
      data[key] = scalar(m[2], lineNo(i))
      i++
      continue
    }
    i++
    const children = []
    while (i < lines.length && (skip(lines[i]) || indentOf(lines[i]) > 0)) {
      if (!skip(lines[i])) children.push({ text: lines[i], line: lineNo(i) })
      i++
    }
    data[key] = parseNested(children, key)
  }
  return data
}

function parseNested(children, key) {
  if (children.length === 0) return ''
  const first = children[0].text.trim()
  if (first.startsWith('- ') || first === '-') return parseList(children)
  const map = {}
  const base = indentOf(children[0].text)
  for (const c of children) {
    if (indentOf(c.text) !== base) throw new FrontMatterError(`only one level of nesting is supported under "${key}"`, c.line)
    const m = KEY.exec(c.text.trim())
    if (!m || m[2] === undefined) throw new FrontMatterError('expected "key: value"', c.line)
    if (Object.hasOwn(map, m[1])) throw new FrontMatterError(`duplicate key "${m[1]}"`, c.line)
    map[m[1]] = scalar(m[2], c.line)
  }
  return map
}

function parseList(children) {
  const base = indentOf(children[0].text)
  const items = []
  let current = null
  for (const c of children) {
    const ind = indentOf(c.text)
    const t = c.text.trim()
    if (ind === base && (t.startsWith('- ') || t === '-')) {
      const rest = t.slice(1).trim()
      const m = KEY.exec(rest)
      if (m && m[2] !== undefined && !rest.startsWith('"') && !rest.startsWith("'")) {
        current = { [m[1]]: scalar(m[2], c.line) }
        items.push(current)
      } else {
        current = null
        items.push(scalar(rest, c.line))
      }
    } else if (ind > base && current) {
      const m = KEY.exec(t)
      if (!m || m[2] === undefined) throw new FrontMatterError('expected "key: value" inside a list item', c.line)
      if (Object.hasOwn(current, m[1])) throw new FrontMatterError(`duplicate key "${m[1]}"`, c.line)
      current[m[1]] = scalar(m[2], c.line)
    } else {
      throw new FrontMatterError('unexpected line in a list', c.line)
    }
  }
  return items
}

const needsQuote = (v) => v === '' || /^[\s[\]{}>|&*!%@`#'"-]|[:#]\s|\s$|^(true|false|null|yes|no|~)$/i.test(v) || /:$/.test(v)
const quote = (v) => (needsQuote(String(v)) ? JSON.stringify(String(v)) : String(v))

/** Serialises a flat object (scalars, lists of scalars, one level of maps) as front matter with LF endings. */
export function stringifyFrontMatter(data) {
  const out = ['---']
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue
    if (Array.isArray(v)) {
      out.push(`${k}:`)
      for (const item of v) out.push(`  - ${quote(item)}`)
    } else if (typeof v === 'object') {
      out.push(`${k}:`)
      for (const [k2, v2] of Object.entries(v)) out.push(`  ${k2}: ${quote(v2)}`)
    } else out.push(`${k}: ${quote(v)}`)
  }
  out.push('---')
  return `${out.join('\n')}\n`
}
