/*
 * Lists the files an audit reads and tells what kind each one is. In a git repository it asks git for tracked and
 * untracked-but-not-ignored files (so .gitignore is respected); elsewhere it walks the folder. Build output,
 * dependencies, caches and the folders this tool and the coding agents write are always skipped. Paths are
 * returned relative to the root with "/" separators on every platform. --changed uses changedFiles().
 */

import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

export const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.output', '.svelte-kit', '.astro', '.vercel',
  '.netlify', 'coverage', 'vendor', '.cache', '.turbo', '.parcel-cache', 'storybook-static', '.angular',
  '.frontend-skills', '.claude', '.agents', '.cursor', '.github', '.windsurf', '.gemini', '.opencode', '.clinerules',
  '.roo', '.kiro', '.junie', '.continue', '.devin', '.zed'
])

const KINDS = [
  [/\.component\.html$/i, 'angular'],
  [/\.html?$/i, 'html'],
  [/\.(jsx|tsx)$/i, 'jsx'],
  [/\.js$/i, 'jsx'],
  [/\.vue$/i, 'vue'],
  [/\.svelte$/i, 'svelte'],
  [/\.astro$/i, 'astro'],
  [/\.css$/i, 'css'],
  [/\.scss$/i, 'scss'],
  [/\.less$/i, 'less'],
  [/\.(png|jpe?g|gif|webp|avif|bmp|tiff?)$/i, 'image'],
  [/\.svg$/i, 'svg'],
  [/\.(woff2?|ttf|otf|eot)$/i, 'font']
]

/** The kind of a file from its name, or null when the audit does not read it. */
export function kindOf(file) {
  if (/\.min\.(js|css)$/i.test(file)) return null
  for (const [re, kind] of KINDS) if (re.test(file)) return kind
  return null
}

export const MARKUP_KINDS = ['html', 'angular', 'vue', 'svelte', 'astro', 'jsx']
export const STYLE_KINDS = ['css', 'scss', 'less']

const toPosix = (p) => p.split(path.sep).join('/')
const skipped = (rel) => rel.split('/').some((part) => SKIP_DIRS.has(part))

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 })
}

function walk(root) {
  const out = []
  const visit = (dir, rel, depth) => {
    if (depth > 12 || out.length > 50000) return
    let entries = []
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      if (SKIP_DIRS.has(e.name)) continue
      const r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) visit(path.join(dir, e.name), r, depth + 1)
      else if (e.isFile()) out.push(r)
    }
  }
  visit(root, '', 0)
  return out
}

/** Every file under root the audit may read, as { path, kind, size }. */
export function listFiles(root) {
  let files
  try {
    files = git(root, ['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
      .split('\0')
      .filter(Boolean)
  } catch {
    files = walk(root)
  }
  const out = []
  for (const rel of files) {
    const p = toPosix(rel)
    if (skipped(p)) continue
    const kind = kindOf(p)
    if (!kind) continue
    let size = 0
    try {
      const st = statSync(path.join(root, p))
      if (!st.isFile()) continue
      size = st.size
    } catch {
      continue
    }
    out.push({ path: p, kind, size })
  }
  return out.sort((a, b) => (a.path < b.path ? -1 : 1))
}

/** Files changed against base (default HEAD): staged, unstaged and untracked. Null outside a git repository. */
export function changedFiles(root, base = 'HEAD') {
  try {
    const diff = git(root, ['diff', '--name-only', '-z', '--relative', '--end-of-options', base])
    const untracked = git(root, ['ls-files', '-z', '--others', '--exclude-standard'])
    return new Set([...diff.split('\0'), ...untracked.split('\0')].filter(Boolean).map(toPosix))
  } catch {
    return null
  }
}

/** Build output folders that exist, for the bundle summary. */
export function buildDirs(root) {
  const out = []
  for (const d of ['dist', 'build', 'out', '.next/static', '.output/public', 'public/build']) {
    try {
      if (statSync(path.join(root, d)).isDirectory()) out.push(d)
    } catch {
      /* not there */
    }
  }
  return out
}
