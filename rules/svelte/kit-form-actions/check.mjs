/*
 * svelte/kit-form-actions: in a SvelteKit project, reports a <form> that has a submit handler (onsubmit or
 * on:submit) and named fields, but neither a method nor an action, so its data cannot be sent without
 * JavaScript. A form with a spread (a remote function form) and a form with no named field (a client-only widget
 * such as a chat box or a filter) are left out.
 */
export default {
  check(ctx) {
    for (const form of ctx.elements('form')) {
      if (form.spread || form.attrs.has('method') || form.attrs.has('action')) continue
      if (!form.attrs.has('onsubmit')) continue
      const fields = ctx.elements().filter((e) => e.index > form.index && (form.end === undefined || e.index < form.end) && e.attrs.has('name'))
      if (fields.length > 0) ctx.report(form, 'This form works only with JavaScript; give it method="POST" and an action, and enhance it with use:enhance.')
    }
  }
}
