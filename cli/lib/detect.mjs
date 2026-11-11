/*
 * Detects a project's front-end stack in one pass over its files, with no network: package manager, workspaces of
 * a monorepo, frameworks and their versions, TypeScript, styling, test, build, lint, data and i18n tools, and plain
 * HTML sites with no package.json. Also detects which coding agents the project already uses. The result feeds the
 * project profile (docs/architecture.md); STACK_KEYS lists every key it can produce, and docs/skills-plan.md
 * repeats that list for skill authors.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

export const STACK_KEYS = [
  'web',
  'html',
  'react',
  'next',
  'preact',
  'vue',
  'nuxt',
  'angular',
  'svelte',
  'sveltekit',
  'astro',
  'solid',
  'lit',
  'webc',
  'tailwind',
  'sass',
  'less',
  'css-modules',
  'typescript',
  'vite',
  'webpack',
  'vitest',
  'jest',
  'playwright',
  'cypress',
  'testing-library',
  'storybook',
  'eslint',
  'prettier',
  'biome',
  'tanstack-query',
  'swr',
  'redux',
  'zustand',
  'pinia',
  'jotai',
  'i18n'
]

/* package name -> [group, key]; the first matching package of a key gives its version. */
const PACKAGES = [
  ['next', 'frameworks', 'next'],
  ['react', 'frameworks', 'react'],
  ['preact', 'frameworks', 'preact'],
  ['nuxt', 'frameworks', 'nuxt'],
  ['vue', 'frameworks', 'vue'],
  ['@angular/core', 'frameworks', 'angular'],
  ['@sveltejs/kit', 'frameworks', 'sveltekit'],
  ['svelte', 'frameworks', 'svelte'],
  ['astro', 'frameworks', 'astro'],
  ['solid-js', 'frameworks', 'solid'],
  ['lit', 'frameworks', 'lit'],
  ['tailwindcss', 'styling', 'tailwind'],
  ['sass', 'styling', 'sass'],
  ['sass-embedded', 'styling', 'sass'],
  ['less', 'styling', 'less'],
  ['vitest', 'testing', 'vitest'],
  ['jest', 'testing', 'jest'],
  ['@playwright/test', 'testing', 'playwright'],
  ['playwright', 'testing', 'playwright'],
  ['cypress', 'testing', 'cypress'],
  ['@testing-library/react', 'testing', 'testing-library'],
  ['@testing-library/vue', 'testing', 'testing-library'],
  ['@testing-library/svelte', 'testing', 'testing-library'],
  ['@testing-library/angular', 'testing', 'testing-library'],
  ['@testing-library/dom', 'testing', 'testing-library'],
  ['storybook', 'testing', 'storybook'],
  ['vite', 'build', 'vite'],
  ['webpack', 'build', 'webpack'],
  ['eslint', 'linting', 'eslint'],
  ['prettier', 'linting', 'prettier'],
  ['@biomejs/biome', 'linting', 'biome'],
  ['@tanstack/react-query', 'data', 'tanstack-query'],
  ['@tanstack/vue-query', 'data', 'tanstack-query'],
  ['@tanstack/svelte-query', 'data', 'tanstack-query'],
  ['@tanstack/angular-query-experimental', 'data', 'tanstack-query'],
  ['swr', 'data', 'swr'],
  ['@reduxjs/toolkit', 'data', 'redux'],
  ['redux', 'data', 'redux'],
  ['zustand', 'data', 'zustand'],
  ['pinia', 'data', 'pinia'],
  ['jotai', 'data', 'jotai'],
  ['next-intl', 'i18n', 'i18n'],
  ['react-i18next', 'i18n', 'i18n'],
  ['i18next', 'i18n', 'i18n'],
  ['vue-i18n', 'i18n', 'i18n'],
  ['@nuxtjs/i18n', 'i18n', 'i18n'],
  ['@angular/localize', 'i18n', 'i18n'],
  ['svelte-i18n', 'i18n', 'i18n'],
  ['typescript', 'typescript', 'typescript']
]

/* Build tools implied by a framework even without a direct dependency. */
const IMPLIED_BUILD = { next: 'next', nuxt: 'nuxt', angular: 'angular', sveltekit: 'vite', astro: 'astro' }

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.output', '.svelte-kit', 'coverage', 'vendor', '.frontend-skills'])

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''))
  } catch {
    return null
  }
}
const read = (file) => {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}
const isDir = (p) => {
  try {
    return statSync(p).isDirectory()
  } catch {
    return false
  }
}

/** A version range from package.json reduced to a plain version ("^19.3.0" -> "19.3.0"); null for tags and urls. */
export function cleanVersion(range) {
  if (typeof range !== 'string') return null
  const m = /(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?/.exec(range.replace(/^(workspace|npm):[^@]*@?/, ''))
  if (!m || /^(file|link|git|http|github):/.test(range)) return null
  return [m[1], m[2] && /\d/.test(m[2]) ? m[2] : '0', m[3] && /\d/.test(m[3]) ? m[3] : '0'].join('.')
}

function installedVersion(dir, root, name) {
  for (const base of [dir, root]) {
    const pkg = readJson(path.join(base, 'node_modules', ...name.split('/'), 'package.json'))
    if (pkg?.version) return pkg.version
  }
  return null
}

function packageManager(root, pkg) {
  const declared = typeof pkg?.packageManager === 'string' ? pkg.packageManager.split('@')[0] : null
  if (declared) return declared
  if (existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(path.join(root, 'yarn.lock'))) return 'yarn'
  if (existsSync(path.join(root, 'bun.lock')) || existsSync(path.join(root, 'bun.lockb'))) return 'bun'
  if (existsSync(path.join(root, 'package-lock.json'))) return 'npm'
  return pkg ? 'npm' : null
}

/* Workspace globs from package.json, pnpm-workspace.yaml or lerna.json, expanded one or two levels (a/*, a/**). */
function workspaceDirs(root, pkg) {
  let globs = []
  if (Array.isArray(pkg?.workspaces)) globs = pkg.workspaces
  else if (Array.isArray(pkg?.workspaces?.packages)) globs = pkg.workspaces.packages
  const pnpm = read(path.join(root, 'pnpm-workspace.yaml'))
  if (pnpm) {
    const block = /^packages:\s*\n((?:\s+-.*\n?)+)/m.exec(pnpm)
    if (block)
      globs.push(
        ...block[1]
          .split('\n')
          .map((l) =>
            l
              .replace(/^\s*-\s*/, '')
              .replace(/^["']|["']$/g, '')
              .trim()
          )
          .filter(Boolean)
      )
  }
  const lerna = readJson(path.join(root, 'lerna.json'))
  if (Array.isArray(lerna?.packages)) globs.push(...lerna.packages)
  const tool = pnpm ? 'pnpm' : lerna ? 'lerna' : globs.length ? 'workspaces' : existsSync(path.join(root, 'nx.json')) ? 'nx' : null
  const out = new Set()
  for (const g of globs.filter((x) => !x.startsWith('!'))) {
    const parts = g.replace(/\/+$/, '').split('/')
    const star = parts.findIndex((p) => p.includes('*'))
    if (star === -1) {
      if (existsSync(path.join(root, ...parts, 'package.json'))) out.add(parts.join('/'))
      continue
    }
    const base = parts.slice(0, star)
    const deep = parts[star] === '**'
    const visit = (rel, depth) => {
      let entries = []
      try {
        entries = readdirSync(path.join(root, ...rel), { withFileTypes: true })
      } catch {
        return
      }
      for (const e of entries) {
        if (!e.isDirectory() || SKIP.has(e.name)) continue
        const next = [...rel, e.name]
        if (existsSync(path.join(root, ...next, 'package.json'))) out.add(next.join('/'))
        if (deep && depth < 2) visit(next, depth + 1)
      }
    }
    visit(base, 0)
  }
  if (out.size === 0 && tool === 'nx')
    for (const d of ['apps', 'packages', 'libs'])
      for (const e of safeList(path.join(root, d))) if (existsSync(path.join(root, d, e, 'package.json'))) out.add(`${d}/${e}`)
  return { tool, dirs: [...out].sort() }
}

const safeList = (dir) => {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  } catch {
    return []
  }
}

/* Counts files by extension in the first levels of a folder (for plain sites and CSS Modules). */
function scanFiles(dir, depth = 0, acc = { html: 0, css: 0, js: 0, modules: 0, scss: 0, tailwindImport: false }) {
  if (depth > 4) return acc
  let entries = []
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const e of entries) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) scanFiles(p, depth + 1, acc)
    else if (/\.html?$/i.test(e.name)) acc.html++
    else if (/\.module\.(css|scss)$/i.test(e.name)) acc.modules++
    else if (/\.scss$/i.test(e.name)) acc.scss++
    else if (/\.css$/i.test(e.name)) {
      acc.css++
      if (!acc.tailwindImport && /@import\s+["']tailwindcss["']/.test(read(p).slice(0, 4000))) acc.tailwindImport = true
    } else if (/\.m?js$/i.test(e.name)) acc.js++
  }
  return acc
}

function describeProject(dir, root, rel) {
  const pkg = readJson(path.join(dir, 'package.json'))
  const deps = { ...(pkg?.peerDependencies || {}), ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) }
  const project = {
    path: rel || '.',
    name: pkg?.name || path.basename(dir),
    frameworks: {},
    typescript: null,
    styling: [],
    testing: [],
    build: [],
    linting: [],
    data: [],
    i18n: [],
    plainHtml: false
  }
  const add = (list, v) => {
    if (!list.includes(v)) list.push(v)
  }
  for (const [name, group, key] of PACKAGES) {
    if (!(name in deps)) continue
    const version = installedVersion(dir, root, name) || cleanVersion(deps[name])
    if (group === 'frameworks') {
      if (!(key in project.frameworks)) project.frameworks[key] = version
    } else if (group === 'typescript') project.typescript = version
    else if (group === 'i18n') add(project.i18n, name)
    else add(project[group], key)
  }
  const has = (...files) => files.some((f) => existsSync(path.join(dir, f)))
  if (!project.typescript && has('tsconfig.json')) project.typescript = 'unknown'
  if (has('next.config.js', 'next.config.mjs', 'next.config.ts') && !project.frameworks.next) project.frameworks.next = null
  if (has('nuxt.config.ts', 'nuxt.config.js') && !project.frameworks.nuxt) project.frameworks.nuxt = null
  if (has('angular.json') && !project.frameworks.angular) project.frameworks.angular = null
  if (has('svelte.config.js', 'svelte.config.mjs') && !project.frameworks.svelte) project.frameworks.svelte = null
  if (has('astro.config.mjs', 'astro.config.ts', 'astro.config.js') && !project.frameworks.astro) project.frameworks.astro = null
  if (has('tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs', 'tailwind.config.mjs')) add(project.styling, 'tailwind')
  if (has('vite.config.js', 'vite.config.ts', 'vite.config.mjs')) add(project.build, 'vite')
  if (has('biome.json', 'biome.jsonc')) add(project.linting, 'biome')
  if (has('playwright.config.ts', 'playwright.config.js')) add(project.testing, 'playwright')
  if (has('vitest.config.ts', 'vitest.config.js', 'vitest.config.mjs')) add(project.testing, 'vitest')
  for (const [fw, tool] of Object.entries(IMPLIED_BUILD)) if (fw in project.frameworks) add(project.build, tool)
  if ('nuxt' in project.frameworks && !('vue' in project.frameworks)) project.frameworks.vue = installedVersion(dir, root, 'vue')
  if ('next' in project.frameworks && !('react' in project.frameworks)) project.frameworks.react = installedVersion(dir, root, 'react')
  if ('sveltekit' in project.frameworks && !('svelte' in project.frameworks)) project.frameworks.svelte = installedVersion(dir, root, 'svelte')
  const files = scanFiles(dir)
  if (files.modules) add(project.styling, 'css-modules')
  if (files.scss && !project.styling.includes('sass')) add(project.styling, 'sass')
  if (files.tailwindImport) add(project.styling, 'tailwind')
  if (Object.keys(project.frameworks).length === 0 && files.html > 0) project.plainHtml = true
  if (!('lit' in project.frameworks) && /customElements\.define\(/.test(scanForWebComponents(dir))) project.frameworks.webc ??= null
  return { project, pkg, files }
}

/* Reads up to a few source files to see whether plain custom elements are defined (no Lit). */
function scanForWebComponents(dir) {
  let found = ''
  const visit = (d, depth) => {
    if (depth > 3 || found) return
    for (const e of (() => {
      try {
        return readdirSync(d, { withFileTypes: true })
      } catch {
        return []
      }
    })()) {
      if (SKIP.has(e.name) || e.name.startsWith('.')) continue
      const p = path.join(d, e.name)
      if (e.isDirectory()) visit(p, depth + 1)
      else if (/\.(m?js|ts)$/.test(e.name) && !/\.d\.ts$/.test(e.name)) {
        const t = read(p).slice(0, 20000)
        if (/customElements\.define\(/.test(t)) {
          found = t
          return
        }
      }
    }
  }
  visit(dir, 0)
  return found
}

/** The stack keys a project description implies (always includes "web"). */
export function stackKeys(projects) {
  const keys = new Set(['web'])
  for (const p of projects) {
    for (const fw of Object.keys(p.frameworks)) keys.add(fw)
    if (p.typescript) keys.add('typescript')
    for (const group of ['styling', 'testing', 'build', 'linting', 'data']) for (const k of p[group]) if (STACK_KEYS.includes(k)) keys.add(k)
    if (p.i18n.length) keys.add('i18n')
    if (p.plainHtml) keys.add('html')
  }
  return STACK_KEYS.filter((k) => keys.has(k))
}

/** Detects the stack of the project at root. */
export function detectStack(root) {
  const rootPkg = readJson(path.join(root, 'package.json'))
  const ws = workspaceDirs(root, rootPkg)
  const projects = []
  const main = describeProject(root, root, '.')
  const rootUseful = Object.keys(main.project.frameworks).length || main.project.plainHtml || !ws.dirs.length
  if (rootUseful) projects.push(main.project)
  for (const rel of ws.dirs) {
    const d = describeProject(path.join(root, ...rel.split('/')), root, rel)
    if (Object.keys(d.project.frameworks).length || d.project.styling.length || d.project.plainHtml) projects.push(d.project)
  }
  if (projects.length === 0) projects.push(main.project)
  return {
    packageManager: packageManager(root, rootPkg),
    monorepo: ws.dirs.length ? { tool: ws.tool, packages: ws.dirs } : null,
    projects,
    stack: stackKeys(projects)
  }
}

/* ---------- coding agents ---------- */

/** Which coding agents the project already uses, from the files they leave; adapters list their own signals. */
export function detectAgents(root, adapters) {
  const found = []
  for (const a of adapters)
    if (a.detect.some((p) => existsSync(path.join(root, ...p.split('/'))) || (p.endsWith('/') && isDir(path.join(root, p))))) found.push(a.id)
  return found
}
