/*
 * vue/multi-word-names: a project-level check that reports .vue files whose name is a single word (Header.vue,
 * item.vue). Left out: App and app, index, error, default, files under pages/, views/, layouts/ or another route
 * folder, dynamic route names ([id].vue), and components in a subfolder of components/, because Nuxt and similar
 * tools prefix those with the folder name (components/base/Button.vue is BaseButton). The fix is a rename.
 */
const EXEMPT = /^(?:app|index|error|default|layout)$/i
const ROUTE_DIRS = /(?:^|\/)(?:pages|views|layouts|routes|screens)\//i

export default {
  check(ctx) {
    for (const f of ctx.files) {
      if (f.kind !== 'vue') continue
      const base = f.path.split('/').pop().replace(/\.vue$/i, '')
      if (EXEMPT.test(base) || ROUTE_DIRS.test(f.path) || /[[\]._-]/.test(base)) continue
      if (/(?:^|\/)components\/[^/]+\/[^/]+$/i.test(f.path)) continue
      if (/^[A-Z]?[a-z0-9]+$/.test(base))
        ctx.report({ file: f.path, line: 1 }, `${base}.vue is a single-word component name; rename it to two or more words (for example App${base[0].toUpperCase()}${base.slice(1)}.vue).`)
    }
  }
}
