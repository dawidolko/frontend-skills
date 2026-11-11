/*
 * state/query-object-syntax: reports useQuery, useInfiniteQuery, useSuspenseQuery, useSuspenseInfiniteQuery and
 * useIsFetching calls whose first argument is a key (string or array literal), and useMutation calls whose first
 * argument is an inline function: the positional forms removed in TanStack Query 5. An options object, a variable
 * or a call such as queryOptions(...) is accepted.
 */
import { findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])(useQuery|useInfiniteQuery|useSuspenseQuery|useSuspenseInfiniteQuery|useIsFetching)\s*\(\s*["'`[]/g))
      ctx.report(ctx.lineOf(f.index), `${f.match[1]}(key, fn) is the v4 form; pass one object: ${f.match[1]}({ queryKey, queryFn }).`)
    for (const f of findInCode(ctx, /(?<![\w$.])useMutation\s*\(\s*(?:async\s+)?(?:\([^()]*\)|[\w$]+)\s*=>/g))
      ctx.report(ctx.lineOf(f.index), 'useMutation(fn) is the v4 form; pass one object: useMutation({ mutationFn }).')
  }
}
