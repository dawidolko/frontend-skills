/*
 * svelte/each-key: reads every {#each ...} block of a Svelte file. It reports a key that is the index variable,
 * and a block with no key whose body holds state that would move to the wrong item: a form field, a bind:, a
 * component, or a transition or animation. Blocks over a literal array or Array(n), and blocks without "as", are
 * left out.
 */
const STATEFUL = /<(?:input|textarea|select)\b|\bbind:|<[A-Z][\w.]*[\s/>]|\b(?:transition|in|out|animate):/

function balanced(text, open) {
  let depth = 0
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}' && --depth === 0) return i
  }
  return -1
}

function body(text, from) {
  const re = /\{#each\b|\{\/each\s*\}/g
  re.lastIndex = from
  let depth = 1
  let m
  while ((m = re.exec(text))) {
    depth += m[0].startsWith('{#') ? 1 : -1
    if (depth === 0) return text.slice(from, m.index)
  }
  return text.slice(from)
}

export default {
  check(ctx) {
    const text = ctx.text
    const re = /\{#each\s/g
    let m
    while ((m = re.exec(text))) {
      const close = balanced(text, m.index)
      if (close < 0) continue
      const head = text.slice(m.index + 6, close).trim()
      const as = head.search(/\sas\s/)
      if (as < 0) continue
      const iterable = head.slice(0, as).trim()
      let rest = head.slice(as + 4).trim()
      const keyed = /\(([^()]*)\)\s*$/.exec(rest)
      const key = keyed ? keyed[1].trim() : null
      if (keyed) rest = rest.slice(0, keyed.index).trim()
      const index = /,\s*([\w$]+)\s*$/.exec(rest)?.[1]
      if (key !== null) {
        if (index && key === index) ctx.report(ctx.lineOf(m.index), `The key (${key}) is the index; key the block by a unique id from the data.`)
        continue
      }
      if (/^(?:\[|Array\s*\(|Array\.from\s*\(|new\s+Array\b)/.test(iterable) || /^_\s*(?:,|$)/.test(rest)) continue
      if (STATEFUL.test(body(text, close + 1))) ctx.report(ctx.lineOf(m.index), 'This each block holds state but has no key; add (item.id) after the as part.')
    }
  }
}
