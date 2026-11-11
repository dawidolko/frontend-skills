/*
 * The body of every page of the site, in one language at a time: home, how it works, the rule dictionary and one
 * page per rule, skills by technology and one page per skill, commands, questions and answers, licence and credits,
 * and the not-found page. Each function returns { path, title, description, body, section, jsonld } for layout().
 */
import { BLOB, REPO, START, EXAMPLE_PROJECT } from './data.mjs'
import { ORIGIN, href } from './layout.mjs'
import { codeBlock, esc, inline, markdown, plain } from './markdown.mjs'

const rulePath = (id) => `/rules/${id}/`
const skillPath = (name) => `/skills/${name}/`

let copyId = 0
/** A command in a box with a copy button (the button is shown by the script; without it the text stays selectable). */
function command(t, text, label) {
  const id = `cmd-${++copyId}`
  const breakable = esc(text).replace(/(github:|\/)/g, '$1<wbr>')
  return `<div class="command"><pre class="command-text"><code id="${id}">${breakable}</code></pre><button type="button" class="copy-button" data-copy="${id}" data-done="${esc(t('common.copied'))}" data-fail="${esc(t('common.copyFailed'))}" aria-label="${esc(label || t('common.copyLabel'))}" hidden>${esc(t('common.copy'))}</button></div>`
}

const sev = (t, s) => `<span class="sev sev-${s}">${esc(t(`severity.${s}`))}</span>`
const chk = (t, c) => `<span class="tag tag-${c}">${esc(t(`check.${c}`))}</span>`

function opts(lang, data) {
  return { ruleHref: (id) => (data.ruleIds.has(id) ? href(lang, rulePath(id)) : null) }
}

const pageHead = (t, h1Key, leadKey, o, extra = '') =>
  `<div class="page-head"><div class="wrap">${extra}<h1>${inline(t(h1Key), o)}</h1>${leadKey ? `<p class="lead">${inline(t(leadKey), o)}</p>` : ''}</div></div>`

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

/* Icons drawn for the three steps (no artwork copied): a magnifier over a file, a fan of folders, a checked list. */
const STEP_ICONS = [
  `<svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false"><path d="M12 6h16l8 8v12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 6v34h12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M28 6v8h8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="33" cy="33" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m38 38 5 5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  `<svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false"><path d="M6 14h12l3 4h21v20H6z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 27h20M14 32h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M10 9h10l2 3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  `<svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false"><rect x="8" y="6" width="32" height="36" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m14 17 3 3 6-6M14 31l3 3 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 18h8M27 32h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`
]

/* A monogram from an agent's name: its own lettering, no trademarked artwork. */
const monogram = (label) =>
  label
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

function home(t, lang, data) {
  const o = opts(lang, data)
  const a = data.audit
  const f = a?.finding
  const steps = [1, 2, 3]
    .map(
      (n) => `<li class="flow-step">
<div class="flow-icon">${STEP_ICONS[n - 1]}</div>
<h3><span class="flow-num">${n}.</span> ${esc(t(`home.step${n}Title`))}</h3>
<p>${inline(t(`home.step${n}Text`), o)}</p>
<p class="flow-out"><code>${esc(t(`home.step${n}Out`))}</code></p>
</li>`
    )
    .join('\n')
  const agents = data.agents
    .map((ag) => `<li><span class="mono" aria-hidden="true">${esc(monogram(ag.label))}</span><span>${esc(ag.label)}</span>${ag.rule ? '<span class="agent-dot" aria-hidden="true"></span>' : ''}</li>`)
    .join('')
  const finding = f
    ? `<article class="finding" aria-labelledby="finding-title">
<h3 id="finding-title" class="visually-hidden">${esc(t('home.reportFinding'))}</h3>
<dl class="finding-grid">
<dt>${esc(t('home.reportRule'))}</dt><dd><a href="${href(lang, rulePath(f.rule.id))}"><code>${esc(f.rule.id)}</code></a> ${sev(t, f.severity)}</dd>
<dt>${esc(t('home.reportWhere'))}</dt><dd><code>${esc(f.at)}</code></dd>
<dt>${esc(t('home.reportWhy'))}</dt><dd>${inline(f.rule.why, o)}</dd>
<dt>${esc(t('home.reportFix'))}</dt><dd>${inline(f.fix, o)}</dd>
<dt>${esc(t('home.reportSource'))}</dt><dd>${f.rule.sources[0] ? `<a href="${esc(f.rule.sources[0].url)}">${esc(f.rule.sources[0].title)}</a>` : ''}</dd>
</dl>
</article>`
    : ''
  const body = `<section class="hero" aria-labelledby="hero-title">
<div class="wrap hero-inner">
<p class="eyebrow">${esc(t('home.eyebrow'))}</p>
<h1 id="hero-title">${esc(t('home.h1'))}</h1>
<p class="lead">${inline(t('home.lead'), o)}</p>
<p class="start-label" id="start-label">${esc(t('home.startLabel'))}</p>
${command(t, START)}
<p class="cta"><a class="button" href="${href(lang, '/how-it-works/')}">${esc(t('home.ctaHow'))}</a> <a class="button button-ghost" href="${href(lang, '/rules/')}">${esc(t('home.ctaRules'))}</a></p>
</div>
</section>
<section class="stats" aria-labelledby="stats-title">
<div class="wrap">
<h2 id="stats-title" class="visually-hidden">${esc(t('home.statsLabel'))}</h2>
<ul class="stat-list">
<li><a href="${href(lang, '/rules/')}"><strong>${data.rules.length}</strong> <span>${esc(t('home.statRules'))}</span></a></li>
<li><a href="${href(lang, '/skills/')}"><strong>${data.skills.length}</strong> <span>${esc(t('home.statSkills'))}</span></a></li>
<li><a href="#agents-title"><strong>${data.agents.length}</strong> <span>${esc(t('home.statAgents'))}</span></a></li>
<li><a href="${href(lang, '/about/')}"><strong>0</strong> <span>${esc(t('home.statDeps'))}</span></a></li>
</ul>
</div>
</section>
<section class="section" aria-labelledby="steps-title">
<div class="wrap">
<h2 id="steps-title">${esc(t('home.stepsTitle'))}</h2>
<p>${inline(t('home.stepsIntro'), o)}</p>
<div class="flow" role="group" aria-label="${esc(t('home.diagramLabel'))}">
<p class="flow-end flow-in"><span>${esc(t('home.diagramIn'))}</span></p>
<ol class="flow-steps">
${steps}
</ol>
<p class="flow-end flow-result"><span>${esc(t('home.diagramOut'))}</span></p>
</div>
</div>
</section>
${
  a
    ? `<section class="section section-alt" aria-labelledby="report-title">
<div class="wrap">
<h2 id="report-title">${esc(t('home.reportTitle'))}</h2>
<p>${inline(t('home.reportIntro'), o)}</p>
<div class="report-grid">
<div>
<h3>${esc(t('home.reportSummary'))}</h3>
<pre class="terminal" tabindex="0"><code><span class="prompt">$ </span>${esc(`${a.command} ${EXAMPLE_PROJECT}`)}
${esc(a.summary)}</code></pre>
</div>
<div>
<h3>${esc(t('home.reportFinding'))}</h3>
${finding}
</div>
</div>
</div>
</section>`
    : ''
}
<section class="section" aria-labelledby="agents-title">
<div class="wrap">
<h2 id="agents-title" tabindex="-1">${esc(t('home.agentsTitle'))}</h2>
<p>${inline(t('home.agentsIntro', { agentsDoc: `${BLOB}/docs/agents.md` }), o)}</p>
<ul class="agents">${agents}</ul>
<p class="agents-key"><span class="agent-dot" aria-hidden="true"></span> ${esc(t('home.agentsRules'))}: ${esc(data.agents.filter((x) => x.rule).map((x) => x.label).join(', '))}.</p>
</div>
</section>
<section class="section section-alt" aria-labelledby="free-title">
<div class="wrap cards">
<div class="card">
<h2 id="free-title">${esc(t('home.freeTitle'))}</h2>
<p>${inline(t('home.freeText'), o)}</p>
</div>
<div class="card">
<h2>${esc(t('home.tokensTitle'))}</h2>
<p>${inline(t('home.tokensText', { skills: data.skills.length, listing: data.tokens.listing, body: data.tokens.body }), o)}</p>
<p class="note">${inline(t('common.tokensNote', { estimator: data.tokens.estimator }), o)}</p>
</div>
<div class="card card-honest">
<h2>${esc(t('home.honestTitle'))}</h2>
<p>${inline(t('home.honestText'), o)}</p>
</div>
</div>
</section>
<section class="section" aria-labelledby="next-title">
<div class="wrap">
<h2 id="next-title">${esc(t('home.nextTitle'))}</h2>
<ul class="next-links">
<li><a href="${href(lang, '/how-it-works/')}">${esc(t('nav.how'))}</a><span>${esc(t('home.nextHow'))}</span></li>
<li><a href="${href(lang, '/rules/')}">${esc(t('nav.rules'))}</a><span>${esc(t('home.nextRules'))}</span></li>
<li><a href="${href(lang, '/skills/')}">${esc(t('nav.skills'))}</a><span>${esc(t('home.nextSkills'))}</span></li>
<li><a href="${href(lang, '/commands/')}">${esc(t('nav.commands'))}</a><span>${esc(t('home.nextCommands'))}</span></li>
</ul>
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

function how(t, lang, data) {
  const o = opts(lang, data)
  const toc = [
    ['profile', 'how.profileTitle'],
    ['helpers', 'how.helpersTitle'],
    ['agents', 'how.agentsTitle'],
    ['globs', 'how.globsTitle'],
    ['tokens', 'how.tokensTitle'],
    ['lessons', 'how.lessonsTitle'],
    ['audit', 'how.auditTitle'],
    ['safe', 'how.safeTitle']
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
  const instr = (ag) => (typeof ag.instructions === 'function' ? `${ag.instructions('/nonexistent')} *` : ag.instructions)
  const agentRows = data.agents
    .map(
      (ag) =>
        `<tr><th scope="row">${ag.source ? `<a href="${esc(ag.source)}">${esc(ag.label)}</a>` : esc(ag.label)}</th><td>${
          ag.skillDirs.length ? ag.skillDirs.map((d) => `<code>${esc(d)}/</code>`).join(' ') : '—'
        }</td><td>${ag.rule ? `<code>${esc(ag.rule)}</code>` : '—'}</td><td>${ag.instructions ? `<code>${esc(instr(ag))}</code>` : '—'}</td></tr>`
    )
    .join('')
  const skillRows = data.skills
    .map(
      (s) =>
        `<tr><th scope="row"><a href="${href(lang, skillPath(s.name))}"><code>${esc(s.name)}</code></a></th><td>${s.cost.listing}</td><td>${s.cost.body}</td><td>${s.cost.refs}</td><td>${s.cost.listing + s.cost.body + s.cost.refs}</td></tr>`
    )
    .join('')
  const g = data.globExample
  const a = data.audit
  const body = `${pageHead(t, 'how.h1', 'how.lead', o)}
<div class="wrap with-toc">
<nav class="toc" aria-labelledby="toc-title"><h2 id="toc-title">${esc(t('how.tocLabel'))}</h2><ol>${toc.map(([id, k]) => `<li><a href="#${id}">${esc(t(k))}</a></li>`).join('')}</ol></nav>
<div class="prose">
<section aria-labelledby="profile"><h2 id="profile">${esc(t('how.profileTitle'))}</h2>
<p>${inline(t('how.profileText'), o)}</p>
<figure class="code-figure"><figcaption><code>.frontend-skills/profile.json</code> · ${esc(t('common.example'))}</figcaption>${codeBlock(profile, 'json')}</figure>
<p>${inline(t('how.profileAfter'), o)}</p>
</section>
<section aria-labelledby="helpers"><h2 id="helpers">${esc(t('how.helpersTitle'))}</h2>
<p>${inline(t('how.helpersText'), o)}</p>
</section>
<section aria-labelledby="agents"><h2 id="agents">${esc(t('how.agentsTitle'))}</h2>
<p>${inline(t('how.agentsText'), o)}</p>
<div class="table-wrap" tabindex="0" role="region" aria-labelledby="agents-caption"><table>
<caption id="agents-caption">${esc(t('how.agentsTable'))}</caption>
<thead><tr><th scope="col">${esc(t('how.colAgent'))}</th><th scope="col">${esc(t('how.colSkills'))}</th><th scope="col">${esc(t('how.colRules'))}</th><th scope="col">${esc(t('how.colInstructions'))}</th></tr></thead>
<tbody>${agentRows}</tbody></table></div>
<p class="note">* ${lang === 'pl' ? 'zależy od plików, które projekt już ma (na przykład istniejący <code>CLAUDE.md</code>).' : 'depends on the files the project already has (for example an existing <code>CLAUDE.md</code>).'}</p>
<h3>${esc(t('how.coverTitle'))}</h3>
<p>${inline(t('how.coverText'), o)}</p>
<h3>${esc(t('how.blocksTitle'))}</h3>
<p>${inline(t('how.blocksText'), o)}</p>
</section>
<section aria-labelledby="globs"><h2 id="globs">${esc(t('how.globsTitle'))}</h2>
<p>${inline(t('how.globsText', { skill: g ? g.skill : 'fe-html' }), o)}</p>
${g ? `<figure class="code-figure"><figcaption><code>${esc(g.path)}</code></figcaption>${codeBlock(g.text, 'markdown')}</figure>` : ''}
</section>
<section aria-labelledby="tokens"><h2 id="tokens">${esc(t('how.tokensTitle'))}</h2>
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
<div class="table-wrap" tabindex="0" role="region" aria-labelledby="measured"><table class="numbers">
<thead><tr><th scope="col">${esc(t('how.colSkill'))}</th><th scope="col">${esc(t('how.colListing'))}</th><th scope="col">${esc(t('how.colBody'))}</th><th scope="col">${esc(t('how.colRefs'))}</th><th scope="col">${esc(t('how.colTotal'))}</th></tr></thead>
<tbody>${skillRows}</tbody></table></div>
<p class="note">${inline(t('common.tokensNote', { estimator: data.tokens.estimator }), o)}</p>
</section>
<section aria-labelledby="lessons"><h2 id="lessons">${esc(t('how.lessonsTitle'))}</h2>
<p>${inline(t('how.lessonsText'), o)}</p>
<p>${esc(t('how.lessonsCommand'))}</p>
${command(t, 'npx github:dawidolko/frontend-skills learn --lesson "Form fields use components/ui/Field.tsx" --kind convention')}
${codeBlock('- 2026-11-11 · convention · Form fields use components/ui/Field.tsx, which renders label, hint and error. [a11y/input-label]', 'text')}
</section>
<section aria-labelledby="audit"><h2 id="audit">${esc(t('how.auditTitle'))}</h2>
<p>${inline(t('how.auditText'), o)}</p>
<div class="cards cards-3">
<div class="card"><h3>${esc(t('how.auditStatic'))}</h3><p>${inline(t('how.auditStaticText'), o)}</p></div>
<div class="card"><h3>${esc(t('how.auditBrowser'))}</h3><p>${inline(t('how.auditBrowserText'), o)}</p></div>
<div class="card"><h3>${esc(t('how.auditManual'))}</h3><p>${inline(t('how.auditManualText'), o)}</p></div>
</div>
${
  a
    ? `<h3>${esc(t('how.jsonTitle'))}</h3>
<p>${inline(t('how.jsonText'), o)}</p>
<pre class="terminal wrap-lines" tabindex="0"><code><span class="prompt">$ </span>${esc(`${a.command} ${EXAMPLE_PROJECT} --json`)}
${esc(a.json)}</code></pre>`
    : ''
}
<p>${inline(t('how.exitText'), o)}</p>
<h3>${esc(t('how.ignoreTitle'))}</h3>
<p>${inline(t('how.ignoreText'), o)}</p>
</section>
<section aria-labelledby="safe"><h2 id="safe">${esc(t('how.safeTitle'))}</h2>
<p>${inline(t('how.safeText'), o)}</p>
</section>
</div>
</div>`
  return { path: '/how-it-works/', title: t('how.title'), description: t('how.description'), body }
}

function rulesIndex(t, lang, data) {
  const o = opts(lang, data)
  const select = (name, label, values, labelOf) =>
    `<div class="field"><label for="f-${name}">${esc(label)}</label><select id="f-${name}" name="${name}"><option value="">${esc(t('rules.all'))}</option>${values
      .map((v) => `<option value="${esc(v)}">${esc(labelOf(v))}</option>`)
      .join('')}</select></div>`
  const groups = data.areas
    .map((area) => {
      const list = data.rules.filter((r) => r.area === area)
      return `<section class="rule-group" data-area="${area}" aria-labelledby="area-${area}">
<h2 id="area-${area}">${esc(t(`ruleArea.${area}`))} <span class="count">${esc(t('rules.areaCount', { n: list.length }))}</span></h2>
<ul class="rule-list">${list
        .map(
          (r) => `<li class="rule-item" data-id="${esc(r.id)}" data-area="${r.area}" data-severity="${r.severity}" data-check="${r.check}">
<a class="rule-id" href="${href(lang, rulePath(r.id))}"><code>${esc(r.id)}</code></a>
<p class="rule-title">${inline(r.title, { ruleHref: () => null })}</p>
<p class="rule-meta">${sev(t, r.severity)} ${chk(t, r.check)}${r.wcag.length ? ` <span class="tag">WCAG ${esc(r.wcag.join(', '))}${r.level ? ` ${esc(r.level)}` : ''}</span>` : ''}${r.status === 'deprecated' ? ' <span class="tag">deprecated</span>' : ''}</p>
</li>`
        )
        .join('\n')}</ul>
</section>`
    })
    .join('\n')
  const body = `${pageHead(t, 'rules.h1', 'rules.lead', o)}
<div class="wrap">
<form class="filters" id="rule-filters" role="search" aria-label="${esc(t('rules.filtersLabel'))}" data-index="/rules/index.json" data-count="${esc(t('rules.count'))}" data-count-all="${esc(t('rules.countAll'))}" hidden>
<div class="field field-search"><label for="f-q">${esc(t('rules.search'))}</label><input id="f-q" name="q" type="search" autocomplete="off" spellcheck="false" aria-describedby="f-q-hint"><p class="hint" id="f-q-hint">${esc(t('rules.searchHint'))}</p></div>
${select('area', t('rules.area'), data.areas, (a) => t(`ruleArea.${a}`))}
${select('severity', t('rules.severity'), data.severities, (s) => t(`severity.${s}`))}
${select('check', t('rules.check'), data.checkKinds, (c) => t(`check.${c}`))}
<div class="field field-reset"><button type="reset" class="button button-ghost">${esc(t('rules.reset'))}</button></div>
</form>
<p class="rule-count" id="rule-count">${esc(t('rules.countAll', { total: data.rules.length }))}</p>
<p class="empty" id="rule-empty" hidden>${esc(t('rules.empty'))}</p>
${groups}
<p class="note">${inline(t('rules.explainHint'), o)}</p>
</div>`
  return { path: '/rules/', title: t('rules.title'), description: t('rules.description'), body }
}

function rulePage(t, lang, data, r, i) {
  const o = { ...opts(lang, data), base: `${BLOB}/rules/${r.id}/` }
  const prev = data.rules[i - 1]
  const next = data.rules[i + 1]
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
      ? `<p class="callout">${t('rule.deprecated', { replacement: `<a href="${href(lang, rulePath(r.replacedBy))}"><code>${esc(r.replacedBy)}</code></a>` })}</p>`
      : ''
  const body = `<div class="page-head"><div class="wrap">
${breadcrumb(t, lang, crumbs)}
<h1 class="rule-h1"><code>${esc(r.id)}</code></h1>
<p class="lead">${inline(r.title, o)}</p>
${r.hasPlaceholder ? `<p class="note">${inline(t('rule.placeholderNote'), o)}</p>` : ''}
</div></div>
<div class="wrap rule-layout">
<div class="prose">
${deprecated}
<section aria-labelledby="why"><h2 id="why">${esc(t('rule.why'))}</h2>${markdown(r.why, o)}</section>
<section aria-labelledby="fix"><h2 id="fix">${esc(t('rule.fix'))}</h2>${markdown(r.fix.replace(/\{\{[^|}]+\|([^}]*)\}\}/g, '$1'), o)}</section>
${r.examples ? `<section aria-labelledby="examples"><h2 id="examples">${esc(t('rule.examples'))}</h2>${markdown(r.examples, o)}</section>` : ''}
<section aria-labelledby="sources"><h2 id="sources">${esc(t('common.sources'))}</h2><ul class="sources">${r.sources
    .map((s) => `<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`)
    .join('')}</ul></section>
<section aria-labelledby="explain"><h2 id="explain">${esc(t('rule.explain'))}</h2>${command(t, `npx github:dawidolko/frontend-skills explain ${r.id}`)}</section>
</div>
<aside class="facts" aria-labelledby="facts-title">
<h2 id="facts-title">${esc(t('rule.facts'))}</h2>
<dl>${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>
<p><a href="${BLOB}/rules/${esc(r.id)}/rule.md">${esc(t('rule.editOnGithub'))}</a></p>
</aside>
</div>
<div class="wrap">
<nav class="pager" aria-label="${esc(t('rule.prev'))} / ${esc(t('rule.next'))}">
${prev ? `<a class="pager-prev" href="${href(lang, rulePath(prev.id))}" rel="prev"><span>${esc(t('rule.prev'))}</span> <code>${esc(prev.id)}</code></a>` : '<span></span>'}
<a class="pager-up" href="${href(lang, '/rules/')}">${esc(t('rule.back'))}</a>
${next ? `<a class="pager-next" href="${href(lang, rulePath(next.id))}" rel="next"><span>${esc(t('rule.next'))}</span> <code>${esc(next.id)}</code></a>` : '<span></span>'}
</nav>
</div>`
  const title = `${r.id}: ${plain(r.title)}`
  return {
    path: rulePath(r.id),
    section: '/rules/',
    title: title.length > 70 ? `${r.id} ${t('rule.titleSuffix')}` : title,
    description: `${plain(r.title)} ${plain(r.why)}`.slice(0, 155).replace(/\s+\S*$/, '…'),
    body,
    ogType: 'article',
    jsonld: [breadcrumbLd(lang, crumbs.filter((c) => !c[1].includes('#')).map(([n, p]) => [n, p]))]
  }
}

function skillsIndex(t, lang, data) {
  const o = opts(lang, data)
  const requires = (s) => s.requires.map((k) => (k === 'web' ? esc(t('skills.web')) : `<code>${esc(k)}</code>`)).join(', ')
  const groups = data.skillAreas
    .map((area) => {
      const list = data.skills.filter((s) => s.area === area)
      return `<section aria-labelledby="sa-${area}"><h2 id="sa-${area}">${esc(t(`skillArea.${area}`))}</h2>
<ul class="skill-grid">${list
        .map(
          (s) => `<li class="skill-card">
<h3><a href="${href(lang, skillPath(s.name))}">${esc(s.title)}</a></h3>
<p class="skill-name"><code>${esc(s.name)}</code></p>
<p>${inline(s.description.split(/(?<=\.)\s+Use when/)[0], { ruleHref: () => null })}</p>
<p class="skill-meta"><span>${esc(t('skills.installedFor'))}: ${requires(s)}</span><span>${esc(t('skills.rulesCount', { n: s.ruleList.length }))}</span><span>${esc(t('skills.tokens', { n: s.cost.body }))}</span></p>
</li>`
        )
        .join('')}</ul></section>`
    })
    .join('\n')
  const body = `${pageHead(t, 'skills.h1', 'skills.lead', o)}
<div class="wrap">
${groups}
<p class="note">${inline(t('common.tokensNote', { estimator: data.tokens.estimator }), o)}</p>
</div>`
  return { path: '/skills/', title: t('skills.title'), description: t('skills.description'), body }
}

function skillPage(t, lang, data, s) {
  const o = { ...opts(lang, data), base: `${BLOB}/${s.rel}/` }
  const list = (arr) => arr.join(', ')
  const withRules = data.agents.filter((a) => a.rule).map((a) => a.label)
  const crumbs = [
    [esc(t('nav.home')), '/'],
    [esc(t('nav.skills')), '/skills/'],
    [esc(s.title), skillPath(s.name)]
  ]
  const rules = s.ruleList.map((id) => data.rules.find((r) => r.id === id))
  const facts = [
    [t('skill.name'), `<code>${esc(s.name)}</code>`],
    [t('skill.area'), esc(t(`skillArea.${s.area}`))],
    [t('skill.installedFor'), s.requires.map((k) => (k === 'web' ? esc(t('skills.web')) : `<code>${esc(k)}</code>`)).join(', ')],
    [t('skill.globs'), s.globs.map((g) => `<code>${esc(g)}</code>`).join(' ')],
    [t('skill.cost'), esc(t('skill.costText', { listing: s.cost.listing, body: s.cost.body, refs: s.cost.refs }))]
  ]
  const sec = s.sections
  const body = `<div class="page-head"><div class="wrap">
${breadcrumb(t, lang, crumbs)}
<h1>${esc(s.title)}</h1>
<p class="lead">${inline(s.description, { ruleHref: () => null })}</p>
</div></div>
<div class="wrap rule-layout">
<div class="prose">
<section aria-labelledby="rules"><h2 id="rules">${esc(t('skill.rules'))}</h2>
<ul class="rule-list compact">${rules
    .map(
      (r) =>
        `<li class="rule-item"><a class="rule-id" href="${href(lang, rulePath(r.id))}"><code>${esc(r.id)}</code></a><p class="rule-title">${inline(r.title, { ruleHref: () => null })}</p><p class="rule-meta">${sev(t, r.severity)} ${chk(t, r.check)}</p></li>`
    )
    .join('')}</ul></section>
${sec.rules ? `<section aria-labelledby="digest"><h2 id="digest">${esc(t('skill.digest'))}</h2><p>${esc(t('skill.digestText'))}</p><div class="digest">${markdown(sec.rules, o)}</div></section>` : ''}
${sec['do this'] ? `<section aria-labelledby="do"><h2 id="do">${esc(t('skill.doThis'))}</h2>${markdown(sec['do this'], o)}</section>` : ''}
${sec.check ? `<section aria-labelledby="check"><h2 id="check">${esc(t('skill.checkTitle'))}</h2>${markdown(sec.check, o)}</section>` : ''}
${
  s.references.length
    ? `<section aria-labelledby="refs"><h2 id="refs">${esc(t('skill.references'))}</h2><ul>${s.references
        .map((r) => `<li><a href="${BLOB}/${s.rel}/references/${esc(r.file)}"><code>references/${esc(r.file)}</code></a> · ${r.tokens} ${esc(t.plural('tokens', r.tokens))}</li>`)
        .join('')}</ul></section>`
    : ''
}
<section aria-labelledby="agents"><h2 id="agents">${esc(t('skill.agents'))}</h2>
<p>${esc(t('skill.agentsText', { list: list(data.agents.map((a) => a.label)) }))}</p>
<p>${esc(t('skill.agentsRules', { list: list(withRules) }))}</p></section>
</div>
<aside class="facts" aria-labelledby="facts-title">
<h2 id="facts-title">${esc(t('skill.facts'))}</h2>
<dl>${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>
<p><a href="${BLOB}/${s.rel}/SKILL.md">${esc(t('skill.editOnGithub'))}</a></p>
<p><a href="${href(lang, '/skills/')}">${esc(t('skill.back'))}</a></p>
</aside>
</div>`
  return {
    path: skillPath(s.name),
    section: '/skills/',
    title: `${s.title} (${s.name})`,
    description: plain(s.description).slice(0, 155).replace(/\s+\S*$/, '…'),
    body,
    ogType: 'article',
    jsonld: [breadcrumbLd(lang, crumbs)]
  }
}

function commandsPage(t, lang, data) {
  const o = opts(lang, data)
  const items = data.commands
    .map(
      (c) => `<section class="command-section" aria-labelledby="c-${c.name}">
<h2 id="c-${c.name}"><code>${esc(c.name)}</code> <span class="status status-${c.built ? 'ok' : 'soon'}">${esc(t(c.built ? 'commands.available' : 'commands.coming'))}</span></h2>
<p>${inline(t(`commands.items.${c.name}`), o)}</p>
${c.built ? command(t, `npx github:dawidolko/frontend-skills ${c.name}`) : ''}
${c.help ? `<details><summary>${inline(t('commands.usage'), o)}</summary><pre class="terminal" tabindex="0"><code>${esc(c.help)}</code></pre></details>` : ''}
</section>`
    )
    .join('\n')
  const body = `${pageHead(t, 'commands.h1', 'commands.lead', o)}
<div class="wrap narrow">
${items}
</div>`
  return { path: '/commands/', title: t('commands.title'), description: t('commands.description'), body }
}

function faq(t, lang, data) {
  const o = opts(lang, data)
  const vars = {
    agents: data.agents.map((a) => a.label).join(', '),
    agentsDoc: `${BLOB}/docs/agents.md`,
    authoringDoc: `${BLOB}/docs/authoring.md`
  }
  const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)
  const items = t.raw('faq.items')
  const body = `${pageHead(t, 'faq.h1', null, o)}
<div class="wrap narrow faq">
${items.map(([q, a], i) => `<section aria-labelledby="q${i + 1}"><h2 id="q${i + 1}">${esc(q)}</h2><p>${inline(fill(a), o)}</p></section>`).join('\n')}
</div>`
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: plain(fill(a)) } }))
    }
  ]
  return { path: '/faq/', title: t('faq.title'), description: t('faq.description'), body, jsonld }
}

function about(t, lang, data) {
  const o = opts(lang, data)
  const standards = t.raw('about.standards')
  const body = `${pageHead(t, 'about.h1', null, o)}
<div class="wrap narrow prose">
<section aria-labelledby="licence"><h2 id="licence">${esc(t('about.licenceTitle'))}</h2><p>${inline(t('about.licenceText', { licence: `${BLOB}/LICENSE` }), o)}</p></section>
<section aria-labelledby="author"><h2 id="author">${esc(t('about.authorTitle'))}</h2><p>${inline(t('about.authorText'), o)}</p></section>
<section aria-labelledby="credits"><h2 id="credits">${esc(t('about.creditsTitle'))}</h2>
<p>${
    data.thirdParty ? inline(t('about.creditsText', { thirdParty: `${BLOB}/THIRD-PARTY.md` }), o) : esc(t('about.creditsSite'))
  }</p>
<ul><li>${inline(t('about.creditFont'), o)}</li><li>${inline(t('about.creditPanel'), o)}</li></ul>
</section>
<section aria-labelledby="standards"><h2 id="standards">${esc(t('about.standardsTitle'))}</h2><p>${esc(t('about.standardsText'))}</p>
<ul>${standards.map(([name, url]) => `<li>${url ? `<a href="${esc(url)}">${esc(name)}</a>` : esc(name)}</li>`).join('')}</ul></section>
<section aria-labelledby="this-site"><h2 id="this-site">${esc(t('about.siteTitle'))}</h2><p>${inline(t('about.siteText'), o)}</p></section>
<section aria-labelledby="a11y"><h2 id="a11y">${esc(t('about.accessibilityTitle'))}</h2><p>${inline(t('about.accessibilityText', { issues: `${REPO}/issues` }), o)}</p></section>
<p class="note">${esc(t('common.builtOn', { version: data.version }))}</p>
</div>`
  return { path: '/about/', title: t('about.title'), description: t('about.description'), body }
}

function notFound(t, lang, data, other) {
  const part = (tt, l) => `<div class="not-found-part" lang="${l}">
<h${l === lang ? 1 : 2}>${esc(tt('notFound.h1'))}</h${l === lang ? 1 : 2}>
<p class="lead">${esc(tt('notFound.text'))}</p>
<p class="cta"><a class="button" href="${href(l, '/')}">${esc(tt('notFound.home'))}</a> <a class="button button-ghost" href="${href(l, '/rules/')}">${esc(tt('notFound.rules'))}</a></p>
</div>`
  const body = `<div class="page-head"><div class="wrap narrow">
${part(t, lang)}
${other ? part(other, other.lang) : ''}
</div></div>`
  return { path: '/404.html', title: t('notFound.title'), description: t('notFound.description'), body, noindex: true, alternates: false }
}

/** Every page of one language, in sitemap order. */
export function pagesFor(t, lang, data, other) {
  copyId = 0
  const reset = (fn) => (...a) => {
    copyId = 0
    return fn(...a)
  }
  return [
    reset(home)(t, lang, data),
    reset(how)(t, lang, data),
    reset(rulesIndex)(t, lang, data),
    ...data.rules.map((r, i) => reset(rulePage)(t, lang, data, r, i)),
    reset(skillsIndex)(t, lang, data),
    ...data.skills.map((s) => reset(skillPage)(t, lang, data, s)),
    reset(commandsPage)(t, lang, data),
    reset(faq)(t, lang, data),
    reset(about)(t, lang, data),
    ...(lang === 'en' ? [reset(notFound)(t, lang, data, other)] : [])
  ]
}
