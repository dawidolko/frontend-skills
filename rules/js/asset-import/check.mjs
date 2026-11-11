/*
 * js/asset-import: in framework component files of a bundled project, reports native img, source, video, audio,
 * track and SVG image elements whose src, srcset, poster or href is a literal root path ("/images/x.jpg") to an
 * image, font or media file. Bound values, imports, relative paths (rewritten by the Vue compiler), full URLs and
 * icon paths (reported by html/icon-from-set) are left out.
 */
const ASSET = /^\/(?!\/)[^?#\s]*\.(?:avif|webp|png|jpe?g|gif|svg|bmp|mp4|webm|ogv|mp3|ogg|wav|m4a|vtt|woff2?|ttf|otf)(?:[?#]\S*)?$/i
const ICON = /(?:^|\/)(?:icons?|sprites?)\/|(?:^|[/_-])icon[-_.]/i
const ATTRS = { img: ['src', 'srcset'], source: ['src', 'srcset'], video: ['src', 'poster'], audio: ['src'], track: ['src'], image: ['href', 'xlink:href'] }

export default {
  check(ctx) {
    for (const el of ctx.elements(Object.keys(ATTRS))) {
      for (const name of ATTRS[el.name]) {
        const a = el.attrs.get(name)
        if (!a || a.dynamic) continue
        const first = a.value.trim().split(/\s+/)[0]
        if (!ASSET.test(first) || ICON.test(first)) continue
        ctx.report(a.line, `${name}="${first}" is a hard-coded root path; import the file or build the URL with the base-path helper.`)
        break
      }
    }
  }
}
