/*
 * nuxt/route-announcer: a project-level check. When the file list has a Nuxt app.vue (app.vue or app/app.vue, any
 * file named *app.vue in lower case; src/App.vue of a plain Vue app is not one), it reports that file when neither
 * it nor any .vue file in a layouts/ folder renders NuxtRouteAnnouncer.
 */
const APP = /(?:^|\/|\.)app\.vue$/
const ANNOUNCER = /<(?:NuxtRouteAnnouncer|nuxt-route-announcer)\b/

export default {
  check(ctx) {
    const apps = ctx.files.filter((f) => f.kind === 'vue' && APP.test(f.path))
    if (apps.length === 0) return
    const layouts = ctx.files.filter((f) => f.kind === 'vue' && /(?:^|\/)layouts\//.test(f.path))
    if ([...apps, ...layouts].some((f) => ANNOUNCER.test(ctx.read(f.path)))) return
    for (const app of apps) ctx.report({ file: app.path, line: 1 }, 'No NuxtRouteAnnouncer in app.vue or a layout; client-side page changes are not announced.')
  }
}
