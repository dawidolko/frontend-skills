/*
 * The page frame shared by every page of the site: the head (title, description, canonical, hreflang pairs, Open
 * Graph, JSON-LD, the one stylesheet, the tiny inline script that applies the saved colour theme before the first
 * paint, and the two deferred scripts), the header with the main navigation, the day, night and system theme switch
 * and the language switch, the documentation shell (chapter sidebar that becomes a drawer on phones, the page, the
 * on-this-page outline) and the footer in columns. Also helpers for translated strings, plural forms, icons and
 * language-prefixed URLs.
 */
import { createHash } from 'node:crypto'
import { esc, inline } from './markdown.mjs'

export const ORIGIN = 'https://skills.dawidolko.pl'
export const LANGS = ['en', 'pl']

/** The URL of a language-neutral path in one language: English at the root, Polish under /pl/. */
export const href = (lang, p) => (lang === 'en' ? p : `/pl${p}`)

/** An icon from the sprite; decorative, hidden from assistive technology. */
export const icon = (name, size = 20, cls = 'icon') =>
  `<svg class="${cls}" width="${size}" height="${size}" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"/></svg>`

/* Applies the saved theme before the first paint, so a dark choice never flashes light. Allowed by its CSP hash. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("fs-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`
export const THEME_HASH = `sha256-${createHash('sha256').update(THEME_SCRIPT).digest('base64')}`

/** A translated string by dotted key, with {name} and {name:word} placeholders. Throws on a missing key. */
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

const LOGO = `<svg class="brand-mark" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><rect width="32" height="32" rx="8" fill="currentColor"/><path d="M12.5 10 7 16l5.5 6M19.5 10 25 16l-5.5 6" fill="none" stroke="var(--logo-ink)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`

/** Escapes a value for a JSON-LD script block (no "</script>" can close it early). */
const ld = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

function themeSwitch(t) {
  const b = (mode, ic) =>
    `<button type="button" class="theme-btn" data-theme-set="${mode}" aria-pressed="${mode === 'system'}" aria-label="${esc(t(`theme.${mode}`))}" title="${esc(t(`theme.${mode}`))}">${icon(ic, 18)}</button>`
  return `<div class="theme-switch" role="group" aria-label="${esc(t('theme.label'))}" hidden>${b('light', 'sun')}${b('system', 'system')}${b('dark', 'moon')}</div>`
}

function footer(t, lang, data) {
  const col = (title, items) =>
    `<div class="footer-col"><h2>${esc(title)}</h2><ul>${items.map(([label, url]) => `<li><a href="${url}">${label}</a></li>`).join('')}</ul></div>`
  const guide = [
    [esc(t('nav.home')), href(lang, '/')],
    [esc(t('nav.how')), href(lang, '/how-it-works/')],
    [esc(t('nav.commands')), href(lang, '/commands/')],
    [esc(t('nav.faq')), href(lang, '/faq/')]
  ]
  const dictionary = [[esc(t('docs.allRules')), href(lang, '/rules/')], ...data.areas.slice(0, 6).map((a) => [esc(t(`ruleArea.${a}`)), href(lang, `/rules/#area-${a}`)])]
  const skills = [[esc(t('docs.allSkills')), href(lang, '/skills/')], ...data.skillAreas.slice(0, 6).map((a) => [esc(t(`skillArea.${a}`)), href(lang, `/skills/#sa-${a}`)])]
  const project = [
    [esc(t('site.github')), 'https://github.com/dawidolko/frontend-skills'],
    [esc(t('footer.issues')), 'https://github.com/dawidolko/frontend-skills/issues'],
    [esc(t('footer.licence')), href(lang, '/about/#licence')],
    [esc(t('nav.about')), href(lang, '/about/')],
    ['dawidolko.pl', 'https://dawidolko.pl']
  ]
  return `<footer class="site-footer">
<div class="wrap footer-grid">
<div class="footer-brand-col">
<p class="footer-brand">${LOGO}<span>${esc(t('site.name'))}</span></p>
<p>${esc(t('footer.tagline'))}</p>
<p>${inline(t('site.footerAbout'))}</p>
</div>
<nav class="footer-nav" aria-label="${esc(t('site.footerNavLabel'))}">
${col(t('footer.guide'), guide)}
${col(t('footer.dictionary'), dictionary)}
${col(t('footer.skills'), skills)}
${col(t('footer.project'), project)}
</nav>
</div>
<div class="wrap footer-legal">
<p>${inline(t('site.footerHonest'))}</p>
<p>${inline(t('site.footerPrivacy'))}</p>
</div>
</footer>`
}

/* The outline of the page, for wide screens; the script marks the section in view. */
const outline = (t, items) =>
  items && items.length
    ? `<aside class="docs-outline"><nav aria-labelledby="outline-title"><h2 id="outline-title">${esc(t('docs.onThisPage'))}</h2><ol>${items
        .map(([id, label, level]) => `<li${level === 3 ? ' class="sub"' : ''}><a href="#${id}">${label}</a></li>`)
        .join('')}</ol></nav></aside>`
    : ''

/**
 * One full page. page: { path, title, description, body, section, jsonld, noindex, alternates, docs }.
 * docs: { label, sidebar, outline } puts the page in the documentation shell.
 */
export function layout(t, page, { assets, data }) {
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
  const switchHref = page.alternates === false ? href(other, '/') : href(other, page.path)
  const jsonld = (page.jsonld || []).map((o) => `<script type="application/ld+json">${ld(o)}</script>`).join('\n')
  const docs = page.docs
  const content = docs
    ? `<div class="docs wrap-wide">
<button type="button" class="docs-toggle" popovertarget="docs-nav" aria-controls="docs-nav">${icon('menu', 18)}<span>${esc(docs.label)}</span></button>
<nav id="docs-nav" class="docs-nav" popover aria-label="${esc(docs.label)}">
<div class="docs-nav-head"><span>${esc(docs.label)}</span><button type="button" class="docs-close" popovertarget="docs-nav" popovertargetaction="hide" aria-label="${esc(t('docs.close'))}">${icon('close', 18)}</button></div>
${docs.sidebar}
</nav>
<main id="main" tabindex="-1" class="docs-main">
${page.body}
</main>
${outline(t, docs.outline)}
</div>`
    : `<main id="main" tabindex="-1">
${page.body}
</main>`

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(page.description)}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' '${THEME_HASH}'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0d0d0f">
<script>${THEME_SCRIPT}</script>
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
<div class="wrap-wide header-inner">
<a class="brand" href="${href(lang, '/')}"${page.path === '/' ? ' aria-current="page"' : ''}>${LOGO}<span class="brand-name">${esc(t('site.name'))}</span></a>
<nav class="main-nav" aria-label="${esc(t('site.navLabel'))}"><ul>${nav}</ul></nav>
<div class="header-tools">
${themeSwitch(t)}
<a class="lang-switch" href="${switchHref}" hreflang="${other}" lang="${other}" title="${esc(t('site.switchTitle'))}">${esc(t('site.switchLabel'))}</a>
<a class="gh-link" href="https://github.com/dawidolko/frontend-skills" aria-label="${esc(t('site.githubLabel'))}">${icon('github', 22)}</a>
</div>
</div>
</header>
${content}
${footer(t, lang, data)}
<p id="live-status" class="visually-hidden" role="status" aria-live="polite"></p>
</body>
</html>
`
}
