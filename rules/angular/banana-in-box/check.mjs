/*
 * angular/banana-in-box: reports attributes written ([name]) in Angular templates, the reversed form of the
 * two-way binding [(name)].
 */
export default {
  check(ctx) {
    for (const el of ctx.elements())
      for (const a of el.attrs.values())
        if (/^\(\[[^\]]+\]\)$/.test(a.raw)) ctx.report(a.line, `${a.raw} binds an event, not both ways; write [(${a.raw.slice(2, -2)})].`)
  }
}
