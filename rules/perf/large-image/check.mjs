/*
 * perf/large-image: a project-level check that reports raster image files larger than the image budget
 * (profile audit.budgets.imageKB, default 250 KB).
 */
export default {
  check(ctx) {
    const kb = Number(ctx.profile?.audit?.budgets?.imageKB) || 250
    for (const f of ctx.files)
      if (f.kind === 'image' && f.size > kb * 1000)
        ctx.report({ file: f.path, line: 1 }, `${f.path} is ${Math.round(f.size / 1000)} KB (budget ${kb} KB); resize it and encode as AVIF or WebP.`)
  }
}
