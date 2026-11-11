/*
 * js/document-write: reports calls of document.write and document.writeln in script code.
 */
import { findInCode } from '../source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])document\s*\.\s*write(?:ln)?\s*\(/g))
      ctx.report(ctx.lineOf(f.index), 'document.write blocks parsing; create elements or append a script instead.')
  }
}
