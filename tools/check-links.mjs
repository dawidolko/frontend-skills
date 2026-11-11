#!/usr/bin/env node
/*
 * Checks the source links of the dictionary. Offline (the default, part of `npm run check`): every rule source is an
 * https URL on a publisher this project accepts as a source (standards bodies, MDN, web.dev and Chrome docs, framework
 * and tool vendors, W3Schools), and every URL in rules, skill references and docs is well formed. With --online it
 * also requests each unique URL (HEAD, then GET when HEAD is refused; four at a time) and reports anything that does
 * not answer with a success or a redirect. Usage: node tools/check-links.mjs [--online] [--json]
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadRules, loadSkills, PACKAGE_ROOT } from '../cli/lib/catalog.mjs'

export const PUBLISHERS = [
  'w3.org',
  'whatwg.org',
  'developer.mozilla.org',
  'web.dev',
  'developer.chrome.com',
  'w3schools.com',
  'react.dev',
  'nextjs.org',
  'vuejs.org',
  'nuxt.com',
  'angular.dev',
  'svelte.dev',
  'docs.astro.build',
  'tailwindcss.com',
  'sass-lang.com',
  'typescriptlang.org',
  'lit.dev',
  'tanstack.com',
  'pinia.vuejs.org',
  'vite.dev',
  'vitest.dev',
  'playwright.dev',
  'testing-library.com',
  'eslint.org',
  'prettier.io',
  'biomejs.dev',
  'dequeuniversity.com',
  'github.com',
  'unicode.org',
  'ecma-international.org',
  'tc39.es',
  'nodejs.org',
  'storybook.js.org',
  'jestjs.io'
]

const URL_RE = /https?:\/\/[^\s)<>"'`\]]+/g
const host = (u) => new URL(u).hostname.replace(/^www\./, '')
const allowed = (u) => PUBLISHERS.some((p) => host(u) === p || host(u).endsWith(`.${p}`))

function markdownFiles(dir) {
  const out = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) out.push(p)
    }
  }
  walk(dir)
  return out
}

/** Every URL with where it appears: [{ url, file, ruleSource }]. */
export function collect(root = PACKAGE_ROOT) {
  const rel = (f) => path.relative(root, f).split(path.sep).join('/')
  const out = []
  for (const r of loadRules(root)) for (const s of r.sources) out.push({ url: s.url, file: rel(path.join(r.dir, 'rule.md')), ruleSource: true })
  const files = [...loadSkills(root).flatMap((s) => [s.file, ...markdownFiles(s.dir).filter((f) => f !== s.file)]), ...markdownFiles(path.join(root, 'docs'))]
  for (const f of files)
    for (const m of readFileSync(f, 'utf8').matchAll(URL_RE)) out.push({ url: m[0].replace(/[.,;:]+$/, ''), file: rel(f), ruleSource: false })
  return out
}

/** Offline problems: malformed URLs, plain http, rule sources from unknown publishers. */
export function offline(links) {
  const problems = []
  for (const l of links) {
    let ok = true
    try {
      new URL(l.url)
    } catch {
      ok = false
      problems.push({ ...l, problem: 'not a valid URL' })
    }
    if (!ok) continue
    if (!l.url.startsWith('https://') && !/^http:\/\/localhost/.test(l.url)) problems.push({ ...l, problem: 'use https' })
    if (l.ruleSource && !allowed(l.url))
      problems.push({ ...l, problem: `rule source from ${host(l.url)}, which is not in the list of accepted publishers (tools/check-links.mjs)` })
  }
  return problems
}

async function request(url) {
  const opts = { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'frontend-skills-link-check' } }
  try {
    let res = await fetch(url, { ...opts, method: 'HEAD' })
    if (res.status === 405 || res.status === 403 || res.status === 404) res = await fetch(url, { ...opts, method: 'GET' })
    return res.ok ? null : `HTTP ${res.status}`
  } catch (err) {
    return err.name === 'TimeoutError' ? 'timed out' : err.cause?.code || err.message
  }
}

/** Online problems for the unique URLs (localhost and example hosts are skipped). */
export async function online(links, concurrency = 4) {
  const unique = [...new Set(links.map((l) => l.url))].filter((u) => !/localhost|example\.(com|test)|127\.0\.0\.1/.test(u))
  const results = new Map()
  let i = 0
  const worker = async () => {
    while (i < unique.length) {
      const u = unique[i++]
      results.set(u, await request(u.split('#')[0]))
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  return links.filter((l) => results.get(l.url)).map((l) => ({ ...l, problem: results.get(l.url) }))
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
if (isMain) {
  const links = collect()
  const problems = offline(links)
  if (process.argv.includes('--online')) problems.push(...(await online(links)))
  if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(problems)}\n`)
  else {
    for (const p of problems) process.stdout.write(`${p.file}: ${p.url}: ${p.problem}\n`)
    process.stdout.write(
      `${new Set(links.map((l) => l.url)).size} unique links${process.argv.includes('--online') ? ' requested' : ' checked offline'}, ${problems.length} problem(s).\n`
    )
  }
  process.exitCode = problems.length ? 1 : 0
}
