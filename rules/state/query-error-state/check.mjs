/*
 * state/query-error-state: reports object destructuring from useQuery, useInfiniteQuery, useSWR or useSWRInfinite
 * that takes neither error, isError nor status, unless the options turn on throwOnError or suspense (the error then
 * goes to an error boundary). useSuspenseQuery and results kept in one variable (query.error) are not read.
 */
import { closing, findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?:const|let)\s*\{([^{}]*)\}\s*=\s*(useQuery|useInfiniteQuery|useSWR|useSWRInfinite)\s*\(/g)) {
      const names = f.match[1].split(',').map((p) => p.split(':')[0].split('=')[0].trim())
      if (names.some((n) => ['error', 'isError', 'status', '...rest'].includes(n) || n.startsWith('...'))) continue
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end > 0 && /\b(?:throwOnError|useErrorBoundary)\s*:\s*(?!false)|\bsuspense\s*:\s*true/.test(f.code.slice(open, end))) continue
      ctx.report(ctx.lineOf(f.index), `${f.match[2]} result is read without its error; show an error state (error, isError or status).`)
    }
  }
}
