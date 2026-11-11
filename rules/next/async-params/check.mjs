/*
 * next/async-params: in App Router route files (a path under app/ named page, layout, default or template, or a
 * file whose default export is named Page or Layout), finds functions that take params or searchParams (or props)
 * and reports reading them synchronously: params.slug, props.params.slug, or const { slug } = params without await.
 * Pages Router files, generateImageMetadata and generateStaticParams (which receive plain values) and functions that
 * declare their own params (useParams, useSearchParams) are left out.
 */
import { closing, findInCode } from '../../js/source.mjs'

const ROUTE_PATH = /(?:^|\/)app\/(?:.*\/)?(?:page|layout|default|template)\.[jt]sx?$/
const ROUTE_NAME = /export\s+default\s+(?:async\s+)?function\s+(?:Page|Layout|RootLayout)\s*\(|export\s+(?:async\s+)?function\s+generateMetadata\s*\(/
const SYNC_PARAMS = new Set(['generateImageMetadata', 'generateStaticParams', 'generateSitemaps'])
const FN = /(?:function\s+([\w$]+)\s*|(?:const|let)\s+([\w$]+)\s*(?::[^=]+)?=\s*(?:async\s*)?)\(/g

export default {
  check(ctx) {
    if (/(?:^|\/)pages\//.test(ctx.file) || /\bget(?:Static|ServerSide)(?:Props|Paths)\b/.test(ctx.text)) return
    if (!ROUTE_PATH.test(ctx.file) && !ROUTE_NAME.test(ctx.text)) return
    for (const f of findInCode(ctx, FN)) {
      const name = f.match[1] || f.match[2]
      if (SYNC_PARAMS.has(name)) continue
      const open = f.match.index + f.match[0].length - 1
      const close = closing(f.code, open)
      if (close < 0) continue
      const head = f.code.slice(open, close)
      const props = /^\(\s*([\w$]+)\s*[:,)]/.exec(head)?.[1]
      const names = ['params', 'searchParams'].filter((p) => new RegExp(`\\b${p}\\b`).test(head))
      if (!names.length && !props) continue
      const brace = f.code.indexOf('{', close)
      const arrow = f.code.indexOf('=>', close)
      if (brace < 0 || (arrow >= 0 && arrow < brace && !/^\s*\{/.test(f.code.slice(arrow + 2)))) continue
      const end = closing(f.code, brace)
      if (end < 0) continue
      const body = f.code.slice(brace, end)
      const patterns = []
      for (const p of names) {
        if (new RegExp(`(?:const|let)\\s+${p}\\b`).test(body)) continue
        patterns.push(`(?<![\\w$.])${p}\\s*\\.\\s*(?!then\\b|catch\\b)[A-Za-z_$]`, `\\}\\s*=\\s*${p}\\b(?!\\s*\\.)`)
      }
      if (props) patterns.push(`(?<![\\w$.])${props}\\s*\\.\\s*(?:params|searchParams)\\s*\\.\\s*(?!then\\b)[A-Za-z_$]`, `\\}\\s*=\\s*${props}\\s*\\.\\s*(?:params|searchParams)\\b(?!\\s*\\.)`)
      if (!patterns.length) continue
      const hit = new RegExp(patterns.join('|')).exec(body)
      if (hit) ctx.report(ctx.lineOf(f.offset + brace + hit.index), `${name} reads params or searchParams synchronously; await them (or use() in a Client Component).`)
    }
  }
}
