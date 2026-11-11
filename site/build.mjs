/*
 * Builds skills.dawidolko.pl into site/dist (or --out <dir>): plain HTML in English (/) and Polish (/pl/) from the
 * repository's skills and rules, one stylesheet, the copy-and-search script, the author's accessibility panel, the
 * search index of the dictionary, the sitemap with hreflang pairs, robots.txt, llms.txt, the Open Graph images and
 * the CNAME for GitHub Pages. Node.js 20 or newer, no dependencies. Run with `npm run site:build`.
 */
import { createHash } from 'node:crypto'
import { copyFileSync, cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadData } from './lib/data.mjs'
import { LANGS, ORIGIN, href, layout, translator } from './lib/layout.mjs'
import { plain } from './lib/markdown.mjs'
import { ogSvg, writeOg } from './lib/og.mjs'
import { pagesFor } from './lib/pages.mjs'

const SITE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SITE, '..')
const HOST = 'skills.dawidolko.pl'

function argValue(name, fallback) {
  const i = process.argv.indexOf(name)
  return i !== -1 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : fallback
}

const OUT = argValue('--out', path.join(SITE, 'dist'))
const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 10)

/* A light minifier for our own stylesheet: comments and runs of white space only; strings stay as written. */
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()

function write(file, text) {
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, text)
}

/** The file a page path is written to: "/" → index.html, "/rules/" → rules/index.html, "/404.html" → 404.html. */
const fileOf = (urlPath) => path.join(OUT, ...urlPath.split('/').filter(Boolean), ...(urlPath.endsWith('/') ? ['index.html'] : []))

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#a800d1"/><path d="M12.5 10 7 16l5.5 6M19.5 10 25 16l-5.5 6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`

function build() {
  const started = Date.now()
  const data = loadData(ROOT)
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })

  /* Assets: one stylesheet, one script, the fonts and the panel, versioned by their content. */
  const css = minifyCss(readFileSync(path.join(SITE, 'assets', 'styles.css'), 'utf8'))
  const js = readFileSync(path.join(SITE, 'assets', 'site.js'), 'utf8')
  const panelJs = readFileSync(path.join(SITE, 'assets', 'a11y', 'a11y-panel.js'), 'utf8')
  write(path.join(OUT, 'assets', 'styles.css'), css)
  write(path.join(OUT, 'assets', 'site.js'), js)
  cpSync(path.join(SITE, 'assets', 'fonts'), path.join(OUT, 'assets', 'fonts'), { recursive: true })
  mkdirSync(path.join(OUT, 'a11y'), { recursive: true })
  for (const f of ['a11y-panel.js', 'a11y-panel.css']) copyFileSync(path.join(SITE, 'assets', 'a11y', f), path.join(OUT, 'a11y', f))
  write(path.join(OUT, 'favicon.svg'), FAVICON)
  const assets = { css: hash(css), js: hash(js), panel: hash(panelJs) }

  /* Pages in both languages. */
  const dicts = Object.fromEntries(LANGS.map((l) => [l, translator(JSON.parse(readFileSync(path.join(SITE, 'i18n', `${l}.json`), 'utf8')))]))
  const sitemap = []
  let count = 0
  for (const lang of LANGS) {
    const t = dicts[lang]
    const other = dicts[LANGS.find((l) => l !== lang)]
    for (const page of pagesFor(t, lang, data, other)) {
      const urlPath = page.alternates === false ? page.path : href(lang, page.path)
      write(fileOf(urlPath), layout(t, page, assets))
      count++
      if (lang === 'en' && !page.noindex) sitemap.push(page.path)
    }
  }

  /* The search index of the dictionary: language-neutral, the rule texts are English. */
  const index = {
    version: data.version,
    rules: data.rules.map((r) => ({
      id: r.id,
      title: plain(r.title),
      area: r.area,
      severity: r.severity,
      check: r.check,
      skill: r.skill,
      wcag: r.wcag,
      applies: r.applies,
      tools: [...r.axe, ...r.lighthouse]
    }))
  }
  write(path.join(OUT, 'rules', 'index.json'), JSON.stringify(index))

  write(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap
  .flatMap((p) =>
    LANGS.map(
      (lang) => `<url><loc>${ORIGIN}${href(lang, p)}</loc>${LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l, p)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${href('en', p)}"/></url>`
    )
  )
  .join('\n')}
</urlset>
`
  )
  write(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`)
  write(path.join(OUT, 'CNAME'), `${HOST}\n`)
  write(path.join(OUT, '.nojekyll'), '')

  const en = dicts.en
  write(
    path.join(OUT, 'llms.txt'),
    `# Frontend Skills

> ${en('home.description')}

Start in a project folder with \`npx github:dawidolko/frontend-skills init\` (Node.js 20 or newer). Free and open source under the MIT licence; source: https://github.com/dawidolko/frontend-skills. Every rule has a stable id; \`npx github:dawidolko/frontend-skills explain <id>\` prints it. Automated checks find only part of the accessibility problems.

## Docs

- [How it works](${ORIGIN}/how-it-works/): ${en('how.description')}
- [Commands](${ORIGIN}/commands/): ${en('commands.description')}
- [Skills](${ORIGIN}/skills/): ${en('skills.description')}
- [Questions and answers](${ORIGIN}/faq/): ${en('faq.description')}
- [Search index of the rules (JSON)](${ORIGIN}/rules/index.json)

## Skills

${data.skills.map((s) => `- [${s.name}](${ORIGIN}/skills/${s.name}/): ${s.title}`).join('\n')}

## Rules

${data.rules.map((r) => `- [${r.id}](${ORIGIN}/rules/${r.id}/): ${plain(r.title)}`).join('\n')}

## Optional

- [Polish version](${ORIGIN}/pl/)
- [Licence, credits and author](${ORIGIN}/about/)
`
  )

  /* Open Graph images, one per language. */
  const og = LANGS.map((lang) => `${lang}: ${writeOg(OUT, lang, ogSvg(dicts[lang], data), path.join(SITE, 'assets', 'fonts'), path.join(SITE, 'og'))}`)

  let bytes = 0
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else bytes += statSync(p).size
    }
  }
  walk(OUT)
  process.stdout.write(
    `site: ${count} pages (${LANGS.join(', ')}), ${data.rules.length} rules, ${data.skills.length} skills, ${data.agents.length} agents; ` +
      `${(bytes / 1024).toFixed(0)} KiB in ${path.relative(process.cwd(), OUT) || OUT}; Open Graph images: ${og.join(', ')}; ${Date.now() - started} ms\n`
  )
}

build()
