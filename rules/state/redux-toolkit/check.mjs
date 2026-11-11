/*
 * state/redux-toolkit: reports an import of createStore (or legacy_createStore) from the redux core package.
 */
import { findInRaw } from '../../js/source.mjs'

export default {
  check(ctx) {
    for (const f of findInRaw(ctx, /import\s*\{[^}]*\b(?:legacy_)?createStore\b[^}]*\}\s*from\s*(["'])redux\1/g))
      ctx.report(ctx.lineOf(f.index), 'createStore from redux is legacy; use configureStore from @reduxjs/toolkit.')
  }
}
