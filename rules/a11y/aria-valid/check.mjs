/*
 * a11y/aria-valid: reports role values that are not WAI-ARIA 1.2 roles (DPUB and Graphics roles and the roles added
 * in the ARIA 1.3 draft are accepted) and aria-* attribute names that do not exist, such as the common typo
 * aria-labeledby. Bound role values and elements of other namespaces are left alone.
 */
const ROLES = new Set(
  `alert alertdialog application article banner blockquote button caption cell checkbox code
columnheader combobox comment complementary contentinfo definition deletion dialog directory document emphasis feed
figure form generic grid gridcell group heading img image insertion link list listbox listitem log main mark marquee
math menu menubar menuitem menuitemcheckbox menuitemradio meter navigation none note option paragraph presentation
progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox sectionfooter sectionheader
separator slider spinbutton status strong subscript suggestion superscript switch tab table tablist tabpanel term
textbox time timer toolbar tooltip tree treegrid treeitem`.split(/\s+/)
)

const ATTRS = new Set(
  `activedescendant actions atomic autocomplete braillelabel brailleroledescription busy checked
colcount colindex colindextext colspan controls current describedby description details disabled dropeffect
errormessage expanded flowto grabbed haspopup hidden invalid keyshortcuts label labelledby level live modal multiline
multiselectable orientation owns placeholder posinset pressed readonly relevant required roledescription rowcount
rowindex rowindextext rowspan selected setsize sort valuemax valuemin valuenow valuetext`
    .split(/\s+/)
    .map((a) => `aria-${a}`)
)

const validRole = (r) => ROLES.has(r) || /^(doc|graphics)-[a-z]+$/.test(r)

export default {
  check(ctx) {
    for (const el of ctx.elements()) {
      if (el.component || el.name.includes(':')) continue
      const role = el.attrs.get('role')
      if (role && !role.dynamic) {
        const tokens = role.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
        if (tokens.length && !tokens.some(validRole)) ctx.report(el, `role="${role.value.trim()}" is not a WAI-ARIA role; use a valid role or none.`)
      }
      for (const name of el.attrs.keys())
        if (name.startsWith('aria-') && !ATTRS.has(name))
          ctx.report(el, `${name} is not an ARIA attribute${name === 'aria-labeledby' ? '; the name is aria-labelledby' : ''}.`)
    }
  }
}
