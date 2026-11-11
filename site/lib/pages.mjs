/*
 * The body of every page of the site, one language at a time: home, how it works, the rule dictionary and one page
 * per rule, skills by technology and one page per skill, commands, questions and answers, licence and credits, and
 * the not-found page. The dictionary, the skills and the guide pages sit in the documentation shell with a chapter
 * sidebar and an outline. Shared pieces: the copyable command, the install picker (package runner × agent, with the
 * files the installer plans for that agent), terminal recordings, the report and file "windows", and the rows and
 * tiles of rules and skills. Each page function returns { path, title, description, body, section, docs, jsonld }.
 */
import { BLOB, EXAMPLE_PROJECT, PKG, REPO, RUNNERS, START, SKILL_AREA_ICON, areaIcon } from './data.mjs'
import { ORIGIN, href, icon } from './layout.mjs'
import { codeBlock, esc, inline, markdown, plain } from './markdown.mjs'

const rulePath = (id) => `/rules/${id}/`
const skillPath = (name) => `/skills/${name}/`

let uid = 0
const next = (p) => `${p}-${++uid}`

/** A command in a box with a copy button (shown by the script; without it the text stays selectable). */
function command(t, text, { id = next('cmd'), args = null } = {}) {
  const breakable = esc(text).replace(/(github:|\/)/g, '$1<wbr>')
  return `<div class="command"><pre class="command-text"><code id="${id}"${args ? ` data-args="${esc(args)}"` : ''}>${breakable}</code></pre><button type="button" class="copy-button" data-copy="${id}" data-done="${esc(t('common.copied'))}" data-fail="${esc(t('common.copyFailed'))}" aria-label="${esc(t('common.copyLabel'))}" hidden>${icon('copy', 16)}<span>${esc(t('common.copy'))}</span></button></div>`
}

const sev = (t, s) => `<span class="sev sev-${s}">${esc(t(`severity.${s}`))}</span>`
const chk = (t, c) => `<span class="tag">${esc(t(`check.${c}`))}</span>`
const opts = (lang, data) => ({ ruleHref: (id) => (data.ruleIds.has(id) ? href(lang, rulePath(id)) : null) })

function breadcrumb(t, lang, items) {
  return `<nav class="breadcrumb" aria-label="${esc(t('site.breadcrumb'))}"><ol>${items
    .map(([label, p], i) => (i === items.length - 1 ? `<li><span aria-current="page">${label}</span></li>` : `<li><a href="${href(lang, p)}">${label}</a></li>`))
    .join('')}</ol></nav>`
}

const breadcrumbLd = (lang, items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name: plain(name.replace(/<[^>]+>/g, '')), item: ORIGIN + href(lang, p) }))
})

/** A window frame around real content: a file, a report. */
const windowFrame = (title, body, cls = '') =>
  `<div class="window ${cls}"><div class="window-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="window-title">${title}</span></div><div class="window-body">${body}</div></div>`

/**
 * A terminal recording: the animated SVG made by tools/record.mjs, and its still frame for people who ask for less
 * motion (the picture source) or turn animations off in the accessibility panel (the script swaps to data-still).
 * Width and height are fixed, so nothing shifts while it loads.
 */
function recordingImg(t, data, name, { eager = false } = {}) {
  const m = data.media[name]
  if (!m) return ''
  const img = `<img src="${m.url}" width="${m.width}" height="${m.height}" alt="${esc(t(`showcase.${name}Alt`))}"${m.stillUrl ? ` data-still="${m.stillUrl}"` : ''}${
    eager ? ' fetchpriority="high"' : ' loading="lazy"'
  } decoding="async">`
  return m.stillUrl ? `<picture><source media="(prefers-reduced-motion: reduce)" srcset="${m.stillUrl}" width="${m.width}" height="${m.height}">${img}</picture>` : img
}

function recording(t, data, name, { eager = false, caption = true } = {}) {
  if (!data.media[name]) return ''
  return `<figure class="recording">${recordingImg(t, data, name, { eager })}${caption ? `<figcaption>${inline(t(`showcase.${name}Caption`))}</figcaption>` : ''}</figure>`
}

/** The hero demo: the three recordings behind small tabs (radio buttons; CSS shows the chosen one). */
function heroDemo(t, data) {
  const names = ['init', 'audit', 'explain'].filter((n) => data.media[n])
  if (!names.length) return ''
  return `<div class="demo">
<fieldset class="seg seg-demo"><legend class="visually-hidden">${esc(t('showcase.tabsLabel'))}</legend><div class="seg-options">${names
    .map((n, i) => `<label class="seg-opt"><input type="radio" name="demo" value="${n}"${i === 0 ? ' checked' : ''}><span>${icon('terminal', 16)}${esc(t(`showcase.${n}`))}</span></label>`)
    .join('')}</div></fieldset>
${names.map((n, i) => `<figure class="demo-panel" data-demo="${n}">${recordingImg(t, data, n, { eager: i === 0 })}<figcaption>${inline(t(`showcase.${n}Caption`))}</figcaption></figure>`).join('\n')}
</div>`
}

/** The real Markdown report of the example project, rendered, in a window. */
function reportWindow(t, lang, data, { sections = 3 } = {}) {
  if (!data.audit?.report) return ''
  const parts = data.audit.report.split(/\n(?=### )/)
  const shown = parts.slice(0, sections + 1).join('\n')
  const body = `<div class="report-view" tabindex="0" role="region" aria-label="frontend-report.md">${markdown(shown.replace(/^# .*\n/, ''), { ...opts(lang, data), headingBase: 4 })}</div>`
  return `<figure class="shot">${windowFrame('<code>frontend-report.md</code>', body, 'window-light')}<figcaption>${inline(t('showcase.reportCaption'))}</figcaption></figure>`
}

/** A real file in a window, for example a rule file the installer writes. */
function fileWindow(path, text, caption) {
  return `<figure class="shot">${windowFrame(`<code>${esc(path)}</code>`, codeBlock(text, path.endsWith('.mdc') || path.endsWith('.md') ? 'markdown' : ''))}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
}

const KIND = { skill: 'kindSkill', rule: 'kindRule', instructions: 'kindInstructions', config: 'kindConfig' }

/** The files of one plan as a list, the first few shown. */
function fileList(t, plan, max = 9) {
  const files = plan.files
  const shown = files.slice(0, max)
  return `<ul class="file-list">${shown
    .map((f) => `<li>${icon(f.what === 'instructions' ? 'book' : f.what === 'rule' ? 'layers' : 'file', 16)}<code>${esc(f.path)}</code><span class="kind kind-${f.what}">${esc(t(`install.${KIND[f.what] || 'kindSkill'}`))}</span></li>`)
    .join('')}${files.length > max ? `<li class="more">${esc(t('install.more', { n: files.length - max }))}</li>` : ''}</ul>`
}

/**
 * The install picker: package runner × agent, the exact command, and for each agent the files the installer plans.
 * skill: a skill name to show where that skill lands, or null for the whole sample install.
 */
function installPicker(t, lang, data, { skill = null, headingId, headingLevel = 2, title, intro }) {
  const key = next('ins')
  const sample = skill ? data.skills.find((s) => s.name === skill) : data.sampleSkill
  const runners = RUNNERS.map(
    (r, i) =>
      `<label class="seg-opt"><input type="radio" name="runner-${key}" value="${r.id}" data-template="${esc(r.command('{args}'))}"${i === 0 ? ' checked' : ''}><span>${esc(r.label)}</span></label>`
  ).join('')
  const agents = [`<label class="seg-opt"><input type="radio" name="agent-${key}" value="auto" checked><span>${esc(t('install.auto'))}</span></label>`]
    .concat(data.agents.map((a) => `<label class="seg-opt"><input type="radio" name="agent-${key}" value="${a.id}"><span>${esc(a.label)}</span></label>`))
    .join('')
  const auto = `<div class="agent-panel" data-agent="auto">
<p>${inline(t('install.autoText'))}</p>
<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(t('install.colDetect'))}"><table class="compact-table"><thead><tr><th scope="col">${esc(t('install.colAgent'))}</th><th scope="col">${esc(t('install.colDetect'))}</th></tr></thead><tbody>${data.agents
    .map((a) => `<tr><th scope="row">${esc(a.label)}</th><td>${a.detect.map((d) => `<code>${esc(d)}</code>`).join(' ') || '—'}</td></tr>`)
    .join('')}</tbody></table></div>
</div>`
  const panels = data.agents
    .map((a) => {
      const plan = sample ? data.planFor([sample.name], a.id) : null
      if (!plan) return `<div class="agent-panel" data-agent="${a.id}"></div>`
      const heading = skill ? t('install.filesSkill', { skill: sample.name, agent: a.label }) : t('install.files', { agent: a.label })
      const rule = plan.files.find((f) => f.what === 'rule')
      return `<div class="agent-panel" data-agent="${a.id}">
<h${headingLevel + 1} class="panel-title">${esc(heading)}</h${headingLevel + 1}>
<div class="panel-grid">
<div>
${fileList(t, plan)}
<p class="note">${inline(t('install.also'))}</p>
${plan.notes.map((n) => `<p class="callout callout-info">${esc(n)}</p>`).join('')}
${rule ? '' : `<p class="note">${esc(t('install.noRule', { agent: a.label }))}</p>`}
<p class="note">${esc(t('install.planned'))}</p>
</div>
${plan.preview ? fileWindow(plan.preview.path, plan.preview.text, esc(t('install.preview'))) : ''}
</div>
</div>`
    })
    .join('\n')
  return `<section class="install" data-install aria-labelledby="${headingId}">
<h${headingLevel} id="${headingId}">${icon('terminal', 24, 'icon heading-icon')}${esc(title)}</h${headingLevel}>
${intro ? `<p>${inline(intro)}</p>` : ''}
<div class="install-controls">
<fieldset class="seg" data-runners hidden><legend>${esc(t('install.runner'))}</legend><div class="seg-options">${runners}</div></fieldset>
<fieldset class="seg seg-agents"><legend>${esc(t('install.agent'))}</legend><div class="seg-options">${agents}</div></fieldset>
</div>
${command(t, RUNNERS[0].command('init'), { args: 'init' })}
<p class="callout callout-warn runner-note" hidden>${inline(t('install.untested'))}</p>
${auto}
${panels}
</section>`
}

/* ---------- Sidebars and outlines ---------- */

function rulesSidebar(t, lang, data, current = null) {
  const chapters = data.areas
    .map((a) => {
      const list = data.rules.filter((r) => r.area === a)
      const open = current ? current.area === a : false
      return `<li><details${open ? ' open' : ''}><summary>${icon(areaIcon(a), 18)}<span class="side-label">${esc(t(`ruleArea.${a}`))}</span><span class="side-count">${list.length}</span></summary><ul>
<li><a href="${href(lang, `/rules/#area-${a}`)}">${esc(t('docs.overview'))}</a></li>
${list.map((r) => `<li><a href="${href(lang, rulePath(r.id))}"${current && current.id === r.id ? ' aria-current="page"' : ''}>${esc(r.name)}</a></li>`).join('')}
</ul></details></li>`
    })
    .join('')
  return `<a class="side-top" href="${href(lang, '/rules/')}"${current ? '' : ' aria-current="page"'}>${icon('book', 18)}<span>${esc(t('docs.allRules'))}</span><span class="side-count">${data.rules.length}</span></a>
<ul class="side-chapters">${chapters}</ul>`
}

function skillsSidebar(t, lang, data, current = null) {
  const groups = data.skillAreas
    .map((a) => {
      const list = data.skills.filter((s) => s.area === a)
      const open = current ? current.area === a : true
      return `<li><details${open ? ' open' : ''}><summary>${icon(SKILL_AREA_ICON[a] || 'layers', 18)}<span class="side-label">${esc(t(`skillArea.${a}`))}</span><span class="side-count">${list.length}</span></summary><ul>
${list.map((s) => `<li><a href="${href(lang, skillPath(s.name))}"${current && current.name === s.name ? ' aria-current="page"' : ''}>${esc(s.title)}</a></li>`).join('')}
</ul></details></li>`
    })
    .join('')
  return `<a class="side-top" href="${href(lang, '/skills/')}"${current ? '' : ' aria-current="page"'}>${icon('layers', 18)}<span>${esc(t('docs.allSkills'))}</span><span class="side-count">${data.skills.length}</span></a>
<ul class="side-chapters">${groups}</ul>`
}

const GUIDE = [
  ['how', '/how-it-works/', 'book'],
  ['commands', '/commands/', 'terminal'],
  ['faq', '/faq/', 'chat'],
  ['about', '/about/', 'gift']
]

function guideSidebar(t, lang, currentPath, outlineItems) {
  return `<ul class="side-chapters side-guide">${GUIDE.map(
    ([key, p, ic]) =>
      `<li><a class="side-link" href="${href(lang, p)}"${p === currentPath ? ' aria-current="page"' : ''}>${icon(ic, 18)}<span>${esc(t(`nav.${key}`))}</span></a>${
        p === currentPath && outlineItems?.length
          ? `<ul class="side-sub">${outlineItems
              .filter((o) => o[2] !== 3)
              .map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`)
              .join('')}</ul>`
          : ''
      }</li>`
  ).join('')}</ul>
<p class="side-cta"><a href="${href(lang, '/rules/')}">${icon('book', 16)}${esc(t('docs.allRules'))}</a><a href="${href(lang, '/skills/')}">${icon('layers', 16)}${esc(t('docs.allSkills'))}</a></p>`
}

const sectionHead = (id, title, ic, level = 2) => `<h${level} id="${id}">${ic ? icon(ic, 24, 'icon heading-icon') : ''}${title}</h${level}>`

/* ---------- Home ---------- */

/* Icons drawn for the three steps (no artwork copied). */
const STEP_ICON = ['search', 'folder', 'report']

const monogram = (label) =>
  label
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

function sevCounts(t, rules) {
  return ['critical', 'serious', 'moderate', 'minor']
    .map((s) => [s, rules.filter((r) => r.severity === s).length])
    .filter(([, n]) => n)
    .map(([s, n]) => `<span class="sev sev-${s}">${n} ${esc(t(`severity.${s}`))}</span>`)
    .join(' ')
}

function home(t, lang, data) {
  const o = opts(lang, data)
  const a = data.audit
  const steps = [1, 2, 3]
    .map(
      (n) => `<li class="flow-step lift">
<div class="flow-icon">${icon(STEP_ICON[n - 1], 40)}</div>
<h3><span class="flow-num">${n}.</span> ${esc(t(`home.step${n}Title`))}</h3>
<p>${inline(t(`home.step${n}Text`), o)}</p>
<p class="flow-out">${icon('file', 16)}<code>${esc(t(`home.step${n}Out`))}</code></p>
</li>`
    )
    .join('\n')
  const tabs = [
    ['audit', recording(t, data, 'audit')],
    ['explain', recording(t, data, 'explain')],
    ['report', reportWindow(t, lang, data)],
    [
      'files',
      (() => {
        const plan = data.sampleSkill ? data.planFor([data.sampleSkill.name], 'cursor') : null
        return plan?.preview ? fileWindow(plan.preview.path, plan.preview.text, inline(t('showcase.filesCaption', { skill: data.sampleSkill.name }))) : ''
      })()
    ]
  ].filter(([, html]) => html)
  const showcase = `<div class="showcase">
<fieldset class="seg seg-tabs"><legend class="visually-hidden">${esc(t('showcase.tabsLabel'))}</legend><div class="seg-options">${tabs
    .map(([k], i) => `<label class="seg-opt"><input type="radio" name="show" value="${k}"${i === 0 ? ' checked' : ''}><span>${esc(t(`showcase.${k}`))}</span></label>`)
    .join('')}</div></fieldset>
${tabs.map(([k, html]) => `<div class="show-panel" data-show="${k}">${html}</div>`).join('\n')}
<p class="note">${inline(t('showcase.recorded'))}</p>
</div>`
  const chapterCards = data.areas
    .map((area) => {
      const list = data.rules.filter((r) => r.area === area)
      return `<li class="tile lift"><span class="tile-icon">${icon(areaIcon(area), 26)}</span><a class="tile-link" href="${href(lang, `/rules/#area-${area}`)}">${esc(t(`ruleArea.${area}`))}</a><span class="tile-meta">${esc(t('chapters.open', { n: list.length }))}</span></li>`
    })
    .join('')
  const skillGroups = data.skillAreas
    .map((area) => {
      const list = data.skills.filter((s) => s.area === area)
      return `<li class="tile tile-wide lift"><span class="tile-icon">${icon(SKILL_AREA_ICON[area] || 'layers', 26)}</span><a class="tile-link" href="${href(lang, `/skills/#sa-${area}`)}">${esc(t(`skillArea.${area}`))}</a><span class="tile-meta">${list.length} · ${esc(
        list
          .slice(0, 4)
          .map((s) => s.title)
          .join(', ')
      )}${list.length > 4 ? '…' : ''}</span></li>`
    })
    .join('')
  const agents = data.agents
    .map((ag) => `<li><span class="mono" aria-hidden="true">${esc(monogram(ag.label))}</span><span>${esc(ag.label)}</span>${ag.rule ? '<span class="agent-dot" aria-hidden="true"></span>' : ''}</li>`)
    .join('')
  const body = `<section class="hero" aria-labelledby="hero-title">
<div class="wrap hero-grid">
<div class="hero-text">
<p class="eyebrow">${icon('gift', 16)}${esc(t('home.eyebrow'))}</p>
<h1 id="hero-title">${esc(t('home.h1'))}</h1>
<p class="lead">${inline(t('home.lead'), o)}</p>
<p class="start-label">${esc(t('home.startLabel'))}</p>
${command(t, START)}
<p class="cta"><a class="button lift" href="${href(lang, '/how-it-works/')}">${esc(t('home.ctaHow'))}${icon('arrow', 18)}</a><a class="button button-ghost lift" href="${href(lang, '/skills/#install')}">${esc(t('install.title'))}</a></p>
</div>
<div class="hero-visual">${heroDemo(t, data)}</div>
</div>
</section>
<section class="stats" aria-labelledby="stats-title">
<div class="wrap">
<h2 id="stats-title" class="visually-hidden">${esc(t('home.statsLabel'))}</h2>
<ul class="stat-list">
<li><a class="lift" href="${href(lang, '/rules/')}">${icon('book', 28)}<strong>${data.rules.length}</strong><span>${esc(t('home.statRules'))}</span></a></li>
<li><a class="lift" href="${href(lang, '/skills/')}">${icon('layers', 28)}<strong>${data.skills.length}</strong><span>${esc(t('home.statSkills'))}</span></a></li>
<li><a class="lift" href="#agents-title">${icon('agent', 28)}<strong>${data.agents.length}</strong><span>${esc(t('home.statAgents'))}</span></a></li>
<li><a class="lift" href="${href(lang, '/about/')}">${icon('gift', 28)}<strong>0</strong><span>${esc(t('home.statDeps'))}</span></a></li>
</ul>
</div>
</section>
<section class="section band-dots" aria-labelledby="steps-title">
<div class="wrap">
<h2 id="steps-title">${esc(t('home.stepsTitle'))}</h2>
<p class="section-lead">${inline(t('home.stepsIntro'), o)}</p>
<div class="flow" role="group" aria-label="${esc(t('home.diagramLabel'))}">
<p class="flow-end flow-in"><span>${icon('folder', 18)}${esc(t('home.diagramIn'))}</span></p>
<ol class="flow-steps">
${steps}
</ol>
<p class="flow-end flow-result"><span>${icon('check', 18)}${esc(t('home.diagramOut'))}</span></p>
</div>
</div>
</section>
<section class="section" aria-labelledby="show-title">
<div class="wrap">
<h2 id="show-title">${esc(t('showcase.title'))}</h2>
<p class="section-lead">${inline(t('showcase.intro'), o)}</p>
${showcase}
</div>
</section>
<section class="section band-lines" id="install">
<div class="wrap">
${installPicker(t, lang, data, { headingId: 'install-title', title: t('install.title'), intro: t('install.intro') })}
</div>
</section>
<section class="section" aria-labelledby="chapters-title">
<div class="wrap">
<h2 id="chapters-title">${esc(t('chapters.title'))}</h2>
<p class="section-lead">${inline(t('chapters.intro', { rules: data.rules.length }), o)}</p>
<ul class="tile-grid">${chapterCards}</ul>
</div>
</section>
<section class="section band-dots" aria-labelledby="skills-title">
<div class="wrap">
<h2 id="skills-title">${esc(t('skillsHome.title'))}</h2>
<p class="section-lead">${inline(t('skillsHome.intro', { skills: data.skills.length }), o)}</p>
<ul class="tile-grid tile-grid-wide">${skillGroups}</ul>
</div>
</section>
<section class="section" aria-labelledby="agents-title">
<div class="wrap">
<h2 id="agents-title" tabindex="-1">${esc(t('home.agentsTitle'))}</h2>
<p class="section-lead">${inline(t('home.agentsIntro', { agentsDoc: `${BLOB}/docs/agents.md` }), o)}</p>
<ul class="agents">${agents}</ul>
<p class="agents-key"><span class="agent-dot" aria-hidden="true"></span> ${esc(t('home.agentsRules'))}: ${esc(data.agents.filter((x) => x.rule).map((x) => x.label).join(', '))}.</p>
</div>
</section>
<section class="section band-lines" aria-labelledby="free-title">
<div class="wrap cards">
<div class="card lift"><span class="card-icon">${icon('gift', 28)}</span><h2 id="free-title">${esc(t('home.freeTitle'))}</h2><p>${inline(t('home.freeText'), o)}</p></div>
<div class="card lift"><span class="card-icon">${icon('perf', 28)}</span><h2>${esc(t('home.tokensTitle'))}</h2><p>${inline(t('home.tokensText', { skills: data.skills.length, listing: data.tokens.listing, body: data.tokens.body }), o)}</p><p class="note">${inline(t('common.tokensNote', { estimator: data.tokens.estimator }), o)}</p></div>
<div class="card card-honest lift"><span class="card-icon">${icon('warning', 28)}</span><h2>${esc(t('home.honestTitle'))}</h2><p>${inline(t('home.honestText'), o)}</p></div>
</div>
</section>
<section class="cta-band" aria-labelledby="cta-title">
<div class="wrap cta-inner">
<div><h2 id="cta-title">${esc(t('cta.title'))}</h2><p>${inline(t('cta.text'), o)}</p></div>
${command(t, START)}
</div>
</section>`
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Frontend Skills',
      description: t('home.description'),
      url: ORIGIN + href(lang, '/'),
      inLanguage: lang,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux',
      softwareVersion: data.version,
      softwareRequirements: 'Node.js 20 or newer',
      license: 'https://opensource.org/license/mit',
      isAccessibleForFree: true,
      sameAs: REPO,
      author: { '@type': 'Person', name: 'Dawid Olko', url: 'https://dawidolko.pl' }
    }
  ]
  return { path: '/', title: t('home.title'), description: t('home.description'), body, jsonld }
}

/* ---------- Guide pages ---------- */

function how(t, lang, data) {
  const o = opts(lang, data)
  const outline = [
    ['profile', esc(t('how.profileTitle'))],
    ['helpers', esc(t('how.helpersTitle'))],
    ['agents', esc(t('how.agentsTitle'))],
    ['globs', esc(t('how.globsTitle'))],
    ['tokens', esc(t('how.tokensTitle'))],
    ['measured', esc(t('how.measuredTitle')), 3],
    ['lessons', esc(t('how.lessonsTitle'))],
    ['audit', esc(t('how.auditTitle'))],
    ['safe', esc(t('how.safeTitle'))]
  ]
  const profile = `{
  "version": 1,
  "packageManager": "pnpm",
  "projects": [
    {
      "path": "apps/web",
      "frameworks": { "next": "16.4.0", "react": "19.3.0" },
      "typescript": "7.0.0",
      "styling": ["tailwind"],
      "testing": ["vitest", "playwright"]
    }
  ],
  "stack": ["web", "react", "next", "typescript", "tailwind", "vitest", "playwright"],
  "helpers": {
    "rem-function": { "name": "rem-calc", "call": "rem-calc(16px)", "file": "src/styles/_functions.scss" }
  },
  "agents": ["claude", "cursor"],
  "skills": ["fe-html", "fe-react", "fe-a11y-forms"],
  "audit": { "failOn": "serious", "ignore": [], "exclude": [] }
}`
  const agentRows = data.agents
    .map(
      (ag) =>
        `<tr><th scope="row">${ag.source ? `<a href="${esc(ag.source)}">${esc(ag.label)}</a>` : esc(ag.label)}</th><td>${
          ag.skillDirs.length ? ag.skillDirs.map((d) => `<code>${esc(d)}/</code>`).join(' ') : '—'
        }</td><td>${ag.rule ? `<code>${esc(ag.rule)}</code>` : '—'}</td><td>${ag.instructions ? `<code>${esc(ag.instructions)}</code>${ag.instructionsVary ? ' *' : ''}` : '—'}</td></tr>`
    )
    .join('')
  const skillRows = data.skills
    .map(
      (s) =>
        `<tr><th scope="row"><a href="${href(lang, skillPath(s.name))}"><code>${esc(s.name)}</code></a></th><td>${s.cost.listing}</td><td>${s.cost.body}</td><td>${s.cost.refs}</td><td>${s.cost.listing + s.cost.body + s.cost.refs}</td></tr>`
    )
    .join('')
  const cursorPlan = data.sampleSkill ? data.planFor([data.sampleSkill.name], 'cursor') : null
  const a = data.audit
  const body = `<div class="page-head">
${breadcrumb(t, lang, [[esc(t('nav.home')), '/'], [esc(t('nav.how')), '/how-it-works/']])}
<h1>${esc(t('how.h1'))}</h1>
<p class="lead">${inline(t('how.lead'), o)}</p>
</div>
${recording(t, data, 'init')}
<section aria-labelledby="profile">${sectionHead('profile', esc(t('how.profileTitle')), 'search')}
<p>${inline(t('how.profileText'), o)}</p>
<figure class="shot">${windowFrame('<code>.frontend-skills/profile.json</code>', codeBlock(profile, 'json'))}<figcaption>${esc(t('common.example'))}</figcaption></figure>
<p>${inline(t('how.profileAfter'), o)}</p>
</section>
<section aria-labelledby="helpers">${sectionHead('helpers', esc(t('how.helpersTitle')), 'tooling')}
<p>${inline(t('how.helpersText'), o)}</p>
</section>
<section aria-labelledby="agents">${sectionHead('agents', esc(t('how.agentsTitle')), 'agent')}
<p>${inline(t('how.agentsText'), o)}</p>
<div class="table-wrap" tabindex="0" role="region" aria-labelledby="agents-caption"><table>
<caption id="agents-caption">${esc(t('how.agentsTable'))}</caption>
<thead><tr><th scope="col">${esc(t('how.colAgent'))}</th><th scope="col">${esc(t('how.colSkills'))}</th><th scope="col">${esc(t('how.colRules'))}</th><th scope="col">${esc(t('how.colInstructions'))}</th></tr></thead>
<tbody>${agentRows}</tbody></table></div>
<p class="note">* ${lang === 'pl' ? 'zależy od plików, które projekt już ma (na przykład istniejący <code>CLAUDE.md</code>).' : 'depends on the files the project already has (for example an existing <code>CLAUDE.md</code>).'}</p>
${installPicker(t, lang, data, { headingId: 'agents-picker', headingLevel: 3, title: t('install.title') })}
<h3 id="cover">${esc(t('how.coverTitle'))}</h3>
<p>${inline(t('how.coverText'), o)}</p>
<h3 id="blocks">${esc(t('how.blocksTitle'))}</h3>
<p>${inline(t('how.blocksText'), o)}</p>
</section>
<section aria-labelledby="globs">${sectionHead('globs', esc(t('how.globsTitle')), 'layers')}
<p>${inline(t('how.globsText', { skill: data.sampleSkill?.name || 'fe-html' }), o)}</p>
${cursorPlan?.preview ? fileWindow(cursorPlan.preview.path, cursorPlan.preview.text, inline(t('showcase.filesCaption', { skill: data.sampleSkill.name }))) : ''}
</section>
<section aria-labelledby="tokens">${sectionHead('tokens', esc(t('how.tokensTitle')), 'perf')}
<p>${inline(t('how.tokensText'), o)}</p>
<div class="table-wrap" tabindex="0" role="region" aria-labelledby="tokens-caption"><table>
<caption id="tokens-caption" class="visually-hidden">${esc(t('how.budgetsCaption'))}</caption>
<thead><tr><th scope="col">${esc(t('how.budgetPart'))}</th><th scope="col">${esc(t('how.budgetOurs'))}</th><th scope="col">${esc(t('how.budgetSpec'))}</th></tr></thead>
<tbody>
<tr><th scope="row">${inline(t('how.budgetDescription'))}</th><td>400 ${lang === 'pl' ? 'znaków' : 'characters'}</td><td>1024</td></tr>
<tr><th scope="row">${inline(t('how.budgetSkill'))}</th><td>${lang === 'pl' ? '120 linii i 1800 tokenów' : '120 lines and 1,800 tokens'}</td><td>${lang === 'pl' ? 'poniżej 500 linii i 5000 tokenów (zalecenie)' : 'under 500 lines and 5,000 tokens (recommended)'}</td></tr>
<tr><th scope="row">${inline(t('how.budgetDigest'))}</th><td>${lang === 'pl' ? '12 punktów i 450 tokenów' : '12 bullets and 450 tokens'}</td><td>${esc(t('how.budgetNone'))}</td></tr>
<tr><th scope="row">${inline(t('how.budgetReference'))}</th><td>${lang === 'pl' ? '300 linii i 4000 tokenów' : '300 lines and 4,000 tokens'}</td><td>${esc(t('how.budgetNone'))}</td></tr>
<tr><th scope="row">${inline(t('how.budgetBlock'))}</th><td>${lang === 'pl' ? '250 tokenów' : '250 tokens'}</td><td>${esc(t('how.budgetNone'))}</td></tr>
</tbody></table></div>
<h3 id="measured">${esc(t('how.measuredTitle'))}</h3>
<p>${inline(t('how.measuredText', { listing: data.tokens.listing, skills: data.skills.length }), o)}</p>
<div class="table-wrap table-tall" tabindex="0" role="region" aria-labelledby="measured"><table class="numbers">
<thead><tr><th scope="col">${esc(t('how.colSkill'))}</th><th scope="col">${esc(t('how.colListing'))}</th><th scope="col">${esc(t('how.colBody'))}</th><th scope="col">${esc(t('how.colRefs'))}</th><th scope="col">${esc(t('how.colTotal'))}</th></tr></thead>
<tbody>${skillRows}</tbody></table></div>
<p class="note">${inline(t('common.tokensNote', { estimator: data.tokens.estimator }), o)}</p>
</section>
<section aria-labelledby="lessons">${sectionHead('lessons', esc(t('how.lessonsTitle')), 'chat')}
<p>${inline(t('how.lessonsText'), o)}</p>
<p>${esc(t('how.lessonsCommand'))}</p>
${command(t, `npx ${PKG} learn --lesson "Form fields use components/ui/Field.tsx" --kind convention`)}
${fileWindow('.frontend-skills/lessons.md', '- 2026-11-11 · convention · Form fields use components/ui/Field.tsx, which renders label, hint and error. [a11y/input-label]', '')}
</section>
<section aria-labelledby="audit">${sectionHead('audit', esc(t('how.auditTitle')), 'report')}
<p>${inline(t('how.auditText'), o)}</p>
<div class="cards cards-3">
<div class="card"><span class="card-icon">${icon('file', 24)}</span><h3>${esc(t('how.auditStatic'))}</h3><p>${inline(t('how.auditStaticText'), o)}</p></div>
<div class="card"><span class="card-icon">${icon('system', 24)}</span><h3>${esc(t('how.auditBrowser'))}</h3><p>${inline(t('how.auditBrowserText'), o)}</p></div>
<div class="card"><span class="card-icon">${icon('a11y', 24)}</span><h3>${esc(t('how.auditManual'))}</h3><p>${inline(t('how.auditManualText'), o)}</p></div>
</div>
${recording(t, data, 'audit')}
${reportWindow(t, lang, data)}
${
  a
    ? `<h3 id="json">${esc(t('how.jsonTitle'))}</h3>
<p>${inline(t('how.jsonText'), o)}</p>
<pre class="terminal wrap-lines" tabindex="0"><code><span class="prompt">$ </span>${esc(`${a.command} --json`)}
${esc(a.json)}</code></pre>`
    : ''
}
<p>${inline(t('how.exitText'), o)}</p>
${recording(t, data, 'explain')}
<h3 id="ignore">${esc(t('how.ignoreTitle'))}</h3>
<p>${inline(t('how.ignoreText'), o)}</p>
</section>
<section aria-labelledby="safe">${sectionHead('safe', esc(t('how.safeTitle')), 'security')}
<p>${inline(t('how.safeText'), o)}</p>
</section>`
  return {
    path: '/how-it-works/',
    title: t('how.title'),
    description: t('how.description'),
    body,
    docs: { label: t('docs.sidebarGuide'), sidebar: guideSidebar(t, lang, '/how-it-works/', outline), outline }
  }
}

function commandsPage(t, lang, data) {
  const o = opts(lang, data)
  const ICON = { init: 'gift', audit: 'report', learn: 'search', list: 'layers', explain: 'book', doctor: 'a11y', update: 'workflow', uninstall: 'close', tokens: 'perf' }
  const outline = data.commands.map((c) => [`c-${c.name}`, `<code>${esc(c.name)}</code>`])
  const items = data.commands
    .map(
      (c) => `<section class="command-card" aria-labelledby="c-${c.name}">
<h2 id="c-${c.name}">${icon(ICON[c.name] || 'terminal', 24, 'icon heading-icon')}<code>${esc(c.name)}</code> <span class="status status-${c.built ? 'ok' : 'soon'}">${esc(t(c.built ? 'commands.available' : 'commands.coming'))}</span></h2>
<p>${inline(t(`commands.items.${c.name}`), o)}</p>
${c.built ? command(t, `npx ${PKG} ${c.name}${c.name === 'explain' ? ' a11y/img-alt' : ''}`) : ''}
${['init', 'audit', 'explain'].includes(c.name) ? recording(t, data, c.name) : ''}
${c.help ? `<details><summary>${inline(t('commands.usage'), o)}</summary><pre class="terminal" tabindex="0"><code>${esc(c.help)}</code></pre></details>` : ''}
</section>`
    )
    .join('\n')
  const body = `<div class="page-head">
${breadcrumb(t, lang, [[esc(t('nav.home')), '/'], [esc(t('nav.commands')), '/commands/']])}
<h1>${esc(t('commands.h1'))}</h1>
<p class="lead">${inline(t('commands.lead'), o)}</p>
</div>
${items}`
  return {
    path: '/commands/',
    title: t('commands.title'),
    description: t('commands.description'),
    body,
    docs: { label: t('docs.sidebarGuide'), sidebar: guideSidebar(t, lang, '/commands/', outline), outline }
  }
}

function faq(t, lang, data) {
  const o = opts(lang, data)
  const vars = { agents: data.agents.map((a) => a.label).join(', '), agentsDoc: `${BLOB}/docs/agents.md`, authoringDoc: `${BLOB}/docs/authoring.md` }
  const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
  const items = t.raw('faq.items')
  const outline = items.map(([q], i) => [`q${i + 1}`, esc(q)])
  const body = `<div class="page-head">
${breadcrumb(t, lang, [[esc(t('nav.home')), '/'], [esc(t('nav.faq')), '/faq/']])}
<h1>${esc(t('faq.h1'))}</h1>
</div>
<div class="faq">
${items.map(([q, a], i) => `<section class="faq-item" aria-labelledby="q${i + 1}"><h2 id="q${i + 1}">${esc(q)}</h2><p>${inline(fill(a), o)}</p></section>`).join('\n')}
</div>`
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: plain(fill(a)) } }))
    }
  ]
  return { path: '/faq/', title: t('faq.title'), description: t('faq.description'), body, jsonld, docs: { label: t('docs.sidebarGuide'), sidebar: guideSidebar(t, lang, '/faq/', []), outline } }
}

function about(t, lang, data) {
  const o = opts(lang, data)
  const standards = t.raw('about.standards')
  const outline = [
    ['licence', esc(t('about.licenceTitle'))],
    ['author', esc(t('about.authorTitle'))],
    ['credits', esc(t('about.creditsTitle'))],
    ['standards', esc(t('about.standardsTitle'))],
    ['this-site', esc(t('about.siteTitle'))],
    ['a11y', esc(t('about.accessibilityTitle'))]
  ]
  const body = `<div class="page-head">
${breadcrumb(t, lang, [[esc(t('nav.home')), '/'], [esc(t('nav.about')), '/about/']])}
<h1>${esc(t('about.h1'))}</h1>
</div>
<section aria-labelledby="licence">${sectionHead('licence', esc(t('about.licenceTitle')), 'gift')}<p>${inline(t('about.licenceText', { licence: `${BLOB}/LICENSE` }), o)}</p></section>
<section aria-labelledby="author">${sectionHead('author', esc(t('about.authorTitle')), 'chat')}<p>${inline(t('about.authorText'), o)}</p></section>
<section aria-labelledby="credits">${sectionHead('credits', esc(t('about.creditsTitle')), 'quality')}
<p>${data.thirdParty ? inline(t('about.creditsText', { thirdParty: `${BLOB}/THIRD-PARTY.md` }), o) : esc(t('about.creditsSite'))}</p>
<ul><li>${inline(t('about.creditFont'), o)}</li><li>${inline(t('about.creditPanel'), o)}</li></ul>
</section>
<section aria-labelledby="standards">${sectionHead('standards', esc(t('about.standardsTitle')), 'book')}<p>${esc(t('about.standardsText'))}</p>
<ul>${standards.map(([name, url]) => `<li>${url ? `<a href="${esc(url)}">${esc(name)}</a>` : esc(name)}</li>`).join('')}</ul></section>
<section aria-labelledby="this-site">${sectionHead('this-site', esc(t('about.siteTitle')), 'system')}<p>${inline(t('about.siteText'), o)}</p></section>
<section aria-labelledby="a11y">${sectionHead('a11y', esc(t('about.accessibilityTitle')), 'a11y')}<p>${inline(t('about.accessibilityText', { issues: `${REPO}/issues` }), o)}</p></section>
<p class="note">${esc(t('common.builtOn', { version: data.version }))}</p>`
  return { path: '/about/', title: t('about.title'), description: t('about.description'), body, docs: { label: t('docs.sidebarGuide'), sidebar: guideSidebar(t, lang, '/about/', outline), outline } }
}

/* ---------- The dictionary ---------- */

function ruleRow(t, lang, r) {
  return `<li data-id="${esc(r.id)}" data-a="${r.area}" data-s="${r.severity}" data-c="${r.check}"><a class="rule-id" href="${href(lang, rulePath(r.id))}"><code>${esc(r.id)}</code></a><span class="rule-title">${inline(r.title, {
    noLinks: true
  })}</span><span class="rule-meta">${sev(t, r.severity)}${chk(t, r.check)}${r.wcag.length ? `<span class="tag">WCAG ${esc(r.wcag.join(', '))}</span>` : ''}</span></li>`
}

function rulesIndex(t, lang, data) {
  const o = opts(lang, data)
  const select = (name, label, values, labelOf) =>
    `<div class="tool tool-select"><label for="f-${name}">${esc(label)}</label><select id="f-${name}" name="${name}"><option value="">${esc(t('rules.all'))}</option>${values
      .map((v) => `<option value="${esc(v)}">${esc(labelOf(v))}</option>`)
      .join('')}</select></div>`
  const groups = data.areas
    .map((area) => {
      const list = data.rules.filter((r) => r.area === area)
      return `<section class="rule-group" aria-labelledby="area-${area}">
<h2 id="area-${area}">${icon(areaIcon(area), 26, 'icon heading-icon')}${esc(t(`ruleArea.${area}`))} <span class="count">${esc(t('rules.areaCount', { n: list.length }))}</span></h2>
<ul class="rule-rows">${list.map((r) => ruleRow(t, lang, r)).join('')}</ul>
</section>`
    })
    .join('\n')
  const outline = data.areas.map((a) => [`area-${a}`, esc(t(`ruleArea.${a}`))])
  const body = `<div class="page-head">
${breadcrumb(t, lang, [[esc(t('nav.home')), '/'], [esc(t('nav.rules')), '/rules/']])}
<h1>${esc(t('rules.h1'))}</h1>
<p class="lead">${inline(t('rules.lead'), o)}</p>
</div>
<form class="toolbar" id="rule-filters" role="search" aria-label="${esc(t('rules.filtersLabel'))}" data-index="/rules/index.json" data-count="${esc(t('rules.count'))}" data-count-all="${esc(t('rules.countAll'))}" hidden>
<div class="tool tool-search"><label for="f-q">${esc(t('rules.search'))}</label><span class="search-box">${icon('search', 18)}<input id="f-q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(t('rules.searchHint'))}"></span></div>
${select('area', t('rules.area'), data.areas, (a) => t(`ruleArea.${a}`))}
${select('severity', t('rules.severity'), data.severities, (s) => t(`severity.${s}`))}
${select('check', t('rules.check'), data.checkKinds, (c) => t(`check.${c}`))}
<div class="tool tool-reset"><button type="reset" class="button button-ghost button-small">${icon('close', 16)}${esc(t('rules.reset'))}</button></div>
</form>
<p class="rule-count" id="rule-count">${esc(t('rules.countAll', { total: data.rules.length }))}</p>
<p class="empty" id="rule-empty" hidden>${esc(t('rules.empty'))}</p>
${groups}
<p class="note">${inline(t('rules.explainHint'), o)}</p>`
  return {
    path: '/rules/',
    title: t('rules.title'),
    description: t('rules.description'),
    body,
    docs: { label: t('docs.sidebarRules'), sidebar: rulesSidebar(t, lang, data), outline }
  }
}

function rulePage(t, lang, data, r, i) {
  const o = { ...opts(lang, data), base: `${BLOB}/rules/${r.id}/` }
  const prev = data.rules[i - 1]
  const nextRule = data.rules[i + 1]
  const crumbs = [
    [esc(t('nav.home')), '/'],
    [esc(t('nav.rules')), '/rules/'],
    [esc(t(`ruleArea.${r.area}`)), `/rules/#area-${r.area}`],
    [`<code>${esc(r.id)}</code>`, rulePath(r.id)]
  ]
  const facts = [
    [t('rule.id'), `<code>${esc(r.id)}</code>`],
    [t('severity.label'), sev(t, r.severity)],
    [t('check.label'), `${chk(t, r.check)} <span class="dim">${inline(t(`check.${r.check}Long`))}</span>`],
    [t('rule.applies'), r.applies.map((x) => `<code>${esc(x)}</code>`).join(' ')],
    r.stack.length ? [t('rule.stack'), r.stack.map((x) => `<code>${esc(x)}</code>`).join(' ')] : null,
    r.requires.length ? [t('rule.requires'), r.requires.map((x) => `<code>${esc(x)}</code>`).join(' ')] : null,
    r.wcag.length ? [t('rule.wcag'), `${r.wcag.map((x) => esc(x)).join(', ')}${r.level ? `, ${esc(t('rule.level'))} ${esc(r.level)}` : ''}`] : null,
    r.axe.length || r.lighthouse.length
      ? [t('rule.tools'), [...r.axe.map((x) => `axe-core <code>${esc(x)}</code>`), ...r.lighthouse.map((x) => `Lighthouse <code>${esc(x)}</code>`)].join(', ')]
      : null,
    r.skillObj ? [t('rule.skill'), `<a href="${href(lang, skillPath(r.skillObj.name))}"><code>${esc(r.skillObj.name)}</code></a> ${esc(r.skillObj.title)}`] : r.skill ? [t('rule.skill'), `<code>${esc(r.skill)}</code>`] : null,
    r.since ? [t('rule.since'), esc(r.since)] : null
  ].filter(Boolean)
  const deprecated =
    r.status === 'deprecated' && r.replacedBy
      ? `<p class="callout callout-warn">${t('rule.deprecated', { replacement: `<a href="${href(lang, rulePath(r.replacedBy))}"><code>${esc(r.replacedBy)}</code></a>` })}</p>`
      : ''
  const outline = [
    ['why', esc(t('rule.why'))],
    ['fix', esc(t('rule.fix'))],
    r.examples ? ['examples', esc(t('rule.examples'))] : null,
    ['sources', esc(t('common.sources'))],
    ['facts', esc(t('rule.facts'))],
    ['explain', esc(t('rule.explain'))]
  ].filter(Boolean)
  const body = `<div class="page-head">
${breadcrumb(t, lang, crumbs)}
<p class="eyebrow eyebrow-docs">${icon(areaIcon(r.area), 16)}${esc(t(`ruleArea.${r.area}`))}</p>
<h1 class="rule-h1"><code>${esc(r.id)}</code></h1>
<p class="lead">${inline(r.title, o)}</p>
<p class="chips">${sev(t, r.severity)}${chk(t, r.check)}${r.wcag.length ? `<span class="tag">WCAG ${esc(r.wcag.join(', '))}${r.level ? ` · ${esc(r.level)}` : ''}</span>` : ''}${
    r.skillObj ? `<a class="tag tag-link" href="${href(lang, skillPath(r.skillObj.name))}">${icon('layers', 14)}${esc(r.skillObj.name)}</a>` : ''
  }</p>
${r.hasPlaceholder ? `<p class="note">${inline(t('rule.placeholderNote'), o)}</p>` : ''}
</div>
${deprecated}
<section aria-labelledby="why"><h2 id="why">${esc(t('rule.why'))}</h2>${markdown(r.why, o)}</section>
<section aria-labelledby="fix"><h2 id="fix">${esc(t('rule.fix'))}</h2>${markdown(r.fix.replace(/\{\{[^|}]+\|([^}]*)\}\}/g, '$1'), o)}</section>
${r.examples ? `<section aria-labelledby="examples"><h2 id="examples">${esc(t('rule.examples'))}</h2>${markdown(r.examples, o)}</section>` : ''}
<section aria-labelledby="sources"><h2 id="sources">${esc(t('common.sources'))}</h2><ul class="sources">${r.sources
    .map((s) => `<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`)
    .join('')}</ul></section>
<section aria-labelledby="facts" class="facts"><h2 id="facts">${esc(t('rule.facts'))}</h2>
<dl>${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>
<p><a href="${BLOB}/rules/${esc(r.id)}/rule.md">${icon('github', 16)}${esc(t('rule.editOnGithub'))}</a></p>
</section>
<section aria-labelledby="explain"><h2 id="explain">${esc(t('rule.explain'))}</h2>${command(t, `npx ${PKG} explain ${r.id}`)}</section>
<nav class="pager" aria-label="${esc(t('rule.prev'))} / ${esc(t('rule.next'))}">
${prev ? `<a class="pager-link lift" href="${href(lang, rulePath(prev.id))}" rel="prev"><span>← ${esc(t('rule.prev'))}</span><code>${esc(prev.id)}</code></a>` : '<span></span>'}
${nextRule ? `<a class="pager-link pager-next lift" href="${href(lang, rulePath(nextRule.id))}" rel="next"><span>${esc(t('rule.next'))} →</span><code>${esc(nextRule.id)}</code></a>` : '<span></span>'}
</nav>`
  const title = `${r.id}: ${plain(r.title)}`
  return {
    path: rulePath(r.id),
    section: '/rules/',
    title: title.length > 70 ? `${r.id} ${t('rule.titleSuffix')}` : title,
    description: `${plain(r.title)} ${plain(r.why)}`.slice(0, 155).replace(/\s+\S*$/, '…'),
    body,
    ogType: 'article',
    jsonld: [breadcrumbLd(lang, crumbs.filter((c) => !c[1].includes('#')))],
    docs: { label: t('docs.sidebarRules'), sidebar: rulesSidebar(t, lang, data, r), outline }
  }
}

/* ---------- Skills ---------- */

const requiresText = (t, s) => s.requires.map((k) => (k === 'web' ? esc(t('skills.web')) : `<code>${esc(k)}</code>`)).join(', ')

function skillTile(t, lang, data, s) {
  const rules = s.ruleList.map((id) => data.rules.find((r) => r.id === id)).filter(Boolean)
  return `<li class="skill-tile lift">
<div class="skill-tile-head"><span class="tile-icon">${icon(SKILL_AREA_ICON[s.area] || 'layers', 22)}</span><div><h3><a class="tile-link" href="${href(lang, skillPath(s.name))}">${esc(s.title)}</a></h3><p class="skill-name"><code>${esc(s.name)}</code></p></div></div>
<p>${inline(s.description.split(/(?<=\.)\s+Use when/)[0], { noLinks: true })}</p>
<p class="skill-meta"><span>${icon('framework', 14)}${requiresText(t, s)}</span><span>${icon('book', 14)}${esc(t('skills.rulesCount', { n: rules.length }))}</span><span>${icon('perf', 14)}${esc(t('skills.tokens', { n: s.cost.body }))}</span></p>
${rules.length ? `<p class="sev-mix">${sevCounts(t, rules)}</p>` : ''}
</li>`
}

function skillsIndex(t, lang, data) {
  const o = opts(lang, data)
  const groups = data.skillAreas
    .map((area) => {
      const list = data.skills.filter((s) => s.area === area)
      return `<section class="skill-group" aria-labelledby="sa-${area}">${sectionHead(`sa-${area}`, `${esc(t(`skillArea.${area}`))} <span class="count">${list.length}</span>`, SKILL_AREA_ICON[area] || 'layers')}
<ul class="skill-grid">${list.map((s) => skillTile(t, lang, data, s)).join('')}</ul></section>`
    })
    .join('\n')
  const outline = [['install', esc(t('install.title'))], ...data.skillAreas.map((a) => [`sa-${a}`, esc(t(`skillArea.${a}`))])]
  const body = `<div class="page-head">
${breadcrumb(t, lang, [[esc(t('nav.home')), '/'], [esc(t('nav.skills')), '/skills/']])}
<h1>${esc(t('skills.h1'))}</h1>
<p class="lead">${inline(t('skills.lead'), o)}</p>
</div>
${installPicker(t, lang, data, { headingId: 'install', title: t('install.title'), intro: t('install.intro') })}
${groups}
<p class="note">${inline(t('common.tokensNote', { estimator: data.tokens.estimator }), o)}</p>`
  return {
    path: '/skills/',
    title: t('skills.title'),
    description: t('skills.description'),
    body,
    docs: { label: t('docs.sidebarSkills'), sidebar: skillsSidebar(t, lang, data), outline }
  }
}

function skillPage(t, lang, data, s) {
  const o = { ...opts(lang, data), base: `${BLOB}/${s.rel}/` }
  const crumbs = [
    [esc(t('nav.home')), '/'],
    [esc(t('nav.skills')), '/skills/'],
    [esc(s.title), skillPath(s.name)]
  ]
  const rules = s.ruleList.map((id) => data.rules.find((r) => r.id === id)).filter(Boolean)
  const sec = s.sections
  const firstRule = rules[0]?.id || 'a11y/img-alt'
  const prompts = s.prompts.length
    ? `<p>${esc(t('skillx.promptsFromSkill'))}</p><ul class="prompts">${s.prompts.map((p) => `<li lang="en">${icon('chat', 18)}<span>${esc(p)}</span></li>`).join('')}</ul>`
    : ''
  const generic = `<p>${esc(t('skillx.promptsGeneric'))}</p><ul class="prompts">${[t('skillx.prompt1', { name: s.name }), t('skillx.prompt2'), t('skillx.prompt3', { rule: firstRule })]
    .map((p) => `<li>${icon('chat', 18)}<span>${esc(p)}</span></li>`)
    .join('')}</ul>`
  const outline = [
    ['install', esc(t('skillx.install'))],
    ['how-to', esc(t('skillx.howTo'))],
    ['rules', esc(t('skill.rules'))],
    sec.rules ? ['digest', esc(t('skill.digest'))] : null,
    sec['do this'] ? ['do', esc(t('skill.doThis'))] : null,
    sec.check ? ['check', esc(t('skill.checkTitle'))] : null,
    ['checked', esc(t('skillx.checked'))],
    s.references.length ? ['refs', esc(t('skill.references'))] : null
  ].filter(Boolean)
  const body = `<div class="page-head">
${breadcrumb(t, lang, crumbs)}
<p class="eyebrow eyebrow-docs">${icon(SKILL_AREA_ICON[s.area] || 'layers', 16)}${esc(t(`skillArea.${s.area}`))}</p>
<h1>${esc(s.title)}</h1>
<p class="lead">${inline(s.description, { noLinks: true })}</p>
<p class="chips"><span class="tag"><code>${esc(s.name)}</code></span><span class="tag">${icon('framework', 14)}${requiresText(t, s)}</span><span class="tag">${icon('book', 14)}${esc(
    t('skills.rulesCount', { n: rules.length })
  )}</span><span class="tag">${icon('perf', 14)}${esc(t('skill.costText', { listing: s.cost.listing, body: s.cost.body, refs: s.cost.refs }))}</span></p>
</div>
${installPicker(t, lang, data, { skill: s.name, headingId: 'install', title: t('skillx.install'), intro: t('skillx.installText', { stack: s.requires.map((k) => (k === 'web' ? t('skills.web') : k)).join(', ') }) })}
<section aria-labelledby="how-to">${sectionHead('how-to', esc(t('skillx.howTo')), 'chat')}
<p>${esc(t('skillx.howToText'))}</p>
${prompts}
${generic}
</section>
<section aria-labelledby="rules">${sectionHead('rules', esc(t('skill.rules')), 'book')}
${
  rules.length
    ? `<ul class="rule-cards">${rules
        .map(
          (r) =>
            `<li class="rule-card lift sev-edge-${r.severity}"><a class="rule-id tile-link" href="${href(lang, rulePath(r.id))}"><code>${esc(r.id)}</code></a><p>${inline(r.title, { noLinks: true })}</p><p class="rule-meta">${sev(t, r.severity)}${chk(t, r.check)}${
              r.wcag.length ? `<span class="tag">WCAG ${esc(r.wcag.join(', '))}</span>` : ''
            }</p></li>`
        )
        .join('')}</ul>`
    : `<p>${esc(t('skillx.noRules'))}</p>`
}
</section>
${sec.rules ? `<section aria-labelledby="digest">${sectionHead('digest', esc(t('skill.digest')), 'layers')}<p>${esc(t('skill.digestText'))}</p><div class="digest" lang="en">${markdown(sec.rules, o)}</div></section>` : ''}
${sec['do this'] ? `<section aria-labelledby="do">${sectionHead('do', esc(t('skill.doThis')), 'workflow')}<div lang="en">${markdown(sec['do this'], o)}</div></section>` : ''}
${sec.check ? `<section aria-labelledby="check">${sectionHead('check', esc(t('skill.checkTitle')), 'check')}<div lang="en">${markdown(sec.check, o)}</div></section>` : ''}
<section aria-labelledby="checked">${sectionHead('checked', esc(t('skillx.checked')), 'report')}
<p>${inline(t('skillx.checkedText'))}</p>
${recording(t, data, 'audit')}
</section>
${
  s.references.length
    ? `<section aria-labelledby="refs">${sectionHead('refs', esc(t('skill.references')), 'file')}<ul class="file-list">${s.references
        .map((r) => `<li>${icon('file', 16)}<a href="${BLOB}/${s.rel}/references/${esc(r.file)}"><code>references/${esc(r.file)}</code></a><span class="kind">${r.tokens} ${esc(t.plural('tokens', r.tokens))}</span></li>`)
        .join('')}</ul></section>`
    : ''
}
<p class="source-link"><a href="${BLOB}/${s.rel}/SKILL.md">${icon('github', 16)}${esc(t('skill.editOnGithub'))}</a></p>`
  return {
    path: skillPath(s.name),
    section: '/skills/',
    title: `${s.title} (${s.name})`,
    description: plain(s.description).slice(0, 155).replace(/\s+\S*$/, '…'),
    body,
    ogType: 'article',
    jsonld: [breadcrumbLd(lang, crumbs)],
    docs: { label: t('docs.sidebarSkills'), sidebar: skillsSidebar(t, lang, data, s), outline }
  }
}

/* ---------- Not found ---------- */

function notFound(t, lang, data, other) {
  const part = (tt, l) => `<div class="not-found-part" lang="${l}">
<h${l === lang ? 1 : 2}>${esc(tt('notFound.h1'))}</h${l === lang ? 1 : 2}>
<p class="lead">${esc(tt('notFound.text'))}</p>
<p class="cta"><a class="button" href="${href(l, '/')}">${esc(tt('notFound.home'))}</a> <a class="button button-ghost" href="${href(l, '/rules/')}">${esc(tt('notFound.rules'))}</a></p>
</div>`
  const body = `<div class="section"><div class="wrap narrow">
${part(t, lang)}
${other ? part(other, other.lang) : ''}
</div></div>`
  return { path: '/404.html', title: t('notFound.title'), description: t('notFound.description'), body, noindex: true, alternates: false }
}

/** Every page of one language, in sitemap order. */
export function pagesFor(t, lang, data, other) {
  const fresh = (fn) => (...a) => {
    uid = 0
    return fn(...a)
  }
  return [
    fresh(home)(t, lang, data),
    fresh(how)(t, lang, data),
    fresh(rulesIndex)(t, lang, data),
    ...data.rules.map((r, i) => fresh(rulePage)(t, lang, data, r, i)),
    fresh(skillsIndex)(t, lang, data),
    ...data.skills.map((s) => fresh(skillPage)(t, lang, data, s)),
    fresh(commandsPage)(t, lang, data),
    fresh(faq)(t, lang, data),
    fresh(about)(t, lang, data),
    ...(lang === 'en' ? [fresh(notFound)(t, lang, data, other)] : [])
  ]
}

export { EXAMPLE_PROJECT }
