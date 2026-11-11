/*
 * The page frame shared by every page of the site: the head (title, description, canonical, hreflang pairs, Open
 * Graph, JSON-LD, the one stylesheet and the two deferred scripts), the header with the main navigation and the
 * language switch, and the footer. Also small helpers for translated strings and language-prefixed URLs.
 */
import { esc, inline } from './markdown.mjs'

export const ORIGIN = 'https://skills.dawidolko.pl'
export const LANGS = ['en', 'pl']

/** The URL of a language-neutral path in one language: English at the root, Polish under /pl/. */
export const href = (lang, p) => (lang === 'en' ? p : `/pl${p}`)

/** A translated string by dotted key, with {name} placeholders filled. Throws on a missing key, so the build fails. */
export function translator(dict) {
  const get = (key) => {
    const v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), dict)
    if (v === undefined) throw new Error(`missing translation "${key}" for ${dict.lang}`)
    return v
  }
  /* Plural forms: English one/other; Polish one/few/many (2–4 except 12–14 take "few"). */
  const form = (n) => {
    if (dict.lang !== 'pl') return n === 1 ? 0 : 1
    if (n === 1) return 0
    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : 2
  }
  const plural = (word, n) => {
    const forms = dict.plurals?.[word]
    if (!forms) throw new Error(`missing plural "${word}" for ${dict.lang}`)
    return forms[Math.min(form(n), forms.length - 1)]
  }
  /* {name} is replaced by its value; {name:word} by the value and the word in the matching plural form. */
  const t = (key, vars = {}) =>
    String(get(key)).replace(/\{(\w+)(?::(\w+))?\}/g, (m, k, word) => (k in vars ? (word ? `${vars[k]} ${plural(word, Number(vars[k]))}` : String(vars[k])) : m))
  t.raw = get
  t.plural = plural
  t.lang = dict.lang
  return t
}

const NAV = [
  ['how', '/how-it-works/'],
  ['rules', '/rules/'],
  ['skills', '/skills/'],
  ['commands', '/commands/'],
  ['faq', '/faq/']
]

const FOOT = [
  ['home', '/'],
  ['how', '/how-it-works/'],
  ['rules', '/rules/'],
  ['skills', '/skills/'],
  ['commands', '/commands/'],
  ['faq', '/faq/'],
  ['about', '/about/'],
  ['github', 'https://github.com/dawidolko/frontend-skills']
]

const LOGO = `<svg class="brand-mark" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="8" fill="currentColor"/><path d="M12.5 10 7 16l5.5 6M19.5 10 25 16l-5.5 6" fill="none" stroke="var(--logo-ink)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const GITHUB = `<svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`

/** Escapes a value for a JSON-LD script block (no "</script>" can close it early). */
const ld = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

/**
 * One full page. page: { path, title, description, body, section, jsonld, noindex, alternates }.
 * path is language-neutral ("/rules/a11y/img-alt/"); alternates is false for a page with no translation (404).
 */
export function layout(t, page, assets) {
  const { lang } = t
  const other = lang === 'en' ? 'pl' : 'en'
  const url = ORIGIN + href(lang, page.path)
  const fullTitle = page.path === '/' ? page.title : `${page.title} · ${t('site.name')}`
  const alternates =
    page.alternates === false
      ? ''
      : LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l, page.path)}">`).join('\n') +
        `\n<link rel="alternate" hreflang="x-default" href="${ORIGIN}${href('en', page.path)}">`
  const og = `${ORIGIN}/og-${lang}.png`
  const current = (p) => (page.path === p ? ' aria-current="page"' : page.section === p ? ' class="is-section"' : '')
  const nav = NAV.map(([key, p]) => `<li><a href="${href(lang, p)}"${current(p)}>${esc(t(`nav.${key}`))}</a></li>`).join('')
  const foot = FOOT.map(([key, p]) => `<li><a href="${p.startsWith('http') ? p : href(lang, p)}"${page.path === p ? ' aria-current="page"' : ''}>${esc(key === 'github' ? t('site.github') : t(`nav.${key}`))}</a></li>`).join('')
  const switchHref = page.alternates === false ? href(other, '/') : href(other, page.path)
  const jsonld = (page.jsonld || []).map((o) => `<script type="application/ld+json">${ld(o)}</script>`).join('\n')

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description)}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#faf7fc" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d0d0f" media="(prefers-color-scheme: dark)">
${page.noindex ? '<meta name="robots" content="noindex">\n' : `<link rel="canonical" href="${url}">\n`}${alternates}
<link rel="preload" href="/assets/fonts/opensans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css?v=${assets.css}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(t('site.name'))}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t('site.ogAlt'))}">
<meta property="og:locale" content="${t('locale')}">
<meta property="og:locale:alternate" content="${other === 'pl' ? 'pl_PL' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="Dawid Olko">
${jsonld}
<script src="/assets/site.js?v=${assets.js}" defer></script>
<script src="/a11y/a11y-panel.js?v=${assets.panel}" data-accent="#9b00c2" defer></script>
</head>
<body>
<a class="skip-link" href="#main">${esc(t('site.skip'))}</a>
<header class="site-header">
<div class="wrap header-inner">
<a class="brand" href="${href(lang, '/')}"${page.path === '/' ? ' aria-current="page"' : ''}>${LOGO}<span class="brand-name">${esc(t('site.name'))}</span></a>
<nav class="main-nav" aria-label="${esc(t('site.navLabel'))}"><ul>${nav}</ul></nav>
<div class="header-tools">
<a class="lang-switch" href="${switchHref}" hreflang="${other}" lang="${other}" title="${esc(t('site.switchTitle'))}">${esc(t('site.switchLabel'))}</a>
<a class="gh-link" href="https://github.com/dawidolko/frontend-skills" aria-label="${esc(t('site.githubLabel'))}">${GITHUB}</a>
</div>
</div>
</header>
<main id="main" tabindex="-1">
${page.body}
</main>
<footer class="site-footer">
<div class="wrap footer-inner">
<div class="footer-text">
<p class="footer-brand">${LOGO}<span>${esc(t('site.name'))}</span></p>
<p>${inline(t('site.footerAbout'))}</p>
<p>${inline(t('site.footerHonest'))}</p>
<p>${inline(t('site.footerPrivacy'))}</p>
</div>
<nav aria-label="${esc(t('site.footerNavLabel'))}"><ul class="footer-nav">${foot}</ul></nav>
</div>
</footer>
<p id="live-status" class="visually-hidden" role="status" aria-live="polite"></p>
</body>
</html>
`
}
