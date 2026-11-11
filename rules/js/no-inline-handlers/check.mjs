/*
 * js/no-inline-handlers: reports event handler attributes (onclick, onsubmit, onload...) with a literal string of
 * script on elements of HTML and Astro files. Bound handlers (onclick={fn} in Astro) are not inline script.
 */
export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component) continue
      for (const a of el.attrs.values()) {
        if (a.dynamic || !/^on[a-z]+$/.test(a.name) || !/^on/i.test(a.raw) || !a.value.trim()) continue
        ctx.report(a.line, `<${el.name} ${a.raw}="..."> is inline script; attach the handler with addEventListener in a module.`)
      }
    }
  }
}
