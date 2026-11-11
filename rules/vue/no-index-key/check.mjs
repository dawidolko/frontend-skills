/*
 * vue/no-index-key: reports a :key that is only the index alias of its own v-for ("(item, i) in list" with :key="i",
 * :key="`row-${i}`" or :key="String(i)"). With two aliases the second is the index of an array or the property name of
 * an object, which is stable; it is treated as an index only when its name says so (i, idx, index, rowIndex). With
 * three aliases ("(value, key, index) in object") the third is the index.
 */
const INDEX = /^(?:i|j|idx|ix|ind|index|[a-z]+Index|pos|position)$/

function aliases(expr) {
  const m = /^\s*\(([^)]*)\)\s+(?:in|of)\s/.exec(expr)
  if (!m) return null
  return m[1].split(',').map((s) => s.trim())
}

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      const vfor = el.attrs.get('v-for')
      const key = el.attrs.get('key')
      if (!vfor || !key || !key.dynamic) continue
      const names = aliases(vfor.value)
      if (!names || names.length < 2) continue
      const index = names.length === 3 ? names[2] : names[1]
      if (!/^[\w$]+$/.test(index) || (names.length === 2 && !INDEX.test(index))) continue
      const ids = (key.value.replace(/(["'])(?:(?!\1).)*\1/g, '').replace(/`[^`$]*/g, '').replace(/\$\{|\}/g, ' ').match(/[A-Za-z_$][\w$]*/g) || []).filter((w) => w !== 'String' && w !== 'toString')
      if (ids.length === 1 && ids[0] === index) ctx.report(key.line, `:key="${key.value}" is the loop index; use a stable id from the item.`)
    }
  }
}
