#!/usr/bin/env node
/*
 * Builds the Frontend Skills video from the scenes in this folder. It records the real command on copies of the
 * fixture projects (init, audit, explain, the per-agent files, a project with its own helpers, and the audit after the
 * fixes in fix/), builds the site and screenshots its dictionary, then opens index.html in Playwright at 1920x1080
 * (YouTube) or 1080x1920 (TikTok), steps the scenes frame by frame and encodes the frames to VP9 WebM with the ffmpeg
 * build that ships with Playwright. It also writes the sound track (audio.mjs) and voiceover.md. --live records
 * the page in real time with Playwright's own video recording instead. Nothing is installed; the paths of Playwright
 * and ffmpeg come from PLAYWRIGHT_MODULE and FFMPEG (default: the newest ffmpeg in ~/Library/Caches/ms-playwright).
 * Usage: node media/video/build.mjs [--format youtube,tiktok] [--lang en,pl] [--out <dir>] [--stills 3,40] [--live]
 *        node media/video/build.mjs --voiceover   (rewrites media/video/voiceover.md only)
 */
import { execFileSync, spawn } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { ADAPTERS } from '../../adapters/index.mjs'
import { loadRules, loadSkills, PACKAGE_ROOT } from '../../cli/lib/catalog.mjs'
import { capture, colorize, wrap } from '../../tools/record.mjs'
import { mix, wav } from './audio.mjs'
import { CUES, FPS, SCENES, TOTAL, VOICE } from './timeline.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SHOWN = 'npx github:dawidolko/frontend-skills'
const SIZES = { youtube: { width: 1920, height: 1080, name: 'youtube-16x9' }, tiktok: { width: 1080, height: 1920, name: 'tiktok-9x16' } }
const COLS = { youtube: { init: 84, audit: 84, explain: 84, pass: 52 }, tiktok: { init: 54, audit: 54, explain: 54, pass: 54 } }
const CLI = path.join(PACKAGE_ROOT, 'cli/index.mjs')

const run = (args, cwd) => execFileSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const clock = (s) => `${String(Math.floor(s / 60)).padStart(1, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`

/** The section of a Markdown report that belongs to one rule id. */
function reportSection(report, id) {
  const lines = report.split('\n')
  const from = lines.findIndex((l) => l.startsWith(`### \`${id}\``))
  if (from === -1) throw new Error(`${id} is not in the report`)
  let to = lines.findIndex((l, i) => i > from && /^#{2,3} /.test(l))
  if (to === -1) to = lines.length
  const body = lines.slice(from + 1, to)
  const field = (name) => (body.find((l) => l.startsWith(`${name}: `)) ?? '').slice(name.length + 2)
  return {
    id,
    title: lines[from].replace(/^### `[^`]+` /, ''),
    why: field('Why'),
    fix: field('Fix'),
    sources: [...field('Sources').matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]),
    at: body.filter((l) => l.startsWith('- `')).map((l) => ({ at: l.match(/^- `([^`]+)`/)[1], message: l.replace(/^- `[^`]+` /, '') }))
  }
}

/** Every fact the scenes show, recorded from real runs. Returns data for one format (terminal widths differ). */
export async function record() {
  const tmp = mkdtempSync(path.join(tmpdir(), 'frontend-skills-video-'))
  try {
    const shop = path.join(tmp, 'shop')
    cpSync(path.join(PACKAGE_ROOT, 'fixtures/projects/react-vite'), shop, { recursive: true })
    const before = readFileSync(path.join(shop, 'src/App.tsx'), 'utf8')
    const sessions = {}
    for (const [name, args] of [
      ['init', ['init', '--yes']],
      ['audit', ['audit']],
      ['explain', ['explain', 'a11y/img-alt']]
    ]) {
      const { lines, code } = await capture(args, shop)
      sessions[name] = { command: `${SHOWN} ${args.join(' ')}`, raw: lines.map((l) => l.text), code }
    }
    const report = readFileSync(path.join(shop, 'frontend-report.md'), 'utf8')
    const card = reportSection(report, 'a11y/img-alt')
    cpSync(path.join(HERE, 'fix'), shop, { recursive: true })
    const after = readFileSync(path.join(shop, 'src/App.tsx'), 'utf8')
    const pass = await capture(['audit'], shop)
    sessions.pass = { command: `${SHOWN} audit`, raw: pass.lines.map((l) => l.text), code: pass.code }
    for (const s of Object.values(sessions)) while (s.raw.length && !s.raw[s.raw.length - 1]) s.raw.pop()

    const four = path.join(tmp, 'shop-four')
    cpSync(path.join(PACKAGE_ROOT, 'fixtures/projects/react-vite'), four, { recursive: true })
    const agentIds = ['claude', 'cursor', 'copilot', 'codex']
    run(['init', '--agents', agentIds.join(','), '--yes', '--no-audit'], four)
    const install = JSON.parse(readFileSync(path.join(four, '.frontend-skills/install.json'), 'utf8'))
    const adapters = agentIds.map((id) => ADAPTERS.find((a) => a.id === id))
    const groups = new Map()
    for (const file of [...Object.keys(install.files), '.frontend-skills/profile.json', '.frontend-skills/lessons.md', '.frontend-skills/install.json']) {
      const parts = file.split('/')
      const key = parts.length > 2 ? `${parts[0]}/${parts[1]}/` : file.includes('/') ? `${parts[0]}/` : file
      const g = groups.get(key) ?? { path: key, files: 0, block: install.files[file]?.kind === 'block' }
      g.files++
      groups.set(key, g)
    }
    const readers = (g) => {
      if (g.path === '.frontend-skills/') return adapters.map((a) => a.label)
      return adapters
        .filter((a) => {
          if (a.skillDirs.some((d) => g.path === `${d}/`)) return true
          const instructions = typeof a.instructions === 'function' ? a.instructions(four) : a.instructions
          if (instructions && path.relative(four, path.resolve(four, instructions)) === g.path) return true
          try {
            return a.rule?.({ name: 'x', globs: ['**/*.tsx'], description: 'x', rules: [], body: '' }, { skillPath: () => 'x' })?.path.startsWith(g.path)
          } catch {
            return false
          }
        })
        .map((a) => a.label)
    }
    const agents = {
      ids: agentIds,
      labels: adapters.map((a) => a.label),
      groups: [...groups.values()].map((g) => ({ ...g, readBy: readers(g) })),
      formats: [
        ['Claude Code', '.claude/rules/fe-react.md'],
        ['Cursor', '.cursor/rules/fe-react.mdc'],
        ['GitHub Copilot', '.github/instructions/fe-react.instructions.md']
      ].map(([agent, file]) => ({ agent, file, head: readFileSync(path.join(four, file), 'utf8').split('\n').slice(0, 7) }))
    }

    const helpers = path.join(tmp, 'helpers')
    cpSync(path.join(PACKAGE_ROOT, 'fixtures/projects/scss-helpers'), helpers, { recursive: true })
    run(['init', '--agents', 'claude', '--yes', '--no-audit'], helpers)
    try {
      run(['audit'], helpers)
    } catch {}
    const block = ['CLAUDE.md', 'AGENTS.md']
      .map((f) => path.join(helpers, f))
      .filter(existsSync)
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n')
    const projectLines = block
      .split('### This project')[1]
      .split('<!--')[0]
      .split('\n')
      .filter((l) => l.startsWith('- '))
      .slice(0, 3)
      .map((l) => l.slice(2))
    const helperReport = readFileSync(path.join(helpers, 'frontend-report.md'), 'utf8')
    const conventions = {
      block: projectLines,
      findings: ['css/rem-helper', 'html/project-icons'].map((id) => {
        const s = reportSection(helperReport, id)
        return { id, title: s.title, ...s.at[0] }
      })
    }

    const initRaw = sessions.init.raw
    const stack = (initRaw.find((l) => /^ {2}project: /.test(l)) ?? '').replace(/^ {2}project: /, '')
    const counts = {
      skills: loadSkills().length,
      rules: loadRules().length,
      agents: ADAPTERS.length,
      installed: Number((initRaw.find((l) => l.startsWith('Skills (')) ?? '').match(/\((\d+)\)/)?.[1]),
      files: Number((initRaw.find((l) => l.startsWith('Written ')) ?? '').match(/Written (\d+)/)?.[1])
    }
    const facts = {
      stack: stack.split(', ').join(' · '),
      agents: (initRaw.find((l) => l.startsWith('Agents: ')) ?? '').replace('Agents: ', '').split(', ').join(' · ')
    }
    return { sessions, card, conventions, agents, counts, facts, code: { before, after } }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

const bigrams = (s) => new Set([...s.trim()].map((c, i, a) => c + (a[i + 1] ?? '')))
const similar = (a, b = '') => {
  const x = bigrams(a)
  const y = bigrams(b)
  let both = 0
  for (const g of x) if (y.has(g)) both++
  return (2 * both) / (x.size + y.size || 1)
}

/**
 * A line diff (longest common subsequence). Each run of changed lines is split into edits: every removed line is
 * paired with the most similar added line after the previous pair, and added lines in between join that edit. Rows
 * come out removed-then-added per edit.
 */
export function diff(a, b) {
  const x = a.replace(/\n$/, '').split('\n')
  const y = b.replace(/\n$/, '').split('\n')
  const dp = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0))
  for (let i = x.length - 1; i >= 0; i--)
    for (let j = y.length - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const rows = []
  let hunk = 0
  let dels = []
  let adds = []
  const flush = () => {
    if (!dels.length && !adds.length) return
    let from = 0
    dels.forEach((d, k) => {
      let best = from
      for (let m = from; m < adds.length; m++) if (similar(d, adds[m]) > similar(d, adds[best])) best = m
      const take = k === dels.length - 1 ? adds.slice(from) : adds.slice(from, best + 1)
      rows.push({ text: d, kind: 'del', hunk })
      for (const text of take) rows.push({ text, kind: 'add', hunk })
      from = Math.max(from, best + 1)
      hunk++
    })
    if (!dels.length) {
      for (const text of adds) rows.push({ text, kind: 'add', hunk })
      hunk++
    }
    dels = []
    adds = []
  }
  let i = 0
  let j = 0
  while (i < x.length || j < y.length) {
    if (i < x.length && j < y.length && x[i] === y[j]) {
      flush()
      rows.push({ text: x[i], kind: 'same' })
      i++
      j++
    } else if (j < y.length && (i >= x.length || dp[i][j + 1] >= dp[i + 1][j])) adds.push(y[j++])
    else dels.push(x[i++])
  }
  flush()
  return { rows, hunks: hunk }
}

/** Terminal lines for one format: wrapped at its width and split into coloured spans. */
function forFormat(data, format) {
  const sessions = {}
  for (const [name, s] of Object.entries(data.sessions))
    sessions[name] = { command: s.command, code: s.code, raw: s.raw, lines: s.raw.flatMap((l) => wrap(l, COLS[format][name])).map((l) => colorize(l)) }
  return { ...data, sessions, format, diff: diff(data.code.before, data.code.after) }
}

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG
  const cache = path.join(homedir(), 'Library/Caches/ms-playwright')
  const dirs = existsSync(cache) ? readdirSync(cache).filter((d) => d.startsWith('ffmpeg-')) : []
  for (const d of dirs.sort().reverse())
    for (const bin of ['ffmpeg-mac', 'ffmpeg-linux', 'ffmpeg-win64.exe']) if (existsSync(path.join(cache, d, bin))) return path.join(cache, d, bin)
  throw new Error('no ffmpeg found: set FFMPEG to an ffmpeg with libvpx-vp9 (the one Playwright downloads is enough)')
}

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
}

/** Serves a folder of files under a fake base URL through Playwright, so nothing listens on a port. */
async function serve(context, base, root, { index = true } = {}) {
  const basePath = new URL(base).pathname.replace(/\/$/, '')
  await context.route(`${base}/**`, (route) => {
    const p = decodeURIComponent(new URL(route.request().url()).pathname).slice(basePath.length) || '/'
    let file = path.join(root, p)
    if (index && (p.endsWith('/') || !path.extname(p))) file = path.join(root, p, 'index.html')
    if (!file.startsWith(root) || !existsSync(file)) return route.fulfill({ status: 404, body: 'not found' })
    return route.fulfill({ status: 200, body: readFileSync(file), headers: { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' } })
  })
}

/** Screenshots of the site's dictionary and one rule page, from a local build of site/. */
async function siteShots(chromium, out) {
  const dist = path.join(out, 'site')
  rmSync(dist, { recursive: true, force: true })
  execFileSync(process.execPath, [path.join(PACKAGE_ROOT, 'site/build.mjs'), '--out', dist], { stdio: 'ignore' })
  const shots = path.join(out, 'shots')
  mkdirSync(shots, { recursive: true })
  const browser = await chromium.launch()
  try {
    for (const [device, viewport, scale] of [
      ['desktop', { width: 1440, height: 900 }, 1],
      ['mobile', { width: 390, height: 844 }, 2]
    ]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: scale, colorScheme: 'dark', reducedMotion: 'reduce' })
      await serve(context, 'http://site.local', dist)
      const page = await context.newPage()
      for (const lang of ['en', 'pl']) {
        const prefix = lang === 'pl' ? '/pl' : ''
        for (const [name, p] of [
          ['rules', `${prefix}/rules/`],
          ['rule', `${prefix}/rules/a11y/img-alt/`]
        ]) {
          await page.goto(`http://site.local${p}`)
          await page.waitForLoadState('networkidle')
          await page.screenshot({ path: path.join(shots, `${name}-${device}-${lang}.png`), fullPage: true })
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
  }
  rmSync(dist, { recursive: true, force: true })
  return shots
}

async function openStage(browser, format, lang, data, shots, extra = {}) {
  const { width, height } = SIZES[format]
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...extra })
  await serve(context, 'http://video.local', HERE, { index: false })
  await serve(context, 'http://video.local/fonts', path.join(PACKAGE_ROOT, 'site/assets/fonts'), { index: false })
  await serve(context, 'http://video.local/shots', shots, { index: false })
  await context.addInitScript((d) => {
    window.VIDEO_DATA = d
  }, data)
  const page = await context.newPage()
  page.on('pageerror', (e) => process.stderr.write(`page error: ${e.message}\n`))
  await page.goto(`http://video.local/index.html?format=${format}&lang=${lang}`)
  await page.evaluate(() => window.ready)
  return { context, page }
}

async function renderFrames(page, file, ffmpeg) {
  const ff = spawn(
    ffmpeg,
    [
      '-y',
      '-loglevel',
      'error',
      '-f',
      'image2pipe',
      '-c:v',
      'mjpeg',
      '-framerate',
      String(FPS),
      '-i',
      'pipe:0',
      '-c:v',
      'libvpx-vp9',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '30',
      '-b:v',
      '0',
      '-deadline',
      'good',
      '-cpu-used',
      '4',
      '-row-mt',
      '1',
      '-tile-columns',
      '2',
      '-threads',
      '4',
      file
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
  )
  const done = new Promise((resolve, reject) => ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))))
  const frames = Math.round(TOTAL * FPS)
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS)
    const jpeg = await page.screenshot({ type: 'jpeg', quality: 92 })
    if (!ff.stdin.write(jpeg)) await new Promise((r) => ff.stdin.once('drain', r))
    if (f % (FPS * 10) === 0) process.stdout.write(`  ${path.basename(file)} ${clock(f / FPS)} / ${clock(TOTAL)}\n`)
  }
  ff.stdin.end()
  await done
}

export function voiceoverMarkdown() {
  const rows = VOICE.map((v) => `| ${clock(v.start)}–${clock(v.end)} | ${(v.end - v.start).toFixed(1)} s | ${v.screen} | ${v.pl} | ${v.en} |`)
  const scenes = SCENES.map((s) => `| ${s.id} | ${clock(s.start)} | ${clock(s.end)} | ${s.end - s.start} s |`)
  const cues = CUES.map((c) => `${clock(c.t)} ${c.kind}`).join(' · ')
  return `# Voice-over script

The video is ${clock(TOTAL)} long (${TOTAL} s, ${FPS} frames per second) in both versions: YouTube 16:9 (1920×1080) and
TikTok 9:16 (1080×1920). The picture is the same in both; only the layout changes.

The sound track (\`frontend-skills-soundtrack.wav\`, 48 kHz, 16-bit stereo, as long as the video) holds only light
effects: a whoosh at every scene change and quiet clicks, pops, ticks and chimes at the moments listed below. It peaks
at −10 dBFS, so a voice at normal level sits on top. The slots below are where the narration goes; each line is a
suggestion sized to its slot at a calm pace (about 2.5 words per second). Times are mm:ss.s from the start.

## Narration slots

| Time | Length | On screen | Polski | English |
| --- | ---: | --- | --- | --- |
${rows.join('\n')}

## Scenes

| Scene | Starts | Ends | Length |
| --- | --- | --- | ---: |
${scenes.join('\n')}

## Sound cues

${cues}

## Putting picture, sound and voice together

The build encodes with the ffmpeg that ships with Playwright, which writes video only, so the video files are silent
and the sound track is a separate WAV. Line them up at 0:00.

- **CapCut or DaVinci Resolve**: import the WebM and \`frontend-skills-soundtrack.wav\`, put both at 0:00 on the
  timeline, record or import the voice on a third track using the slots above, export as MP4 (H.264, AAC).
- **ffmpeg** (once installed, for example with \`brew install ffmpeg\`), with the voice in \`voice.wav\`:

\`\`\`sh
ffmpeg -i frontend-skills-youtube-16x9-en.webm -i frontend-skills-soundtrack.wav -i voice.wav \\
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" \\
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart frontend-skills-youtube.mp4
\`\`\`

Without a voice yet: \`ffmpeg -i frontend-skills-youtube-16x9-en.webm -i frontend-skills-soundtrack.wav -map 0:v -map 1:a
-c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest frontend-skills-youtube.mp4\`. The same commands work
for the TikTok file.

## Rebuilding

\`node media/video/build.mjs\` (see \`media/video/README.md\`). The timeline, the lines above and the sound cues all come
from \`media/video/timeline.mjs\`; change them there and run \`node media/video/build.mjs --voiceover\` to rewrite this file.
`
}

async function main(argv) {
  const opt = (name, fallback) => {
    const i = argv.indexOf(name)
    return i === -1 ? fallback : argv[i + 1]
  }
  if (argv.includes('--voiceover')) {
    writeFileSync(path.join(HERE, 'voiceover.md'), voiceoverMarkdown())
    process.stdout.write('media/video/voiceover.md written\n')
    return
  }
  const formats = opt('--format', 'youtube,tiktok').split(',')
  const langs = opt('--lang', 'en').split(',')
  const out = path.resolve(opt('--out', path.join(tmpdir(), 'frontend-skills-video')))
  const stills = opt('--stills', null)?.split(',').map(Number)
  mkdirSync(out, { recursive: true })
  const mod = process.env.PLAYWRIGHT_MODULE
  if (!mod) throw new Error('set PLAYWRIGHT_MODULE to the path of an installed playwright/index.mjs')
  const { chromium } = await import(pathToFileURL(mod).href)

  process.stdout.write('recording the command…\n')
  const data = await record()
  const shots = await siteShots(chromium, out)
  writeFileSync(path.join(out, 'frontend-skills-soundtrack.wav'), wav(mix()))
  writeFileSync(path.join(out, 'voiceover.md'), voiceoverMarkdown())
  const ffmpeg = stills ? null : findFfmpeg()
  const browser = await chromium.launch()
  try {
    for (const format of formats)
      for (const lang of langs) {
        const name = `frontend-skills-${SIZES[format].name}-${lang}`
        const fdata = forFormat(data, format)
        if (stills) {
          const { context, page } = await openStage(browser, format, lang, fdata, shots)
          for (const t of stills) {
            await page.evaluate((x) => window.seek(x), t)
            await page.screenshot({ path: path.join(out, `${name}-${String(t).replace('.', '_')}.png`) })
          }
          await context.close()
          process.stdout.write(`${name}: ${stills.length} stills\n`)
        } else if (argv.includes('--live')) {
          const dir = mkdtempSync(path.join(out, 'live-'))
          const { width, height } = SIZES[format]
          const { context, page } = await openStage(browser, format, lang, fdata, shots, { recordVideo: { dir, size: { width, height } } })
          await page.evaluate(() => window.play())
          await page.waitForTimeout(TOTAL * 1000 + 500)
          const video = page.video()
          await context.close()
          renameSync(await video.path(), path.join(out, `${name}-live.webm`))
          rmSync(dir, { recursive: true, force: true })
          process.stdout.write(`${name}-live.webm\n`)
        } else {
          const { context, page } = await openStage(browser, format, lang, fdata, shots)
          await renderFrames(page, path.join(out, `${name}.webm`), ffmpeg)
          await context.close()
          process.stdout.write(`${name}.webm\n`)
        }
      }
  } finally {
    await browser.close()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2))
