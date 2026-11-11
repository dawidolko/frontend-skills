/*
 * a11y/aria-label-generic: reports aria-label or aria-labelledby on an element whose role does not allow a name:
 * div, span, p, b, i, em, strong, small, code, sub, sup, del and ins without a role attribute. Elements with a spread
 * are skipped, since the spread may add a role.
 */
const GENERIC = new Set(['div', 'span', 'p', 'b', 'i', 'em', 'strong', 'small', 'code', 'sub', 'sup', 'del', 'ins'])

export default {
  check(ctx) {
    for (const el of ctx.elements([...GENERIC])) {
      if (el.spread || el.attrs.has('role')) continue
      const a = ['aria-label', 'aria-labelledby'].find((n) => el.attrs.has(n))
      if (a) ctx.report(el, `${a} on <${el.name}> is not announced reliably; put it on a control or landmark, or add a fitting role.`)
    }
  }
}
