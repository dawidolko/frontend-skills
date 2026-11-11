/*
 * angular/for-track-id: reports @for blocks whose track expression is the loop variable itself (track item) when
 * the block reads a property of that variable (item.name), so the items are objects tracked by identity. A loop
 * over strings or numbers, where tracking the value is right, is left out, and so is track $index, which is fine
 * for static lists. Blocks inside HTML comments are ignored.
 */
const FOR = /@for\s*\(\s*([\w$]+)\s+of\s+[^;]*;\s*track\s+([^;)]+?)\s*[;)][^{]*\{/g
const PRIMITIVE =
  /^(?:length|at|charAt|codePointAt|concat|endsWith|includes|indexOf|localeCompare|padEnd|padStart|replace|replaceAll|slice|split|startsWith|substring|toFixed|toLowerCase|toString|toUpperCase|trim|trimEnd|trimStart|valueOf)\b/

function blockEnd(text, open) {
  let depth = 0
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}' && --depth === 0) return i
  }
  return text.length
}

export default {
  check(ctx) {
    const text = ctx.text.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
    FOR.lastIndex = 0
    for (const m of text.matchAll(FOR)) {
      const name = m[1]
      if (m[2].trim() !== name) continue
      const open = m.index + m[0].length - 1
      const body = text.slice(open, blockEnd(text, open))
      const props = [...body.matchAll(new RegExp(`(?<![\\w$.])${name.replace(/\$/g, '\\$')}\\s*\\??\\.\\s*([A-Za-z_$][\\w$]*)`, 'g'))]
      if (props.some((p) => !PRIMITIVE.test(p[1])))
        ctx.report(ctx.lineOf(m.index), `track ${name} tracks objects by identity; track a unique field such as ${name}.id.`)
    }
  }
}
