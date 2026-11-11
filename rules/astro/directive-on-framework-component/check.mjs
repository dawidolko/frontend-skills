/*
 * astro/directive-on-framework-component: reads the default imports of an .astro file's front matter and reports a
 * component imported from a .astro file that carries a client:* directive.
 */
export default {
  check(ctx) {
    const fm = /^\s*---\r?\n([\s\S]*?)\n---/.exec(ctx.text)
    if (!fm) return
    const astro = new Set()
    const re = /import\s+([\w$]+)\s+from\s+["'][^"']+\.astro["']/g
    let m
    while ((m = re.exec(fm[1]))) astro.add(m[1])
    if (!astro.size) return
    for (const el of ctx.elements()) {
      if (!astro.has(el.rawName)) continue
      const directive = [...el.attrs.keys()].find((k) => k.startsWith('client:'))
      if (directive) ctx.report(el, `<${el.rawName}> is an Astro component; ${directive} has no client runtime to hydrate. Use a <script> or a framework component.`)
    }
  }
}
