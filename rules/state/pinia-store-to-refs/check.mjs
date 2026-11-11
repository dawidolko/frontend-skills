/*
 * state/pinia-store-to-refs: in Vue files, reports object destructuring straight from a use...Store() call (or
 * from a variable that holds one) when at least one destructured name is used as a value in the script or template.
 * Names used only as calls or as event handlers are actions, which Pinia allows to be destructured.
 */
import { findInCode } from '../../js/source.mjs'

const locals = (pattern) =>
  pattern
    .split(',')
    .map((p) => p.split('=')[0].split(':').pop().trim())
    .filter((n) => /^[A-Za-z_$][\w$]*$/.test(n))

function templateUses(text, name) {
  const t = /<template[^>]*>([\s\S]*)<\/template>/.exec(text)?.[1] || ''
  const out = []
  const word = new RegExp(`(?<![\\w$.])${name}(?![\\w$])`, 'g')
  for (const m of t.matchAll(/\{\{([\s\S]*?)\}\}/g)) for (const w of m[1].matchAll(word)) out.push(/^\s*\(/.test(m[1].slice(w.index + name.length)))
  for (const m of t.matchAll(/\s(@|v-on:|:|v-[\w-]+)[\w.:[\]-]*\s*=\s*"([^"]*)"/g)) {
    const handler = m[1] === '@' || m[1] === 'v-on:'
    if (handler && m[2].trim() === name) out.push(true)
    else for (const w of m[2].matchAll(word)) out.push(/^\s*\(/.test(m[2].slice(w.index + name.length)))
  }
  return out
}

export default {
  check(ctx) {
    const stores = new Set()
    for (const f of findInCode(ctx, /(?:const|let)\s+([\w$]+)\s*=\s*use\w*Store\s*\(\s*\)/g)) stores.add(f.match[1])
    const sources = ['use\\w*Store\\s*\\(\\s*\\)', ...[...stores].map((s) => `${s}(?![\\w$.(])`)].join('|')
    for (const f of findInCode(ctx, new RegExp(`(?:const|let)\\s*\\{([^{}]*)\\}\\s*=\\s*(?:${sources})`, 'g'))) {
      const end = f.match.index + f.match[0].length
      const values = locals(f.match[1]).filter((name) => {
        const uses = []
        const word = new RegExp(`(?<![\\w$.])${name}(?![\\w$])`, 'g')
        for (const w of f.code.matchAll(word)) if (w.index < f.match.index || w.index >= end) uses.push(/^\s*\(/.test(f.code.slice(w.index + name.length)))
        uses.push(...templateUses(ctx.text, name))
        return uses.some((call) => !call)
      })
      if (values.length) ctx.report(ctx.lineOf(f.index), `${values.join(', ')} lose reactivity when destructured from the store; use storeToRefs().`)
    }
  }
}
