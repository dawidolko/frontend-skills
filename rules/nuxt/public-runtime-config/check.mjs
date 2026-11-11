/*
 * nuxt/public-runtime-config: a project-level check that reads nuxt.config.ts, .js or .mjs (at the root and in any
 * folder of the file list) and reports keys under runtimeConfig.public whose name says secret, password, private
 * key or credential, or whose value reads a process.env variable with such a name. Names such as apiKey or token
 * are left out, because many are public by design (a maps key, a publishable key).
 */
import { blank, closing } from '../../js/source.mjs'

const SECRET = /secret|passw(?:or)?d|private|credential/i
const NOT_SECRET = /publishable|public|site/i
const CONFIG = /(?:^|\/|\.)nuxt\.config\.(?:ts|js|mjs|cjs)$/

function configs(ctx) {
  const out = new Set(['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs'])
  for (const f of ctx.files) {
    if (CONFIG.test(f.path)) out.add(f.path)
    const dir = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/') + 1) : ''
    if (dir) for (const ext of ['ts', 'js', 'mjs']) out.add(`${dir}nuxt.config.${ext}`)
  }
  return [...out]
}

export default {
  check(ctx) {
    for (const file of configs(ctx)) {
      const raw = ctx.read(file)
      if (!raw || !/runtimeConfig/.test(raw)) continue
      const code = blank(raw)
      const rc = /runtimeConfig\s*:\s*\{/.exec(code)
      if (!rc) continue
      const rcEnd = closing(code, rc.index + rc[0].length - 1)
      const pub = /(?<![\w$])public\s*:\s*\{|['"]public['"]\s*:\s*\{/g
      pub.lastIndex = rc.index
      const p = pub.exec(code)
      if (!p || p.index > rcEnd) continue
      const open = p.index + p[0].length - 1
      const end = closing(code, open)
      const re = /([\w$]+|(["'])[^"'\n]*\2)\s*:\s*([^,\n}]*)/g
      re.lastIndex = open + 1
      let depth = 0
      let last = open + 1
      for (const m of raw.matchAll(re)) {
        if (m.index >= end) break
        for (let i = last; i < m.index; i++) depth += code[i] === '{' ? 1 : code[i] === '}' ? -1 : 0
        last = m.index
        if (depth !== 0 || (code[m.index] !== raw[m.index] && !/^["']/.test(m[1]))) continue
        const key = m[1].replace(/["']/g, '')
        const env = /process\.env\.([\w$]+)/.exec(m[3])
        if ((SECRET.test(key) && !NOT_SECRET.test(key)) || (env && SECRET.test(env[1])))
          ctx.report(
            { file, line: raw.slice(0, m.index).split('\n').length },
            `runtimeConfig.public.${key} is sent to every browser; move it to the top level of runtimeConfig (server-only).`
          )
      }
    }
  }
}
