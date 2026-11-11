/*
 * astro/server-defer-fallback: reports elements with server:defer that have no direct child with slot="fallback".
 * Elements with a spread are left out, since a fallback cannot come from one but the island may be a wrapper.
 */
export default {
  check(ctx) {
    const all = ctx.elements()
    for (const el of all) {
      if (!el.attrs.has('server:defer') || el.spread) continue
      const fallback = all.some((c) => c.parent === el && c.attrs.get('slot')?.value === 'fallback')
      if (!fallback) ctx.report(el, `<${el.rawName} server:defer> has no slot="fallback" child; its space stays empty until the island loads.`)
    }
  }
}
