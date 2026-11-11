/*
 * html/picture-img: reports a <picture> that has no <img> inside it, because the img is what actually renders and
 * carries alt, width and height; <source> elements only offer files to it. A picture that contains a component, a
 * slot or a template expression ({children}, {{ … }}) is skipped, since that may render the img.
 */
export default {
  check(ctx) {
    const all = ctx.elements()
    for (const pic of ctx.elements('picture')) {
      const inside = all.filter((e) => e.index > pic.index && (pic.end === undefined || e.index < pic.end))
      if (inside.some((e) => e.component || e.name === 'slot')) continue
      if (ctx.kind !== 'html' && ctx.text.slice(pic.index, pic.end ?? ctx.text.length).includes('{')) continue
      if (!inside.some((e) => e.name === 'img')) ctx.report(pic, '<picture> has no <img>, so nothing renders; end it with an <img> that has src, alt, width and height.')
    }
  }
}
