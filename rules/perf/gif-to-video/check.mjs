/*
 * perf/gif-to-video: a project-level check that reports animated-GIF candidates: .gif files larger than 100 KiB,
 * the size above which Chrome's image delivery insight suggests a video instead.
 */
const LIMIT = 100 * 1024

export default {
  check(ctx) {
    for (const f of ctx.files)
      if (/\.gif$/i.test(f.path) && f.size > LIMIT)
        ctx.report({ file: f.path, line: 1 }, `${f.path} is a ${Math.round(f.size / 1024)} KiB GIF; encode it as a muted, looping MP4 or WebM <video>.`)
  }
}
