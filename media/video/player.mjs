/*
 * Builds and moves the scenes of the Frontend Skills video in the browser. Every visible value is a function of the
 * time t passed to window.seek(t), so build.mjs can step frame by frame and get the same picture on every run;
 * window.play() runs the same timeline in real time. The facts on screen (command output, files, findings, counts,
 * site screenshots) come from window.VIDEO_DATA, recorded by build.mjs from real runs; the timing and the words come
 * from timeline.mjs. URL parameters: format=youtube|tiktok, lang=en|pl.
 */
import { BEATS, FADE, SCENES, TEXT, TOTAL } from './timeline.mjs'

const params = new URLSearchParams(location.search)
const FORMAT = params.get('format') === 'tiktok' ? 'tiktok' : 'youtube'
const LANG = params.get('lang') === 'pl' ? 'pl' : 'en'
const TT = FORMAT === 'tiktok'
const T = TEXT[LANG]
const D = window.VIDEO_DATA
document.documentElement.lang = LANG
document.body.className = FORMAT

const TERM = TT ? { font: 26, lh: 38 } : { font: 21, lh: 31 }

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const prog = (t, a, b) => clamp((t - a) / (b - a))
const ease = (x) => 1 - (1 - x) ** 3
const inOut = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
const back = (x) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2
const lerp = (a, b, p) => a + (b - a) * p
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ticks = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>')
const fill = (s, extra = {}) => s.replace(/\{(\w+)\}/g, (m, k) => String({ ...D.counts, ...extra }[k] ?? m))
const plural = (n) => {
  const f = T.files
  if (f.length === 2) return `${n} ${n === 1 ? f[0] : f[1]}`
  if (n === 1) return `${n} ${f[0]}`
  const few = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
  return `${n} ${few ? f[1] : f[2]}`
}
const sitePath = (p) => `skills.dawidolko.pl${LANG === 'pl' ? '/pl' : ''}${p}`

function h(tag, cls, html, parent) {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html) e.innerHTML = html
  if (parent) parent.append(e)
  return e
}

function show(e, p, { dx = 0, dy = 28, scale = 0 } = {}) {
  e.style.opacity = p
  e.style.transform = `translate(${((1 - p) * dx).toFixed(1)}px, ${((1 - p) * dy).toFixed(1)}px)${scale ? ` scale(${1 - (1 - p) * scale})` : ''}`
}

const MARK =
  '<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8"/><path pathLength="1" d="M12.5 10 7 16l5.5 6M19.5 10 25 16l-5.5 6"/></svg>'

const TOKEN = /(\/\/.*$)|("[^"]*"|'[^']*')|(<\/?[A-Za-z][\w.]*|\/?>)|\b(import|from|export|function|const|return)\b|([A-Za-z][\w-]*)(?==)|([{}()[\]])/g
function highlight(line) {
  let out = ''
  let last = 0
  for (const m of line.matchAll(TOKEN)) {
    out += esc(line.slice(last, m.index))
    const cls = m[2] ? 'c-str' : m[3] ? 'c-tag' : m[4] ? 'c-kw' : m[5] ? 'c-attr' : 'c-pun'
    out += `<span class="${cls}">${esc(m[0])}</span>`
    last = m.index + m[0].length
  }
  return out + esc(line.slice(last))
}

function windowBar(title, parent) {
  return h('div', 'bar', `<i></i><i></i><i></i><b>${esc(title)}</b>`, parent)
}

/** A terminal that types its command and shows the recorded output line by line, scrolling smoothly. */
function terminal(session, { rows, width, title }) {
  const root = h('div', 'term')
  root.style.width = `${width}px`
  root.style.fontSize = `${TERM.font}px`
  windowBar(title, root)
  const body = h('div', 'term-body', '', root)
  body.style.height = `${rows * TERM.lh + 32}px`
  const inner = h('div', 'term-inner', '', body)
  const line = (html) => {
    const e = h('div', 'tl', html || ' ', inner)
    e.style.height = `${TERM.lh}px`
    e.style.lineHeight = `${TERM.lh}px`
    return e
  }
  const first = line('<span class="a">~/shop $ </span><span class="cmd"></span><span class="cur"></span>')
  const cmd = first.querySelector('.cmd')
  const cur = first.querySelector('.cur')
  const out = session.lines.map((spans) => line(spans.map(([t, c]) => (c ? `<span class="${c}">${esc(t)}</span>` : esc(t))).join('')))
  const last = line('<span class="a">~/shop $ </span><span class="cur"></span>')
  const lastCur = last.querySelector('.cur')
  const blink = (l) => (l * 2) % 2 < 1
  return {
    root,
    out,
    update(l, b, adjust = (o) => o) {
      const typed = prog(l, b.typeStart, b.typeEnd)
      cmd.textContent = session.command.slice(0, Math.round(typed * session.command.length))
      cur.style.opacity = l >= b.enter ? 0 : typed > 0 && typed < 1 ? 1 : blink(l) ? 1 : 0
      const shown = l < b.enter ? 0 : (l - b.enter - 0.12) / (b.lineMs / 1000) + 1
      out.forEach((e, i) => {
        e.style.opacity = clamp((shown - i) * 2.5)
      })
      const done = shown >= out.length + 5
      last.style.opacity = done ? 1 : 0
      lastCur.style.opacity = done && blink(l) ? 1 : 0
      const count = 1 + clamp(shown, 0, out.length) + (done ? 1 : 0)
      const offset = adjust(Math.max(0, count - rows), Math.max(0, out.length + 2 - rows))
      inner.style.transform = `translateY(${(-offset * TERM.lh).toFixed(1)}px)`
    }
  }
}

/** A card with source code, one row per line, with line numbers and simple TSX colouring. */
function codeCard(title, rows, { font, lh, width }) {
  const root = h('div', 'code-card')
  root.style.fontSize = `${font}px`
  root.style.lineHeight = `${lh}px`
  if (width) root.style.width = `${width}px`
  windowBar(title, root)
  const body = h('div', 'code-lines', '', root)
  const lines = rows.map((r) => {
    const e = h(
      'div',
      `cl${r.kind && r.kind !== 'same' ? ` ${r.kind}-row` : ''}`,
      `<span class="sign"></span><span class="ln">${r.n ?? ''}</span><span class="tx">${highlight(r.text) || ' '}</span>`,
      body
    )
    return e
  })
  return { root, body, lines }
}

const stage = document.getElementById('stage')
const bg = h('div', '', '', stage)
bg.id = 'bg'
const glowA = h('div', 'glow', '', bg)
const glowB = h('div', 'glow b', '', bg)
const scenes = []

function scene(id, build) {
  const s = SCENES.find((x) => x.id === id)
  const el = h('section', 'scene', '', stage)
  el.style.display = 'none'
  const update = build(el)
  scenes.push({ ...s, el, update })
}

scene('title', (el) => {
  el.classList.add('center')
  const b = BEATS.title
  const mark = h('div', '', MARK, el)
  const size = TT ? 250 : 210
  mark.style.width = mark.style.height = `${size}px`
  const path = mark.querySelector('path')
  const name = h('h1', 'h1', 'Frontend Skills', el)
  name.style.fontSize = TT ? '104px' : '128px'
  name.style.marginTop = '44px'
  const tag = h('p', 'lead', esc(T.tagline), el)
  tag.style.margin = '22px 0 40px'
  if (TT) tag.style.maxWidth = '820px'
  const url = h('div', 'pill', 'skills.dawidolko.pl', el)
  return (l) => {
    const pm = prog(l, b.mark, b.land)
    mark.style.opacity = clamp(pm * 3)
    mark.style.transform = `scale(${lerp(0.35, 1, back(pm)).toFixed(3)}) rotate(${lerp(-14, 0, ease(pm)).toFixed(2)}deg)`
    path.style.strokeDasharray = '1'
    path.style.strokeDashoffset = String(1 - ease(prog(l, b.land - 0.25, b.land + 0.65)))
    show(name, ease(prog(l, b.name, b.name + 0.7)), { dy: 40 })
    show(tag, ease(prog(l, b.tagline, b.tagline + 0.7)))
    show(url, ease(prog(l, b.url, b.url + 0.6)), { dy: 18 })
    el.style.setProperty('--zoom', 1)
  }
})

const findingLabels = { 'a11y/img-alt': 0, 'a11y/no-click-on-static': 1, 'a11y/input-label': 2, 'a11y/focus-visible': 3 }

scene('problem', (el) => {
  const b = BEATS.problem
  const wrap = h('div', 'split', '', el)
  const head = h('div', 'col', '', wrap)
  if (!TT) head.style.width = '600px'
  h('h2', 'h1', `<span>${esc(T.problem[0])}</span><span class="l2">${esc(T.problem[1])}</span>`, head)
  const src = D.code.before.replace(/\n$/, '').split('\n')
  const card = codeCard(
    'src/App.tsx',
    src.map((text, i) => ({ text, n: i + 1 })),
    { font: TT ? 23 : 24, lh: TT ? 36 : 37, width: TT ? 960 : 1000 }
  )
  wrap.append(card.root)
  const found = D.sessions.audit.raw
    .map((l) => l.match(/^\s+(?:critical|serious)\s+(\S+)\s+\d+× \(first: src\/App\.tsx:(\d+)\)/))
    .filter((m) => m && m[1] in findingLabels)
    .map((m) => ({ id: m[1], line: Number(m[2]) }))
    .sort((x, y) => x.line - y.line)
  const list = h('div', 'marks-list', '', TT ? wrap : head)
  const marks = found.map((f) => {
    const row = card.lines[f.line - 1]
    const text = src[f.line - 1]
    const indent = text.match(/^ */)[0].length
    const squiggle = h('span', 'squiggle', '', row)
    squiggle.style.left = `calc(3.2em + ${indent}ch)`
    squiggle.style.width = `${text.trimEnd().length - indent}ch`
    const pill = h('span', '', `${f.line} · ${esc(T.marks[findingLabels[f.id]])}`, list)
    return { row, squiggle, pill }
  })
  return (l) => {
    show(head, ease(prog(l, b.headline, b.headline + 0.8)), { dx: TT ? 0 : -50, dy: TT ? 30 : 0 })
    show(card.root, ease(prog(l, b.code, b.code + 0.8)), { dy: 50 })
    marks.forEach((m, k) => {
      const p = ease(prog(l, b.marks[k], b.marks[k] + 0.45))
      m.squiggle.style.transform = `scaleX(${p})`
      m.row.style.background = `rgb(255 120 120 / ${(0.13 * p).toFixed(3)})`
      show(m.pill, p, { dy: 16 })
    })
  }
})

scene('command', (el) => {
  el.classList.add('center')
  const b = BEATS.command
  const head = h('h2', 'h1', `<span>${esc(T.command[0])}</span><span class="l2">${esc(T.command[1])}</span>`, el)
  head.style.fontSize = TT ? '84px' : '104px'
  const pill = h('div', 'pill mono', '<span class="a">$</span><span class="cmd"></span><span class="cur"></span>', el)
  pill.style.marginTop = '70px'
  pill.style.fontSize = TT ? '30px' : '42px'
  pill.style.padding = TT ? '22px 30px' : '26px 44px'
  pill.style.fontWeight = '400'
  pill.style.color = 'var(--ink)'
  pill.style.borderRadius = '22px'
  const cmd = pill.querySelector('.cmd')
  const cur = pill.querySelector('.cur')
  const text = D.sessions.init.command.replace(/ --yes$/, '')
  return (l) => {
    show(head, ease(prog(l, b.headline, b.headline + 0.8)), { dy: 40 })
    show(pill, ease(prog(l, b.typeStart - 0.7, b.typeStart - 0.1)), { dy: 30 })
    cmd.textContent = ` ${text.slice(0, Math.round(prog(l, b.typeStart, b.typeEnd) * text.length))}`
    cur.style.opacity = l > b.enter ? 0 : (l * 2) % 2 < 1 || (l > b.typeStart && l < b.typeEnd) ? 1 : 0
    const hit = prog(l, b.enter, b.enter + 0.5)
    pill.style.transform += ` scale(${1 + 0.05 * Math.sin(Math.PI * hit)})`
    pill.style.borderColor = hit > 0 ? `rgb(210 100 245 / ${0.55 + 0.45 * (1 - hit)})` : ''
    pill.style.boxShadow = hit > 0 ? `0 0 ${60 * (1 - hit)}px rgb(210 100 245 / 0.6)` : 'none'
  }
})

scene('init', (el) => {
  const b = BEATS.init
  const wrap = h('div', 'split', '', el)
  const term = terminal(D.sessions.init, { rows: TT ? 20 : 24, width: TT ? 960 : 1180, title: 'frontend-skills init · ~/shop' })
  wrap.append(term.root)
  const col = h('div', 'callouts', '', wrap)
  const values = [D.facts.stack, D.facts.agents, fill(T.installed, { n: D.counts.installed, all: D.counts.skills, files: D.counts.files })]
  const cards = T.callouts.map((label, k) => h('div', 'card', `<div class="label">${esc(label)}</div><div class="value">${esc(values[k])}</div>`, col))
  return (l) => {
    show(term.root, ease(prog(l, 0, 0.6)), { dy: 40 })
    term.update(l, b)
    cards.forEach((c, k) => {
      show(c, clamp(back(prog(l, b.callouts[k], b.callouts[k] + 0.55))), { dx: TT ? 0 : 70, dy: TT ? 40 : 0 })
    })
  }
})

scene('agents', (el) => {
  const b = BEATS.agents
  const heads = h('div', '', '', el)
  heads.style.position = 'relative'
  heads.style.marginBottom = '34px'
  const head1 = h('h2', 'h1', `<span>${esc(T.agents[0])}</span><span class="l2">${esc(T.agents[1])}</span>`, heads)
  head1.style.fontSize = TT ? '70px' : '72px'
  const head2 = h('h2', 'h1', `<span>${esc(T.formats)}</span>`, heads)
  head2.style.position = 'absolute'
  head2.style.left = '0'
  head2.style.right = '0'
  head2.style.bottom = '0'
  head2.style.fontSize = TT ? '64px' : '72px'
  const swap = h('div', '', '', el)
  swap.style.position = 'relative'
  const groups = h('div', 'groups', '', swap)
  const rows = D.agents.groups.map((g) =>
    h(
      'div',
      'group',
      `<span class="gp">${esc(g.path)}</span><span class="gn">${g.block ? esc(T.block) : esc(plural(g.files))}</span><span class="chips">${g.readBy.map((a) => `<span class="chip">${esc(a)}</span>`).join('')}</span>`,
      groups
    )
  )
  const formats = h('div', 'formats', '', swap)
  formats.style.position = 'absolute'
  formats.style.left = '0'
  formats.style.right = '0'
  formats.style.top = TT ? '0' : '40px'
  const KEY = /^(\s*)(paths|globs|applyTo|alwaysApply|description)(:)/
  const cards = D.agents.formats.map((f) => {
    const lines = f.head
      .map((line) => {
        const m = line.match(KEY)
        if (m && m[2] !== 'description') return `<div>${esc(m[1])}<span class="key">${esc(m[2])}</span>${esc(line.slice(m[0].length - 1))}</div>`
        if (/^\s+- "/.test(line)) return `<div class="key">${esc(line)}</div>`
        return `<div>${esc(line) || ' '}</div>`
      })
      .join('')
    return h('div', 'card fmt', `<div class="agent">${esc(f.agent)}</div><div class="file">${esc(f.file)}</div><pre>${lines}</pre>`, formats)
  })
  return (l) => {
    const swapP = inOut(prog(l, b.formats - 0.35, b.formats + 0.35))
    show(head1, ease(prog(l, b.headline, b.headline + 0.8)) * (1 - swapP), { dy: 30 })
    show(head2, swapP, { dy: 30 })
    rows.forEach((r, k) => {
      const at = b.files + k * b.fileStep
      show(r, ease(prog(l, at, at + 0.5)), { dx: -50, dy: 0 })
    })
    groups.style.opacity = 1 - swapP
    groups.style.transform = `translateY(${-50 * swapP}px) scale(${1 - 0.04 * swapP})`
    cards.forEach((c, k) => {
      show(c, ease(prog(l, b.cards[k], b.cards[k] + 0.6)), { dy: 60 })
    })
  }
})

scene('conventions', (el) => {
  const b = BEATS.conventions
  const head = h('h2', 'h1', `<span>${esc(T.conventions[0])}</span><span class="l2">${esc(T.conventions[1])}</span>`, el)
  head.style.marginBottom = '44px'
  head.style.fontSize = TT ? '74px' : '80px'
  const wrap = h('div', 'split', '', el)
  wrap.style.alignItems = 'flex-start'
  const block = h('div', 'card', `<div class="label">${esc(T.blockTitle)}</div>`, wrap)
  if (!TT) block.style.width = '840px'
  const lines = h('div', 'block-lines', '', block)
  lines.style.marginTop = '20px'
  const items = D.conventions.block.map((t) => h('div', '', ticks(t), lines))
  const col = h('div', 'col', '', wrap)
  col.style.flex = '1'
  col.style.gap = '22px'
  const label = h('div', 'card', '', col)
  label.className = ''
  label.innerHTML = `<div class="label" style="font-size:20px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--accent)">${esc(T.finding)}</div>`
  const findings = D.conventions.findings.map((f) =>
    h(
      'div',
      'card finding',
      `<div class="top"><span class="sev minor">minor</span><span class="id">${esc(f.id)}</span></div><div class="at">${esc(f.at)}</div><div class="msg">${ticks(f.message)}</div>`,
      col
    )
  )
  return (l) => {
    show(head, ease(prog(l, b.headline, b.headline + 0.8)), { dy: 30 })
    show(block, ease(prog(l, b.block, b.block + 0.7)), { dx: TT ? 0 : -50, dy: TT ? 40 : 0 })
    items.forEach((it, k) => {
      show(it, ease(prog(l, b.block + 0.5 + k * 0.45, b.block + 1 + k * 0.45)), { dy: 16 })
    })
    show(label, ease(prog(l, b.finding - 0.3, b.finding + 0.3)), { dy: 12 })
    show(findings[0], clamp(back(prog(l, b.finding, b.finding + 0.55))), { dx: TT ? 0 : 60, dy: TT ? 40 : 0 })
    show(findings[1], clamp(back(prog(l, b.finding2, b.finding2 + 0.55))), { dx: TT ? 0 : 60, dy: TT ? 40 : 0 })
  }
})

scene('audit', (el) => {
  const b = BEATS.audit
  const lead = h('p', 'lead', esc(T.audit), el)
  lead.style.margin = '0 0 34px'
  lead.style.color = 'var(--ink)'
  lead.style.fontWeight = '600'
  const wrap = h('div', 'split', '', el)
  wrap.style.alignItems = 'flex-start'
  const left = h('div', 'col', '', wrap)
  left.style.gap = '0'
  const term = terminal(D.sessions.audit, { rows: TT ? 12 : 12, width: TT ? 960 : 900, title: 'frontend-skills audit · ~/shop' })
  left.append(term.root)
  const exit = h('div', 'exit', esc(T.exit), left)
  const c = D.card
  const short = (s) => s.split(',')[0].replace(/^WAI /, 'WAI ')
  const card = h(
    'div',
    'card big-card',
    `<div class="finding"><div class="top"><span class="sev critical">critical</span><span class="id">${esc(c.id)}</span></div></div>
     <div class="title">${esc(c.title)}</div>
     <div class="finding"><div class="at">${esc(c.at[0].at)}</div><div class="msg" style="font-size:22px">${ticks(c.at[0].message)}</div></div>
     <div class="section"><b>${esc(T.why)}</b>${ticks(c.why)}</div>
     <div class="section"><b>${esc(T.fix)}</b>${ticks(c.fix)}</div>
     <div class="chips" style="justify-content:flex-start;margin-top:18px">${c.sources.map((s) => `<span class="chip">${esc(short(s))}</span>`).join('')}</div>`,
    wrap
  )
  if (!TT) card.style.width = '700px'
  const target = term.out.findIndex((e) => e.textContent.includes(c.id))
  return (l) => {
    show(lead, ease(prog(l, 0.1, 0.8)), { dy: 20 })
    show(term.root, ease(prog(l, 0, 0.6)), { dy: 40 })
    term.update(l, b)
    const pc = prog(l, b.card, b.card + 0.6)
    show(card, clamp(back(pc)), { dx: TT ? 0 : 80, dy: TT ? 60 : 0, scale: 0.08 })
    if (target >= 0) term.out[target].style.background = `rgb(210 100 245 / ${(0.22 * ease(prog(l, b.card - 0.4, b.card))).toFixed(3)})`
    show(exit, ease(prog(l, b.exit, b.exit + 0.5)), { dy: 20 })
  }
})

scene('explain', (el) => {
  const b = BEATS.explain
  const wrap = h('div', 'split', '', el)
  const term = terminal(D.sessions.explain, { rows: TT ? 22 : 24, width: TT ? 960 : 1180, title: 'frontend-skills explain · ~/shop' })
  wrap.append(term.root)
  const col = h('div', TT ? 'chips' : 'col', '', wrap)
  if (TT) col.style.justifyContent = 'flex-start'
  const heads = ['Why', 'Fix', 'Sources'].map((w) => term.out.findIndex((e) => e.textContent === w))
  const pills = T.explainMarks.map((m, k) => {
    const p = h('div', 'pill', `<span class="mono" style="color:var(--accent)">${['Why', 'Fix', 'Sources'][k]}</span> ${esc(m)}`, col)
    if (TT) p.style.fontSize = '26px'
    return p
  })
  return (l) => {
    show(term.root, ease(prog(l, 0, 0.6)), { dy: 40 })
    const ps = b.marks.map((m) => ease(prog(l, m - 0.3, m + 0.4)))
    term.update(l, b, (natural, max) => {
      let o = natural
      ps.forEach((p, k) => {
        if (heads[k] >= 0) o = lerp(o, clamp(heads[k] - 2, 0, max), p)
      })
      return o
    })
    heads.forEach((i, k) => {
      if (i < 0) return
      const active = ps[k] * (k < 2 ? 1 - ps[k + 1] * 0.6 : 1)
      term.out[i].style.background = `rgb(210 100 245 / ${(0.28 * active).toFixed(3)})`
    })
    pills.forEach((p, k) => {
      show(p, ps[k], { dx: TT ? 0 : 40, dy: TT ? 20 : 0 })
    })
  }
})

scene('site', (el) => {
  const b = BEATS.site
  const wrap = h('div', 'split', '', el)
  const head = h('div', 'col', '', wrap)
  if (!TT) head.style.width = '560px'
  h('h2', 'h1', `<span>${esc(fill(T.site[0]))}</span><span class="l2">${esc(T.site[1])}</span>`, head)
  h('p', 'lead', esc(T.siteNote), head)
  const device = TT ? 'mobile' : 'desktop'
  const frame = h('div', TT ? 'phone' : 'browser', '', wrap)
  let address = null
  if (!TT) {
    const bar = windowBar('', frame)
    address = h('div', 'address', '', bar)
  }
  const view = h('div', 'viewport', '', frame)
  const vw = TT ? 520 : 1100
  const vh = TT ? 800 : 690
  view.style.width = `${vw}px`
  view.style.height = `${vh}px`
  const list = h('img', '', '', view)
  list.src = `shots/rules-${device}-${LANG}.png`
  list.alt = ''
  const rule = h('img', '', '', view)
  rule.src = `shots/rule-${device}-${LANG}.png`
  rule.alt = ''
  return (l) => {
    show(head, ease(prog(l, b.headline, b.headline + 0.8)), { dx: TT ? 0 : -50, dy: TT ? 30 : 0 })
    show(frame, ease(prog(l, b.list - 0.4, b.list + 0.5)), { dy: 60 })
    const scale = vw / (list.naturalWidth || vw)
    const max = Math.min(Math.max(0, (list.naturalHeight || vh) * scale - vh), TT ? 2600 : 1800)
    list.style.transform = `translateY(${(-max * inOut(prog(l, b.scrollStart, b.scrollEnd))).toFixed(1)}px)`
    const pr = ease(prog(l, b.rule, b.rule + 0.55))
    rule.style.opacity = pr
    rule.style.transform = `translateY(${((1 - pr) * 40).toFixed(1)}px)`
    if (address) address.textContent = sitePath(pr > 0.5 ? '/rules/a11y/img-alt/' : '/rules/')
  }
})

scene('fix', (el) => {
  const b = BEATS.fix
  const wrap = h('div', 'split', '', el)
  wrap.style.alignItems = TT ? 'stretch' : 'center'
  wrap.style.gap = TT ? '32px' : '40px'
  let n = 0
  const rows = D.diff.rows.map((r) => ({ ...r, n: r.kind === 'del' ? '' : ++n }))
  if (TT) el.style.padding = '250px 60px 330px'
  const card = codeCard('src/App.tsx', rows, { font: TT ? 18 : 20, lh: TT ? 26 : 29, width: TT ? 960 : 900 })
  wrap.append(card.root)
  const right = h('div', 'col', '', wrap)
  right.style.gap = '0'
  const lead = h('p', 'lead', esc(T.fixTitle), right)
  if (TT) lead.style.display = 'none'
  lead.style.margin = '0 0 22px'
  lead.style.color = 'var(--ink)'
  lead.style.fontWeight = '600'
  const term = terminal(D.sessions.pass, { rows: 6, width: TT ? 960 : 720, title: 'frontend-skills audit · ~/shop' })
  right.append(term.root)
  const pass = h(
    'div',
    'pass',
    `<div class="check"><svg viewBox="0 0 48 48" width="52" height="52"><path pathLength="1" d="M12 25l8 8 16-17"/></svg></div><div><div class="word">${esc(T.pass)}</div><div class="sub">${esc((D.sessions.pass.raw[0] ?? '').replace(/^.*?: /, ''))}</div></div>`,
    right
  )
  const tick = pass.querySelector('path')
  const lines = card.lines.map((e, i) => ({ e, row: rows[i], natural: 0 }))
  const measure = () => {
    for (const x of lines) {
      x.e.style.height = 'auto'
      x.natural = x.e.offsetHeight
    }
    const after = lines.filter((x) => x.row.kind !== 'del').reduce((s, x) => s + x.natural, 0)
    const before = lines.filter((x) => x.row.kind !== 'add').reduce((s, x) => s + x.natural, 0)
    card.body.style.height = `${Math.max(after, before) + 36}px`
  }
  return Object.assign(
    (l) => {
      show(card.root, ease(prog(l, b.code - 0.4, b.code + 0.4)), { dy: 40 })
      show(lead, ease(prog(l, b.typeStart - 1, b.typeStart - 0.4)), { dy: 20 })
      show(term.root, ease(prog(l, b.typeStart - 0.8, b.typeStart - 0.2)), { dy: 40 })
      for (const x of lines) {
        const { kind, hunk } = x.row
        const sign = x.e.querySelector('.sign')
        if (kind === 'same') {
          x.e.style.height = `${x.natural}px`
          continue
        }
        const at = b.edits[hunk] ?? b.edits[b.edits.length - 1]
        const mark = prog(l, at, at + 0.35)
        const swap = inOut(prog(l, at + 0.35, at + 0.8))
        if (kind === 'del') {
          x.e.classList.toggle('del', mark > 0)
          sign.textContent = mark > 0 ? '−' : ''
          x.e.style.height = `${(x.natural * (1 - swap)).toFixed(1)}px`
          x.e.style.opacity = 1 - swap
        } else {
          x.e.classList.toggle('add', swap > 0)
          sign.textContent = swap > 0 ? '+' : ''
          x.e.style.height = `${(x.natural * swap).toFixed(1)}px`
          x.e.style.opacity = swap
          x.e.style.background = swap > 0 ? `rgb(111 220 140 / ${(0.28 - 0.18 * prog(l, at + 0.8, at + 2.5)).toFixed(3)})` : ''
        }
      }
      term.update(l, b)
      const pp = prog(l, b.pass, b.pass + 0.6)
      show(pass, clamp(back(pp)), { dy: 30, scale: 0.15 })
      tick.style.strokeDasharray = '1'
      tick.style.strokeDashoffset = String(1 - ease(prog(l, b.pass + 0.2, b.pass + 0.8)))
    },
    { measure }
  )
})

scene('outro', (el) => {
  el.classList.add('center')
  const b = BEATS.outro
  const mark = h('div', '', MARK, el)
  mark.style.width = mark.style.height = TT ? '190px' : '150px'
  const path = mark.querySelector('path')
  const name = h('h2', 'h1', 'Frontend Skills', el)
  name.style.fontSize = TT ? '96px' : '100px'
  name.style.marginTop = '30px'
  const line = h('p', 'lead', esc(T.outro), el)
  line.style.margin = '14px 0 30px'
  const chips = h('div', 'chips', T.chips.map((c) => `<span class="pill" style="font-size:28px;padding:10px 26px">${esc(fill(c))}</span>`).join(''), el)
  const cmd = h('div', 'pill mono', `<span class="a">$</span> ${esc(D.sessions.init.command.replace(/ --yes$/, ''))}`, el)
  cmd.style.marginTop = '40px'
  cmd.style.fontSize = TT ? '27px' : '32px'
  cmd.style.fontWeight = '400'
  cmd.style.color = 'var(--ink)'
  cmd.style.borderRadius = '18px'
  const url = h('div', 'url', 'skills.dawidolko.pl', el)
  url.style.marginTop = '44px'
  const gh = h('div', 'gh', 'github.com/dawidolko/frontend-skills', el)
  gh.style.marginTop = '12px'
  return (l) => {
    const pm = prog(l, b.mark, b.mark + 0.8)
    mark.style.opacity = clamp(pm * 3)
    mark.style.transform = `scale(${lerp(0.4, 1, back(pm)).toFixed(3)})`
    path.style.strokeDasharray = '1'
    path.style.strokeDashoffset = String(1 - ease(prog(l, b.mark + 0.3, b.mark + 1)))
    show(name, ease(prog(l, b.name, b.name + 0.7)), { dy: 30 })
    show(line, ease(prog(l, b.name + 0.3, b.name + 1)), { dy: 20 })
    show(chips, ease(prog(l, b.chips, b.chips + 0.7)), { dy: 24 })
    show(cmd, ease(prog(l, b.command, b.command + 0.7)), { dy: 24 })
    show(url, clamp(back(prog(l, b.url, b.url + 0.7))), { dy: 30, scale: 0.1 })
    show(gh, ease(prog(l, b.url + 0.4, b.url + 1)), { dy: 16 })
  }
})

const wm = h('div', '', `${MARK}<span>Frontend Skills</span>`, stage)
wm.id = 'wm'
const fade = h('div', '', '', stage)
fade.id = 'fade'
fade.style.zIndex = '20'

function seek(t) {
  glowA.style.left = `${50 + 32 * Math.sin(t * 0.11)}%`
  glowA.style.top = `${38 + 22 * Math.cos(t * 0.085)}%`
  glowB.style.left = `${55 - 30 * Math.cos(t * 0.07)}%`
  glowB.style.top = `${62 + 20 * Math.sin(t * 0.09)}%`
  bg.style.backgroundPosition = `${(-t * 7).toFixed(1)}px ${(-t * 4).toFixed(1)}px`
  for (const s of scenes) {
    const from = s.start ? s.start - FADE : 0
    const to = s.end < TOTAL ? s.end + FADE : TOTAL
    if (t < from || t > to) {
      s.el.style.display = 'none'
      continue
    }
    s.el.style.display = 'flex'
    const pin = s.start ? inOut(prog(t, s.start - FADE, s.start + FADE)) : 1
    const pout = s.end < TOTAL ? 1 - inOut(prog(t, s.end - FADE, s.end + FADE)) : 1
    const p = Math.min(pin, pout)
    s.el.style.opacity = p
    const scale = pin < 1 ? lerp(1.06, 1, pin) : pout < 1 ? lerp(0.95, 1, pout) : 1 + 0.012 * prog(t, s.start, s.end)
    s.el.style.transform = `scale(${scale.toFixed(4)})`
    const blur = (1 - p) * 12
    s.el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none'
    s.update(t - s.start)
  }
  fade.style.opacity = Math.max(1 - prog(t, 0, 0.5), prog(t, TOTAL - 0.9, TOTAL))
}

async function ready() {
  for (const w of [400, 600, 700]) await document.fonts.load(`${w} 32px "Open Sans"`, 'Aą')
  await document.fonts.ready
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})))
  for (const s of scenes) {
    if (!s.update.measure) continue
    s.el.style.display = 'flex'
    s.update.measure()
    s.el.style.display = 'none'
  }
  seek(0)
}

window.seek = seek
window.play = () => {
  const t0 = performance.now()
  const loop = () => {
    const t = (performance.now() - t0) / 1000
    seek(Math.min(t, TOTAL))
    if (t < TOTAL) requestAnimationFrame(loop)
  }
  loop()
}
window.ready = ready()
