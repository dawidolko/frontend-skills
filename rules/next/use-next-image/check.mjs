/*
 * next/use-next-image: in a Next.js project, reports native img elements in JSX. An img inside a picture element is
 * left out (the documented alternative), and so are files that generate images with ImageResponse
 * (opengraph-image, twitter-image, icon, apple-icon), where plain img is required.
 */
const GENERATED = /(?:^|\/)(?:opengraph-image|twitter-image|icon|apple-icon)[^/]*\.[jt]sx?$/

export default {
  check(ctx) {
    if (GENERATED.test(ctx.file) || /\bImageResponse\b/.test(ctx.text)) return
    for (const el of ctx.elements('img')) {
      if (el.ancestors.includes('picture')) continue
      ctx.report(el, 'Use <Image> from next/image instead of <img>; it serves resized AVIF/WebP and reserves the space.')
    }
  }
}
