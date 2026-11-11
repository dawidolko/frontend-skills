/*
 * angular/ng-optimized-image: reports img elements in Angular templates with a literal src and no ngSrc. Inline
 * data: and blob: URLs (not supported by NgOptimizedImage) and bound [src] values (often previews of user files)
 * are left out.
 */
export default {
  check(ctx) {
    for (const el of ctx.elements('img')) {
      if (el.attrs.has('ngsrc')) continue
      const src = el.attrs.get('src')
      if (!src || src.dynamic || /^\s*(?:data|blob):/i.test(src.value) || !src.value.trim()) continue
      ctx.report(el, `<img src="${src.value}"> skips NgOptimizedImage; use ngSrc with width and height (or fill).`)
    }
  }
}
