/*
 * a11y/prefer-native-element: reports a role that an HTML element already provides (button, link, checkbox, radio,
 * heading, list, listitem, navigation, main, banner, contentinfo, complementary, textbox, searchbox, slider,
 * progressbar) when it is put on an element that is not that native element. Bound role values and elements with a
 * spread are skipped.
 */
const NATIVE = {
  button: ['button', '<button type="button">'],
  link: ['a', '<a href>'],
  checkbox: ['input', '<input type="checkbox">'],
  radio: ['input', '<input type="radio">'],
  heading: [/^h[1-6]$/, '<h1>…<h6>'],
  list: [/^(ul|ol)$/, '<ul> or <ol>'],
  listitem: ['li', '<li>'],
  navigation: ['nav', '<nav>'],
  main: ['main', '<main>'],
  banner: ['header', '<header>'],
  contentinfo: ['footer', '<footer>'],
  complementary: ['aside', '<aside>'],
  textbox: [/^(input|textarea)$/, '<input> or <textarea>'],
  searchbox: ['input', '<input type="search">'],
  slider: ['input', '<input type="range">'],
  progressbar: ['progress', '<progress>']
}

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || el.spread) continue
      const role = el.attrs.get('role')
      if (!role || role.dynamic) continue
      const r = role.value.trim().toLowerCase().split(/\s+/)[0]
      const native = NATIVE[r]
      if (!native) continue
      const [match, label] = native
      const same = typeof match === 'string' ? el.name === match : match.test(el.name)
      if (!same) ctx.report(el, `<${el.name} role="${r}">: use ${label}, which brings the keyboard behaviour and states with it.`)
    }
  }
}
