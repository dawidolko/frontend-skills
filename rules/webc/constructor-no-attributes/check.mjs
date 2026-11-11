/*
 * webc/constructor-no-attributes: in classes that extend HTMLElement (or another HTML element class), reports the
 * first use in the constructor of the host's attributes or children: get/set/has/removeAttribute, attributes,
 * classList, className, dataset, id, appendChild, append, prepend, innerHTML, textContent, children and similar.
 * Work on this.shadowRoot or on a shadow root variable is fine and is not reported.
 */
import { closing, findInCode } from '../../js/source.mjs'
import { classes } from '../lit.mjs'

const HOST = /this\s*\.\s*(?:(getAttribute|setAttribute|hasAttribute|removeAttribute|toggleAttribute|getAttributeNames|attributes|classList|className|dataset|appendChild|append|prepend|replaceChildren|insertAdjacentHTML|insertAdjacentElement|innerHTML|outerHTML|textContent|innerText|children|childNodes|firstChild|firstElementChild|querySelector|querySelectorAll)\b|(id)(?=\s*=[^=]))/g

export default {
  check(ctx) {
    const done = new Set()
    for (const f of findInCode(ctx, /constructor\s*\([^)]*\)\s*\{/g)) {
      const cls = classes(f.code, /^HTML\w*Element$/).find((c) => c.open < f.match.index && f.match.index < c.end)
      if (!cls || done.has(f.offset + cls.open)) continue
      done.add(f.offset + cls.open)
      const open = f.match.index + f.match[0].length - 1
      const body = f.code.slice(open, closing(f.code, open))
      HOST.lastIndex = 0
      const m = HOST.exec(body)
      if (m) ctx.report(ctx.lineOf(f.offset + open + m.index), `this.${m[1] || m[2]} in the constructor touches the host's attributes or children; move it to connectedCallback.`)
    }
  }
}
