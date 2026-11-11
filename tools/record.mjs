#!/usr/bin/env node
/*
 * Records real terminal sessions of the command for the README. Each recording copies a fixture project to a
 * temporary folder, runs one command of this repository's CLI there, captures its output with the time each chunk
 * arrived, and writes docs/media/<name>.svg: a looping terminal animation in pure CSS (typed command, output lines
 * appearing in order, scrolling), with no script and no external font, so GitHub renders it. With --png it also
 * writes docs/media/<name>.png, the final screen, through Playwright; Playwright is not a dependency, so pass the
 * path of an installed copy in PLAYWRIGHT_MODULE (for example .../node_modules/playwright/index.mjs).
 * Usage: node tools/record.mjs [--only init,audit,explain] [--out docs/media] [--png]
 */
import { spawn } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { PACKAGE_ROOT, RULE_AREAS } from '../cli/lib/catalog.mjs'

const SHOWN = 'npx github:dawidolko/frontend-skills'
const FIXTURE = 'fixtures/projects/react-vite'
const PROJECT = 'shop'

/** The sessions, in the order they run in one project (audit and explain need the profile init writes). */
export const SESSIONS = [
  { name: 'init', args: ['init', '--yes'], title: 'init: learn the stack, install for each agent, first audit' },
  { name: 'audit', args: ['audit'], title: 'audit: findings with rule ids, file and line' },
  { name: 'explain', args: ['explain', 'a11y/img-alt'], title: 'explain: why, fix, examples and sources' }
]

const COLS = 96
const ROWS = 26
const FONT = 14
const CHAR = FONT * 0.6
const LINE = 20
const PAD = 18
const BAR = 34
const WIDTH = Math.round(COLS * CHAR + PAD * 2)
const HEIGHT = BAR + PAD + ROWS * LINE + PAD - 6

const TYPE_MS = 42
const LINE_MS = 34
const HOLD_MS = 6500
const START_MS = 700

const COLORS = {
  bg: '#0d0d0f',
  bar: '#1b1920',
  line: '#3a3442',
  ink: '#f0f0f0',
  muted: '#a9a1b2',
  accent: '#d264f5',
  id: '#e7a6ff',
  path: '#8fd3ff',
  num: '#f3d36b',
  good: '#6fdc8c',
  critical: '#ff8a8a',
  serious: '#ffb26b',
  moderate: '#f3d36b',
  minor: '#c4bdcb'
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Wraps one output line at COLS, at a space when there is one; list items and indented lines indent their continuation. */
export function wrap(line, cols = COLS) {
  const out = []
  const lead = line.match(/^ */)[0].length
  const indent = ' '.repeat(Math.min(lead + (/^ *(- |\S+ +\(\d+\):)/.test(line) || lead ? 2 : 0), 12))
  let rest = line
  while (rest.length > cols) {
    let cut = rest.lastIndexOf(' ', cols)
    if (cut <= indent.length) cut = cols
    out.push(rest.slice(0, cut))
    rest = indent + rest.slice(cut).trimStart()
  }
  out.push(rest)
  return out
}

const ID_RE = new RegExp(`\\b(?:${RULE_AREAS.join('|')})\\/[a-z0-9-]+\\b`)
const TOKENS = [
  [/https?:\/\/\S+/, 'u'],
  [/\b(?:critical)\b/, 'c'],
  [/\b(?:serious)\b/, 's'],
  [/\b(?:moderate)\b/, 'm'],
  [/\b(?:minor)\b/, 'n'],
  [/(?:\.?[\w@-]+\/)+[\w.@-]+(?::\d+)?/, 'p'],
  [/\b[\w-]+\.(?:md|json|tsx?|css|html|mdc)\b(?::\d+)?/, 'p'],
  [/~\d+/, 'k'],
  [/\b\d+×/, 'k']
]

/** Splits a line into [text, class] spans for colouring. */
export function colorize(line) {
  if (/^(Why|Fix|Examples|Sources)$/.test(line)) return [[line, 'h']]
  if (/^Failed:/.test(line)) return [[line, 'c']]
  if (/^(Written|Dry run|Every|Passed)/.test(line)) return [[line, 'g']]
  if (/^```/.test(line)) return [[line, 'd']]
  const spans = []
  let rest = line
  while (rest.length) {
    let best = null
    for (const [re, cls] of [[ID_RE, 'i'], ...TOKENS]) {
      const m = re.exec(rest)
      if (m && (!best || m.index < best.index || (m.index === best.index && m[0].length > best.text.length))) best = { index: m.index, text: m[0], cls }
    }
    if (!best) {
      spans.push([rest, ''])
      break
    }
    if (best.index) spans.push([rest.slice(0, best.index), ''])
    spans.push([best.text, best.cls])
    rest = rest.slice(best.index + best.text.length)
  }
  return spans
}

/** Runs the CLI with the given arguments in cwd; returns the output lines with the ms each arrived after the start. */
export function capture(args, cwd) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint()
    const child = spawn(process.execPath, [path.join(PACKAGE_ROOT, 'cli/index.mjs'), ...args], {
      cwd,
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }
    })
    const lines = []
    let pending = ''
    const take = (chunk) => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6
      const parts = (pending + chunk.toString('utf8')).split('\n')
      pending = parts.pop()
      for (const text of parts) lines.push({ text: text.replace(/\s+$/, ''), ms })
    }
    child.stdout.on('data', take)
    child.stderr.on('data', take)
    child.on('error', reject)
    child.on('close', (code) => {
      if (pending) lines.push({ text: pending, ms: Number(process.hrtime.bigint() - start) / 1e6 })
      resolve({ lines, code })
    })
  })
}

const pct = (ms, total) => `${((ms / total) * 100).toFixed(3).replace(/\.?0+$/, '')}%`

function textLine(spans, x, y, extra = '') {
  const body = spans.map(([t, c]) => (c ? `<tspan class="${c}">${esc(t)}</tspan>` : esc(t))).join('')
  return `<text x="${x}" y="${y}"${extra}>${body}</text>`
}

/**
 * Builds the SVG. With animate=false it draws the final screen only (for the PNG). Timeline: the prompt and a
 * blinking cursor, the command typed, output lines at their captured time (paced so a person can follow), the
 * closing prompt, then a hold before the loop restarts.
 */
export function render({ title, command, lines }, { animate = true } = {}) {
  const prompt = `~/${PROJECT} $ `
  const rows = [
    {
      spans: [
        [prompt, 'a'],
        [command, '']
      ],
      at: 0,
      command: true
    }
  ]
  const typeEnd = START_MS + command.length * TYPE_MS
  const outStart = typeEnd + 350
  let i = 0
  for (const line of lines) {
    for (const part of wrap(line.text)) {
      rows.push({ spans: colorize(part), at: outStart + Math.max(line.ms, i * LINE_MS) })
      i++
    }
  }
  const promptAt = rows[rows.length - 1].at + 500
  rows.push({ spans: [[prompt, 'a']], at: promptAt })
  const total = Math.round(promptAt + HOLD_MS)
  const top = BAR + PAD + FONT
  const x = PAD
  const shift = Math.max(0, rows.length - ROWS)
  const css = [
    `text{font:${FONT}px ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;fill:${COLORS.ink};white-space:pre}`,
    `.a{fill:${COLORS.accent};font-weight:700}.i{fill:${COLORS.id}}.p{fill:${COLORS.path}}.k{fill:${COLORS.num}}.u{fill:${COLORS.muted};text-decoration:underline}`,
    `.c{fill:${COLORS.critical};font-weight:700}.s{fill:${COLORS.serious};font-weight:700}.m{fill:${COLORS.moderate}}.n{fill:${COLORS.minor}}`,
    `.g{fill:${COLORS.good};font-weight:700}.h{fill:${COLORS.accent};font-weight:700}.d{fill:${COLORS.muted}}.t{fill:${COLORS.muted};font-size:12px}`
  ]
  const body = []
  if (animate) {
    css.push(`.r{opacity:0;animation:${total}ms step-end infinite}`)
    css.push(`.cur{animation:1s step-end infinite blink}@keyframes blink{50%{opacity:0}}`)
    css.push(`@media (prefers-reduced-motion:reduce){.r,.v,.w{animation:none!important;opacity:1}.v{transform:translateY(-${shift * LINE}px)}.w{display:none}}`)
  }
  rows.forEach((row, n) => {
    const y = top + n * LINE
    if (!animate) {
      body.push(textLine(row.spans, x, y))
      return
    }
    if (row.command) {
      body.push(textLine(row.spans, x, y))
      return
    }
    css.push(`@keyframes r${n}{0%{opacity:0}${pct(row.at, total)}{opacity:1}}`)
    body.push(textLine(row.spans, x, y, ` class="r" style="animation-name:r${n}"`))
  })
  const contentTop = BAR + PAD - 1
  const clip = `<clipPath id="v"><rect x="0" y="${contentTop}" width="${WIDTH}" height="${HEIGHT - contentTop - 4}"/></clipPath>`
  let scroll = ''
  let typing = ''
  if (animate) {
    const steps = ['0%{transform:translateY(0)}']
    rows.forEach((row, n) => {
      if (n >= ROWS) steps.push(`${pct(row.at, total)}{transform:translateY(-${(n - ROWS + 1) * LINE}px)}`)
    })
    css.push(`.v{animation:${total}ms step-end infinite scroll}@keyframes scroll{${steps.join('')}}`)
    const cx = x + prompt.length * CHAR
    const keys = [`0%{transform:translateX(0)}`]
    for (let c = 1; c <= command.length; c++) keys.push(`${pct(START_MS + c * TYPE_MS, total)}{transform:translateX(${(c * CHAR).toFixed(1)}px)}`)
    keys.push(`${pct(outStart, total)}{transform:translateX(${(command.length * CHAR).toFixed(1)}px);opacity:0}`)
    css.push(`.w{animation:${total}ms step-end infinite type}@keyframes type{${keys.join('')}}`)
    typing = `<g class="w"><rect x="${cx.toFixed(1)}" y="${top - FONT}" width="${WIDTH}" height="${LINE}" fill="${COLORS.bg}"/><rect class="cur" x="${cx.toFixed(1)}" y="${top - FONT + 1}" width="${CHAR.toFixed(1)}" height="${FONT + 3}" fill="${COLORS.accent}"/></g>`
  } else if (shift) {
    scroll = ` transform="translate(0 -${shift * LINE})"`
  }
  const dots = ['#ff5f57', '#febc2e', '#28c840'].map((f, n) => `<circle cx="${PAD + n * 18}" cy="${BAR / 2}" r="5.5" fill="${f}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${esc(`Terminal recording of frontend-skills ${title}`)}">
<title>${esc(`frontend-skills ${title}`)}</title>
<style>${css.join('')}</style>
<rect width="${WIDTH}" height="${HEIGHT}" rx="10" fill="${COLORS.bg}"/>
<rect x=".5" y=".5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="10" fill="none" stroke="${COLORS.line}"/>
<path d="M0 10a10 10 0 0 1 10-10h${WIDTH - 20}a10 10 0 0 1 10 10v${BAR - 10}h-${WIDTH}z" fill="${COLORS.bar}"/>
${dots}<text class="t" x="${WIDTH / 2}" y="${BAR / 2 + 4}" text-anchor="middle">${esc(`frontend-skills ${title.split(':')[0]} · ~/${PROJECT}`)}</text>
${clip}<g clip-path="url(#v)"><g class="v"${scroll}>
${body.join('\n')}
${typing}</g></g>
</svg>
`
}

async function toPng(svg, file) {
  const mod = process.env.PLAYWRIGHT_MODULE
  if (!mod) throw new Error('--png needs PLAYWRIGHT_MODULE, the path of an installed playwright/index.mjs')
  const { chromium } = await import(pathToFileURL(mod).href)
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 2 })
    await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}</style>${svg}`)
    await page.locator('svg').screenshot({ path: file, omitBackground: true })
  } finally {
    await browser.close()
  }
}

async function main(argv) {
  const opt = (name) => {
    const i = argv.indexOf(name)
    return i === -1 ? null : argv[i + 1]
  }
  const only = opt('--only')?.split(',')
  const out = path.resolve(PACKAGE_ROOT, opt('--out') ?? 'docs/media')
  mkdirSync(out, { recursive: true })
  const tmp = mkdtempSync(path.join(tmpdir(), 'frontend-skills-record-'))
  const cwd = path.join(tmp, PROJECT)
  try {
    cpSync(path.join(PACKAGE_ROOT, FIXTURE), cwd, { recursive: true })
    for (const s of SESSIONS) {
      const { lines, code } = await capture(s.args, cwd)
      if (only && !only.includes(s.name)) continue
      while (lines.length && !lines[lines.length - 1].text) lines.pop()
      const session = { title: s.title, command: `${SHOWN} ${s.args.join(' ')}`, lines }
      const svg = render(session)
      writeFileSync(path.join(out, `${s.name}.svg`), svg)
      let note = `${s.name}.svg ${(svg.length / 1024).toFixed(1)} KB, ${lines.length} lines, exit ${code}`
      if (argv.includes('--png')) {
        await toPng(render(session, { animate: false }), path.join(out, `${s.name}.png`))
        note += `, ${s.name}.png`
      }
      process.stdout.write(`${note}\n`)
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2))
