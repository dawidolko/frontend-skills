/*
 * Checks the built site in site/dist (or --dir <dir>) with no network: every internal link and #fragment resolves,
 * every page has a language, one h1, a title, a description and a canonical URL, every page has its hreflang pair
 * and the pair points back, every rule and skill of the repository has a page in both languages, the search index
 * lists every rule once, the sitemap and the pages agree, no page loads anything from another host, and the language
 * files have the same keys. Exits 1 with the list of problems. Run with `npm run site:check` after site:build.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadRules, loadSkills } from '../cli/lib/catalog.mjs'

const SITE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SITE, '..')
const ORIGIN = 'https://skills.dawidolko.pl'
const i = process.argv.indexOf('--dir')
const DIST = i !== -1 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : path.join(SITE, 'dist')

const problems = []
const fail = (where, what) => problems.push(`${where}: ${what}`)

if (!existsSync(DIST)) {
  process.stderr.write(`site:check: ${DIST} does not exist; run npm run site:build first\n`)
  process.exit(2)
}

function files(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) files(p, out)
    else out.push(p)
  }
  return out
}

/** The URL path of a built file: dist/rules/a/b/index.html → /rules/a/b/. */
const urlOf = (file) => {
  const rel = '/' + path.relative(DIST, file).split(path.sep).join('/')
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel
}

/** The built file a URL path points to, or null. */
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0])
  const p = path.join(DIST, ...clean.split('/').filter(Boolean))
  if (clean.endsWith('/')) return existsSync(path.join(p, 'index.html')) ? path.join(p, 'index.html') : null
  if (existsSync(p) && statSync(p).isFile()) return p
  if (existsSync(path.join(p, 'index.html'))) return path.join(p, 'index.html')
  return null
}

const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1] ?? null
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

/* Read every page once. */
const all = files(DIST)
const htmlFiles = all.filter((f) => f.endsWith('.html'))
const pages = new Map()
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  const dupes = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((v, k, a) => a.indexOf(v) !== k)
  const url = urlOf(file)
  if (dupes.length) fail(url, `duplicate id ${[...new Set(dupes)].join(', ')}`)
  pages.set(url, { file, html, ids })
}

const isNotFound = (url) => /(^|\/)404\.html$/.test(url)

for (const [url, { html, file }] of pages) {
  const lang = /<html lang="([^"]+)"/.exec(html)?.[1]
  if (!lang) fail(url, 'no lang on <html>')
  const expectLang = url.startsWith('/pl/') ? 'pl' : 'en'
  if (lang && lang !== expectLang) fail(url, `lang="${lang}", expected "${expectLang}"`)
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim()
  if (!title) fail(url, 'no <title>')
  if (!/<meta name="description" content="[^"]{20,}">/.test(html)) fail(url, 'no meta description of 20 or more characters')
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  if (h1 !== 1) fail(url, `${h1} h1 elements, expected 1`)
  if (!/<main id="main"/.test(html)) fail(url, 'no <main id="main">')
  if (!html.includes('/a11y/a11y-panel.js')) fail(url, 'the accessibility panel is missing')

  /* Nothing is loaded from another host: scripts, stylesheets, fonts, images, frames. */
  for (const m of html.matchAll(/<(script|img|iframe|source|video|audio)\b[^>]*\ssrc="([^"]+)"/g))
    if (/^(https?:)?\/\//.test(m[2])) fail(url, `<${m[1]}> loads ${m[2]} from another host`)
  for (const m of html.matchAll(/<link\b[^>]*>/g)) {
    const rel = attr(m[0], 'rel')
    const hrefValue = attr(m[0], 'href')
    if (['stylesheet', 'preload', 'icon', 'modulepreload', 'manifest'].includes(rel) && hrefValue && /^(https?:)?\/\//.test(hrefValue))
      fail(url, `<link rel="${rel}"> loads ${hrefValue} from another host`)
  }

  /* Canonical and hreflang. */
  if (!isNotFound(url)) {
    const canonical = /<link rel="canonical" href="([^"]+)">/.exec(html)?.[1]
    if (canonical !== ORIGIN + url) fail(url, `canonical is ${canonical}, expected ${ORIGIN + url}`)
    const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => [m[1], m[2]]))
    for (const l of ['en', 'pl', 'x-default']) if (!alts[l]) fail(url, `no hreflang="${l}"`)
    if (alts[expectLang] && alts[expectLang] !== ORIGIN + url) fail(url, `hreflang="${expectLang}" points to ${alts[expectLang]}, not to this page`)
    for (const [l, target] of Object.entries(alts)) {
      if (!target.startsWith(ORIGIN)) {
        fail(url, `hreflang="${l}" is not on ${ORIGIN}`)
        continue
      }
      const other = pages.get(target.slice(ORIGIN.length))
      if (!other) {
        fail(url, `hreflang="${l}" points to ${target}, which was not built`)
        continue
      }
      if (l !== 'x-default' && !other.html.includes(`hreflang="${expectLang}" href="${ORIGIN + url}"`))
        fail(url, `${target} does not point back with hreflang="${expectLang}"`)
    }
  }

  /* Every internal link and fragment resolves. */
  const base = url.endsWith('/') ? url : url.replace(/[^/]*$/, '')
  for (const m of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const raw = decode(m[2])
    if (!raw) {
      fail(url, `empty ${m[1]}`)
      continue
    }
    if (/^(https?:|mailto:|data:)/.test(raw) || raw.startsWith('//')) continue
    if (/<link rel="(canonical|alternate)"/.test(html.slice(Math.max(0, m.index - 40), m.index + 10))) continue
    const [pathPart, fragment] = raw.split('#')
    const target = pathPart ? (pathPart.startsWith('/') ? pathPart : path.posix.join(base, pathPart) + (pathPart.endsWith('/') ? '/' : '')) : url
    const targetFile = fileFor(target)
    if (!targetFile) {
      fail(url, `link to ${raw} does not resolve`)
      continue
    }
    if (fragment) {
      const page = pages.get(urlOf(targetFile))
      if (page && !page.ids.has(fragment)) fail(url, `link to ${raw}: no id "${fragment}" there`)
    }
  }
  void file
}

/* Every rule and skill has a page in both languages; the index lists every rule once. */
const rules = loadRules(ROOT)
const skills = loadSkills(ROOT)
for (const r of rules) for (const prefix of ['', '/pl']) if (!pages.has(`${prefix}/rules/${r.id}/`)) fail(r.id, `no page at ${prefix}/rules/${r.id}/`)
for (const s of skills) for (const prefix of ['', '/pl']) if (!pages.has(`${prefix}/skills/${s.name}/`)) fail(s.name, `no page at ${prefix}/skills/${s.name}/`)

const indexFile = path.join(DIST, 'rules', 'index.json')
if (!existsSync(indexFile)) fail('rules/index.json', 'missing')
else {
  const index = JSON.parse(readFileSync(indexFile, 'utf8'))
  const ids = index.rules.map((r) => r.id)
  const want = rules.map((r) => r.id)
  for (const id of want) if (!ids.includes(id)) fail('rules/index.json', `${id} is missing`)
  for (const id of ids) if (!want.includes(id)) fail('rules/index.json', `${id} is not a rule of the repository`)
  for (const id of ids.filter((v, k, a) => a.indexOf(v) !== k)) fail('rules/index.json', `${id} is listed twice`)
  for (const r of index.rules) for (const k of ['id', 'title', 'area', 'severity', 'check']) if (!r[k]) fail('rules/index.json', `${r.id} has no ${k}`)
  for (const prefix of ['', '/pl']) {
    const page = pages.get(`${prefix}/rules/`)
    const listed = page ? [...page.html.matchAll(/data-id="([^"]+)"/g)].map((m) => m[1]) : []
    if (listed.length !== want.length) fail(`${prefix}/rules/`, `lists ${listed.length} rules, the repository has ${want.length}`)
  }
}

/* The sitemap and the pages agree. */
const sitemapFile = path.join(DIST, 'sitemap.xml')
if (!existsSync(sitemapFile)) fail('sitemap.xml', 'missing')
else {
  const sitemap = readFileSync(sitemapFile, 'utf8')
  const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))
  for (const loc of locs) if (!pages.has(loc.slice(ORIGIN.length))) fail('sitemap.xml', `${loc} was not built`)
  for (const url of pages.keys()) if (!isNotFound(url) && !locs.has(ORIGIN + url)) fail('sitemap.xml', `${url} is not listed`)
}

/* The files GitHub Pages and crawlers need. */
const need = { CNAME: 'skills.dawidolko.pl\n', 'robots.txt': null, 'llms.txt': null, 'og-en.png': null, 'og-pl.png': null, 'favicon.svg': null, '404.html': null, '.nojekyll': null }
for (const [f, content] of Object.entries(need)) {
  const p = path.join(DIST, f)
  if (!existsSync(p)) fail(f, 'missing')
  else if (content !== null && readFileSync(p, 'utf8') !== content) fail(f, `content is not ${JSON.stringify(content)}`)
}
const robots = existsSync(path.join(DIST, 'robots.txt')) ? readFileSync(path.join(DIST, 'robots.txt'), 'utf8') : ''
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', 'does not name the sitemap')

/* The language files have the same keys. */
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}${Array.isArray(v) ? `[${v.length}]` : ''}`]))
const en = new Set(keys(JSON.parse(readFileSync(path.join(SITE, 'i18n', 'en.json'), 'utf8'))))
const pl = new Set(keys(JSON.parse(readFileSync(path.join(SITE, 'i18n', 'pl.json'), 'utf8'))))
for (const k of en) if (!pl.has(k) && !k.startsWith('plurals.')) fail('i18n/pl.json', `missing or different key ${k}`)
for (const k of pl) if (!en.has(k) && !k.startsWith('plurals.')) fail('i18n/en.json', `missing or different key ${k}`)

const htmlCount = pages.size
if (problems.length) {
  process.stdout.write(`site:check: ${problems.length} problem(s) in ${htmlCount} pages\n${problems.map((p) => `  ${p}`).join('\n')}\n`)
  process.exit(1)
}
process.stdout.write(
  `site:check: ${htmlCount} pages fine: links and fragments resolve, hreflang pairs point back, ${rules.length} rules and ${skills.length} skills have pages in both languages, the index and the sitemap are complete, nothing loads from another host.\n`
)
