/*
 * Detects the project's own front-end helpers, so rules and skills can follow the project instead of a generic
 * default: a Sass px-to-rem function (rem-calc, rem, px-to-rem…) or a build step that converts px to rem, icons built
 * into CSS classes (an icon font) or into an SVG sprite, design token files, and a set of CSS custom properties.
 * Each helper has a stable id (HELPER_IDS); a rule may require one (`requires:` in rule.md) and name it in its fix
 * with a placeholder such as {{rem-function.name|your rem helper}}. Entries a person adds to profile.helpers with
 * "source": "person" are kept when the profile is refreshed. Reads at most a few hundred style files, no network.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

export const HELPER_IDS = ['rem-function', 'px-to-rem-build', 'icon-classes', 'icon-sprite', 'design-tokens', 'custom-properties']

const SKIP = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '.next',
  '.nuxt',
  '.output',
  '.svelte-kit',
  '.astro',
  'coverage',
  'vendor',
  '.frontend-skills'
])
const MAX_FILES = 400
const MAX_BYTES = 200 * 1024

const REM_NAMES = /^(rem-calc|rem|to-rem|torem|px-to-rem|pxtorem|px2rem|rem-convert|convert-to-rem|calc-rem|rem-from-px|rems?)$/i
const ICON_FONT_TOOLS = [
  'fantasticon',
  'svgtofont',
  'webfonts-generator',
  'gulp-iconfont',
  'gulp-iconfont-css',
  'icon-font-generator',
  '@iconify/tailwind',
  '@iconify/tailwind4',
  '@egoist/tailwindcss-icons'
]
const ICON_SPRITE_TOOLS = [
  'svg-sprite',
  'svgstore',
  'gulp-svgstore',
  'gulp-svg-sprite',
  'vite-plugin-svg-icons',
  'svg-sprite-loader',
  'vite-svg-sprite-wrapper',
  'svg-spritemap-webpack-plugin',
  '@spiriit/vite-plugin-svg-spritemap'
]
const PX_TO_REM_BUILD = ['postcss-pxtorem', 'postcss-rem', 'postcss-px-to-rem', 'postcss-pxtorem-plus']
const TOKEN_TOOLS = ['style-dictionary', '@tokens-studio/sd-transforms', 'token-transformer', '@terrazzo/cli', 'theo']

const read = (p, max = MAX_BYTES) => {
  try {
    const st = statSync(p)
    if (st.size > max) return ''
    return readFileSync(p, 'utf8')
  } catch {
    return ''
  }
}
const readJson = (p) => {
  try {
    return JSON.parse(read(p).replace(/^﻿/, ''))
  } catch {
    return null
  }
}

function listFiles(root) {
  const out = { styles: [], tokens: [], svgDirs: new Map(), configs: [] }
  const visit = (dir, rel, depth) => {
    if (depth > 6 || out.styles.length > MAX_FILES) return
    let entries = []
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      if (SKIP.has(e.name) || (e.name.startsWith('.') && !/^\.fantasticonrc/.test(e.name))) continue
      const r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) visit(path.join(dir, e.name), r, depth + 1)
      else if (/\.(scss|sass|less|css)$/i.test(e.name)) out.styles.push(r)
      else if (/(^|\.)tokens?\.json$|\.tokens$/i.test(e.name) || (/\.json$/i.test(e.name) && /(^|\/)tokens\//.test(r))) out.tokens.push(r)
      else if (/\.svg$/i.test(e.name)) out.svgDirs.set(rel, (out.svgDirs.get(rel) || 0) + 1)
      else if (/^(\.fantasticonrc(\.\w+)?|svgtofont\.config\.\w+|style-dictionary\.config\.\w+|sd\.config\.\w+|postcss\.config\.\w+)$/.test(e.name))
        out.configs.push(r)
    }
  }
  visit(root, '', 0)
  return out
}

const lineAt = (text, index) => text.slice(0, index).split('\n').length

/** Detects the helpers of the project at root. Returns { [helperId]: record }. */
export function detectHelpers(root) {
  const pkg = readJson(path.join(root, 'package.json')) || {}
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
  const scripts = Object.entries(pkg.scripts || {})
  const files = listFiles(root)
  const helpers = {}

  /* rem-function: a Sass/Less function whose name says px-to-rem, or Foundation's rem-calc. */
  let best = null
  const uses = new Map()
  for (const rel of files.styles.filter((f) => /\.(scss|sass|less)$/i.test(f))) {
    const text = read(path.join(root, ...rel.split('/'))).replace(/\r\n?/g, '\n')
    for (const m of text.matchAll(/@function\s+([\w-]+)\s*\(/g))
      if (REM_NAMES.test(m[1]) && !best) best = { name: m[1], file: rel, line: lineAt(text, m.index) }
    for (const m of text.matchAll(/\b(rem-calc|rem|to-rem|px-to-rem|pxtorem|px2rem)\(\s*-?\d/g)) uses.set(m[1], (uses.get(m[1]) || 0) + 1)
  }
  if (!best && 'foundation-sites' in deps && (uses.get('rem-calc') || 0) > 0) best = { name: 'rem-calc', file: 'node_modules/foundation-sites', line: null }
  if (best)
    helpers['rem-function'] = {
      kind: 'sass-function',
      name: best.name,
      call: `${best.name}(16px)`,
      file: best.file,
      line: best.line,
      uses: uses.get(best.name) || 0,
      source: 'detected'
    }

  /* px-to-rem-build: a PostCSS plugin converts px at build time, so px in source is the convention. */
  const build =
    PX_TO_REM_BUILD.find((d) => d in deps) ||
    files.configs
      .filter((c) => /postcss\.config/.test(c))
      .map((c) => PX_TO_REM_BUILD.find((p) => read(path.join(root, ...c.split('/'))).includes(p)))
      .find(Boolean)
  if (build) helpers['px-to-rem-build'] = { kind: 'postcss-plugin', tool: build, source: 'detected' }

  /* icon-classes: an icon font or class-based icon build; prefix from its config or from the generated CSS. */
  const fontTool = ICON_FONT_TOOLS.find((d) => d in deps) || ICON_FONT_TOOLS.find((t) => scripts.some(([, s]) => s.includes(t)))
  let prefix = null
  let inputDir = null
  for (const c of files.configs.filter((x) => /fantasticonrc|svgtofont/.test(x))) {
    const t = read(path.join(root, ...c.split('/')))
    prefix = prefix || /["']?(?:prefix|classNamePrefix)["']?\s*:\s*["']([\w-]+)["']/.exec(t)?.[1] || null
    inputDir = inputDir || /["']?(?:inputDir|src)["']?\s*:\s*["']([^"']+)["']/.exec(t)?.[1] || null
  }
  let generated = null
  for (const rel of files.styles) {
    const t = read(path.join(root, ...rel.split('/')))
    const m = /\.([a-z][\w]*-)[\w-]+:{1,2}before\s*\{\s*content:\s*["']\\[ef][0-9a-f]{3}/i.exec(t)
    if (m) {
      generated = { file: rel, prefix: m[1] }
      break
    }
  }
  if (fontTool || generated) {
    const p = (prefix ? `${prefix.replace(/-$/, '')}-` : null) || generated?.prefix || (fontTool === 'fantasticon' ? 'icon-' : null)
    const dir = inputDir?.replace(/^\.\//, '').replace(/\/$/, '') || guessIconDir(files.svgDirs)
    helpers['icon-classes'] = {
      kind: 'icon-font',
      tool: fontTool || 'generated CSS',
      prefix: p,
      sourceDir: dir,
      cssFile: generated?.file || null,
      example: p ? `${p}<name>` : null,
      source: 'detected'
    }
  }

  /* icon-sprite: SVG files combined into one sprite used with <use href="#id">. */
  const spriteTool = ICON_SPRITE_TOOLS.find((d) => d in deps) || ICON_SPRITE_TOOLS.find((t) => scripts.some(([, s]) => s.includes(t)))
  if (spriteTool) helpers['icon-sprite'] = { kind: 'svg-sprite', tool: spriteTool, sourceDir: guessIconDir(files.svgDirs), source: 'detected' }

  /* design-tokens: token files, with the tool that builds them. */
  const tokenTool = TOKEN_TOOLS.find((d) => d in deps) || (files.configs.some((c) => /style-dictionary|sd\.config/.test(c)) ? 'style-dictionary' : null)
  if (files.tokens.length || tokenTool)
    helpers['design-tokens'] = { kind: 'token-files', tool: tokenTool, files: files.tokens.slice(0, 10), source: 'detected' }

  /* custom-properties: a set of --variables declared on :root (5 or more). */
  let props = null
  for (const rel of files.styles) {
    const t = read(path.join(root, ...rel.split('/')))
    const roots = [...t.matchAll(/:root[^{]*\{([^}]*)\}/g)].map((m) => m[1]).join('\n')
    const names = [...roots.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1])
    if (names.length >= 5 && (!props || names.length > props.count)) {
      const prefixes = {}
      for (const n of names) {
        const p = /^--[a-z0-9]+-/i.exec(n)?.[0]
        if (p) prefixes[p] = (prefixes[p] || 0) + 1
      }
      props = {
        kind: 'custom-properties',
        file: rel,
        count: names.length,
        prefixes: Object.entries(prefixes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([p]) => `${p}*`),
        source: 'detected'
      }
    }
  }
  if (props) helpers['custom-properties'] = props
  return sanitizeHelpers(helpers)
}

function guessIconDir(svgDirs) {
  let best = null
  for (const [dir, n] of svgDirs) if (/(^|\/)(icons?|svg-icons|sprite)$/i.test(dir) && (!best || n > best[1])) best = [dir, n]
  return best ? best[0] : null
}

/*
 * Values read from project files end up in the instruction block that agents read, so each one is kept only when it
 * is plain: a name, a prefix or a relative path of ordinary characters, at most 120 long.
 */
const PLAIN = /^[\w@./<>()-]{1,120}$/
export function sanitizeHelpers(helpers) {
  const out = {}
  for (const [id, h] of Object.entries(helpers || {})) {
    if (!HELPER_IDS.includes(id) || !h || typeof h !== 'object') continue
    const clean = {}
    for (const [k, v] of Object.entries(h)) {
      if (typeof v === 'number' || v === null || typeof v === 'boolean') clean[k] = v
      else if (typeof v === 'string') {
        if (PLAIN.test(v) && !v.includes('..')) clean[k] = v
      } else if (Array.isArray(v)) clean[k] = v.filter((x) => typeof x === 'string' && PLAIN.test(x) && !x.includes('..')).slice(0, 10)
    }
    out[id] = clean
  }
  return out
}

/** Merges fresh detection with the previous profile: entries a person added (source "person") win. */
export function mergeHelpers(detected, previous = {}) {
  const out = { ...detected }
  for (const [id, h] of Object.entries(previous || {})) if (h && h.source === 'person') out[id] = h
  return sanitizeHelpers(out)
}

/**
 * Fills {{helper.field|fallback}} placeholders in rule or skill text from the profile's helpers; without the helper,
 * the fallback (or the generic phrase after the bar) is used.
 */
export function fillHelpers(text, helpers = {}) {
  return String(text).replace(/\{\{([\w-]+)\.([\w-]+)(?:\|([^}]*))?\}\}/g, (all, id, field, fallback) => {
    const v = helpers?.[id]?.[field]
    return v === undefined || v === null ? (fallback ?? all) : String(v)
  })
}

/** One line per helper for the always-on instruction block. */
export function helperLines(helpers = {}) {
  const L = []
  const h = sanitizeHelpers(helpers)
  if (h['rem-function']) L.push(`- Sizes: write rem with \`${h['rem-function'].name}()\` (defined in \`${h['rem-function'].file}\`), not raw px.`)
  if (h['px-to-rem-build']) L.push(`- Sizes: px is converted to rem at build time by \`${h['px-to-rem-build'].tool}\`; write px.`)
  if (h['icon-classes'])
    L.push(
      `- Icons: use the generated classes${h['icon-classes'].prefix ? ` \`${h['icon-classes'].prefix}<name>\`` : ''}${h['icon-classes'].sourceDir ? `; add a new icon as an SVG in \`${h['icon-classes'].sourceDir}\` and rebuild` : ''} (${h['icon-classes'].tool}).`
    )
  if (h['icon-sprite'])
    L.push(
      `- Icons: use the SVG sprite (\`<svg><use href="#name"></use></svg>\`)${h['icon-sprite'].sourceDir ? ` built from \`${h['icon-sprite'].sourceDir}\`` : ''} (${h['icon-sprite'].tool}).`
    )
  if (h['design-tokens'])
    L.push(
      `- Design tokens${h['design-tokens'].tool ? ` (${h['design-tokens'].tool})` : ''}: take colours, spacing and type from ${
        h['design-tokens'].files.length
          ? h['design-tokens'].files
              .slice(0, 3)
              .map((f) => `\`${f}\``)
              .join(', ')
          : 'the token files'
      }; never hard-code them.`
    )
  if (h['custom-properties'])
    L.push(
      `- Custom properties: reuse the ${h['custom-properties'].count} variables in \`${h['custom-properties'].file}\` (${h['custom-properties'].prefixes.join(', ')}) before adding values.`
    )
  return L
}
