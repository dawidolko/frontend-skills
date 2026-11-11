/*
 * state/selector-stable-result: reports a selector passed to useSelector (or a typed use...Selector hook) or to a
 * Zustand-style use...Store hook when it returns an object literal, an array literal, or the result of filter, map or
 * toSorted, unless it is wrapped in useShallow or an equality function is passed as the second argument.
 */
import { closing, findInCode, splitArgs } from '../../js/source.mjs'

const ARROW = /^(?:async\s+)?(?:\([^()]*\)|[\w$]+)\s*=>\s*/
const FRESH = /^(?:\(\s*\{|\[|\{\s*return\s*[[{])/
const DERIVED = /\.\s*(?:filter|map|toSorted|toReversed)\s*\(/

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])(use\w*Selector|use\w*Store)\s*\(/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const args = splitArgs(f.code, open, end)
      if (args.length !== 1) continue
      const sel = f.code.slice(args[0].start, args[0].end).trim()
      const arrow = ARROW.exec(sel)
      if (!arrow) continue
      const body = sel.slice(arrow[0].length)
      if (!FRESH.test(body) && !(body[0] !== '{' && DERIVED.test(body))) continue
      const redux = /Selector$/.test(f.match[1])
      ctx.report(
        ctx.lineOf(f.index),
        redux
          ? `This ${f.match[1]} selector returns a new value on every call; select fields one by one, pass shallowEqual or use createSelector.`
          : `This ${f.match[1]} selector returns a new object or array; wrap it in useShallow or select one value per call.`
      )
    }
  }
}
