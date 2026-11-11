/*
 * A small, strict Markdown renderer for the site: enough for rule bodies, skill sections and the language files
 * (paragraphs, ### headings, lists, fenced code, pipe tables, inline code, bold, italics, links and bare URLs).
 * Everything is escaped first, so a rule's text can never inject markup. Known rule ids in text and code become links
 * to their dictionary page, and relative links are resolved against a base URL (the file's folder on GitHub).
 */

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const ID = /^[a-z]+\/[a-z0-9-]+$/

/**
 * Renders inline Markdown. Options: ruleHref(id) returns the page of a known rule id or null; base resolves relative
 * links; external links get no special treatment (no target, no tracking).
 */
export function inline(text, opts = {}) {
  const { ruleHref = () => null, base = null, noLinks = false } = opts
  const out = []
  const parts = String(text ?? '').split(/(`[^`]+`)/)
  for (const part of parts) {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      const code = part.slice(1, -1)
      const href = ID.test(code) ? ruleHref(code) : null
      out.push(href ? `<a href="${esc(href)}"><code>${esc(code)}</code></a>` : `<code>${esc(code)}</code>`)
      continue
    }
    out.push(prose(part, ruleHref, base, noLinks))
  }
  return out.join('')
}

function resolve(url, base) {
  if (/^(https?:|mailto:|\/|#)/.test(url) || !base) return url
  try {
    return new URL(url, base).href
  } catch {
    return url
  }
}

function prose(text, ruleHref, base, noLinks) {
  const links = []
  if (noLinks) return esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  /* Links first, so their text and address are not touched by the other inline rules. */
  let s = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    links.push({ label, url: resolve(url, base) })
    return `\u0000${links.length - 1}\u0000`
  })
  s = s.replace(/https?:\/\/[^\s)<>"]+[^\s)<>".,;:!?]/g, (url) => {
    links.push({ label: url, url })
    return `\u0000${links.length - 1}\u0000`
  })
  s = esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\s][^_]*)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(,])([a-z]+\/[a-z0-9-]+)(?=[\s),.;:]|$)/g, (m, pre, id) => {
      const href = ruleHref(id)
      return href ? `${pre}<a href="${esc(href)}">${id}</a>` : m
    })
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => {
    const { label, url } = links[Number(i)]
    return `<a href="${esc(url)}">${inline(label, { noLinks: true })}</a>`
  })
}

/* Marks the comment lines that say "bad" or "good" in an example, so the two halves are told apart by more than colour. */
function codeLines(code) {
  return esc(code)
    .split('\n')
    .map((line) => {
      const m = /^\s*(?:&lt;!--|\/\/|\/\*|#|\{\/\*)\s*(bad|good|wrong|right|avoid|prefer)\b/i.exec(line)
      if (!m) return line
      const kind = /bad|wrong|avoid/i.test(m[1]) ? 'bad' : 'good'
      return `<span class="code-${kind}">${line}</span>`
    })
    .join('\n')
}

export function codeBlock(code, lang = '') {
  const cls = lang ? ` class="language-${esc(lang)}"` : ''
  const label = lang ? ` data-lang="${esc(lang)}"` : ''
  return `<pre${label} tabindex="0"><code${cls}>${codeLines(code.replace(/\n+$/, ''))}</code></pre>`
}

function table(rows, opts) {
  const cells = (r) =>
    r
      .replace(/^\s*\|/, '')
      .replace(/\|\s*$/, '')
      .split(/(?<!\\)\|/)
      .map((c) => c.trim().replace(/\\\|/g, '|'))
  const head = cells(rows[0])
  const body = rows.slice(2).map(cells)
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(head.join(', '))}"><table><thead><tr>${head
    .map((h) => `<th scope="col">${inline(h, opts)}</th>`)
    .join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c, opts)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
}

/**
 * Renders block Markdown. opts.headingOffset shifts heading levels (### becomes h(3 + offset - 1) …) so a body can sit
 * under the page's own h2.
 */
export function markdown(src, opts = {}) {
  const { headingBase = 3 } = opts
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    const fence = /^(\s*)(```+|~~~+)\s*([\w+-]*)/.exec(line)
    if (fence) {
      const close = fence[2]
      const body = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith(close)) body.push(lines[i++].slice(fence[1].length))
      i++
      out.push(codeBlock(body.join('\n'), fence[3]))
      continue
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      const level = Math.max(2, Math.min(6, h[1].length + headingBase - 3))
      out.push(`<h${level}>${inline(h[2], opts)}</h${level}>`)
      i++
      continue
    }
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const rows = []
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++])
      out.push(table(rows, opts))
      continue
    }
    const li = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line)
    if (li) {
      const ordered = /\d/.test(li[2])
      const items = []
      while (i < lines.length) {
        const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i])
        if (m && m[1].length <= li[1].length + 1) {
          items.push(m[3])
          i++
        } else if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) {
          items[items.length - 1] += ` ${lines[i].trim()}`
          i++
        } else break
      }
      const tag = ordered ? 'ol' : 'ul'
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t, opts)}</li>`).join('')}</${tag}>`)
      continue
    }
    if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''))
      out.push(`<blockquote>${markdown(quote.join('\n'), opts)}</blockquote>`)
      continue
    }
    const para = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(\s*)(```|~~~)/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) &&
      !/^\s*\|/.test(lines[i])
    )
      para.push(lines[i++].trim())
    if (para.length) out.push(`<p>${inline(para.join(' '), opts)}</p>`)
    else i++
  }
  return out.join('\n')
}

/** Plain text of inline Markdown, for titles, descriptions and the search index. */
export const plain = (s) =>
  String(s ?? '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
