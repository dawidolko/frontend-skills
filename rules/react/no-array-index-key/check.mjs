/*
 * react/no-array-index-key: reports key={i}, key={`${i}`}, key={String(i)} and similar when i is the second
 * parameter (the index) of the nearest .map(...) callback before the element.
 */
const MAP = /\.(?:map|flatMap)\(\s*(?:function\s*[\w$]*\s*)?\(([^)]*)\)/g

function splitParams(src) {
  const out = []
  let depth = 0
  let cur = ''
  for (const c of src) {
    if ('{[('.includes(c)) depth++
    if ('}])'.includes(c)) depth--
    if (c === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += c
  }
  out.push(cur.trim())
  return out
}

function indexParam(text, before) {
  MAP.lastIndex = Math.max(0, before - 800)
  let name = null
  let m
  while ((m = MAP.exec(text)) && m.index < before) {
    const p = splitParams(m[1])[1]
    name = p ? p.replace(/[:=].*$/, '').trim() : null
  }
  return name && /^[\w$]+$/.test(name) ? name : null
}

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const key = el.attrs.get('key')
      if (!key || !key.dynamic) continue
      const index = indexParam(ctx.text, el.index)
      if (!index) continue
      const ids = (key.value.replace(/(["'])(?:(?!\1).)*\1/g, '').match(/[A-Za-z_$][\w$]*/g) || []).filter((w) => !['String', 'toString'].includes(w))
      if (ids.length === 1 && ids[0] === index) ctx.report(el, `key={${key.value}} uses the array index; use a stable id from the data.`)
    }
  }
}
