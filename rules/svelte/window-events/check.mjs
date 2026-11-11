/*
 * svelte/window-events: reports window.addEventListener and document.addEventListener calls inside an $effect,
 * $effect.pre or onMount callback of a Svelte component. Listeners on other targets are left to js/listener-cleanup.
 */
import { closing, findInCode } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInCode(ctx, /(?<![\w$.])(?:\$effect(?:\.pre)?|onMount)\s*\(/g)) {
      const open = f.match.index + f.match[0].length - 1
      const end = closing(f.code, open)
      if (end < 0) continue
      const re = /(?<![\w$.])(window|document)\s*\.\s*addEventListener\s*\(\s*["'`]/g
      re.lastIndex = open
      let m
      while ((m = re.exec(f.code)) && m.index < end)
        ctx.report(ctx.lineOf(f.offset + m.index), `Use <svelte:${m[1]} on...={handler} /> instead of ${m[1]}.addEventListener in a lifecycle callback.`)
    }
  }
}
