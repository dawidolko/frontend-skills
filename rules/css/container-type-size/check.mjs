/*
 * css/container-type-size: reports container-type: size (also in the container shorthand) on a rule that does not
 * give the element a height (height, block-size, min-height, aspect-ratio or inset), because a size container no
 * longer takes its height from its content and collapses.
 */
const SIZED = /^(height|block-size|min-height|min-block-size|aspect-ratio|inset|grid-row|grid-area)$/

export default {
  check(ctx) {
    for (const b of ctx.css()) {
      const d = b.decls.find((x) => (x.prop === 'container-type' && x.value === 'size') || (x.prop === 'container' && /\/\s*size\s*$/.test(x.value)))
      if (!d || b.decls.some((x) => SIZED.test(x.prop))) continue
      ctx.report(d.line, `container-type: size makes the element ignore its content's height and collapse; use inline-size unless you also set a height.`)
    }
  }
}
