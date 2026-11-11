/*
 * webc/host-hidden: reports a :host rule that sets display (other than none) when the same file has no
 * :host([hidden]) rule. It reads stylesheets, style elements (also inside declarative shadow DOM templates) and,
 * in script files, the text of css`` tagged templates and style strings.
 */
const HOST_DISPLAY = /:host\s*\{[^}]*?\bdisplay\s*:\s*(?!none\b)[a-z-]+/g
const HIDDEN = /:host\s*\(\s*\[\s*hidden\s*\]\s*\)/

export default {
  check(ctx) {
    if (!ctx.text.includes(':host') || HIDDEN.test(ctx.text)) return
    if (ctx.kind === 'jsx') {
      HOST_DISPLAY.lastIndex = 0
      const m = HOST_DISPLAY.exec(ctx.text)
      if (m) ctx.report(ctx.lineOf(m.index), 'Add :host([hidden]) { display: none; } next to the :host display rule.')
      return
    }
    for (const block of ctx.css()) {
      if (!/(^|[\s,]):host(?![\w(-])/.test(block.prelude)) continue
      const d = block.decls.find((x) => x.prop === 'display' && !/^none\b/.test(x.value.trim()))
      if (d) return ctx.report(d.line, 'Add :host([hidden]) { display: none; } next to the :host display rule.')
    }
  }
}
