/*
 * next/no-async-client-component: in a file that starts with 'use client', reports async functions and async arrow
 * functions whose name starts with a capital letter (React components). Lower-case async helpers and handlers are
 * left out.
 */
import { findInCode } from '../../js/source.mjs'

const DIRECTIVE = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*(["'])use client\1/

export default {
  check(ctx) {
    if (!DIRECTIVE.test(ctx.text)) return
    const re = /\basync\s+function\s+([A-Z][\w$]*)\s*\(|(?:const|let)\s+([A-Z][\w$]*)\s*(?::[^=]+)?=\s*async\b/g
    for (const f of findInCode(ctx, re))
      ctx.report(ctx.lineOf(f.index), `${f.match[1] || f.match[2]} is an async Client Component; await in a Server Component and pass props, or read a promise with use().`)
  }
}
