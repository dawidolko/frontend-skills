// var count = 0 in a comment is not code
export function Badge({ count }) {
  const style = { color: 'var(--badge-fg)' }
  const css = `color: var(--badge-fg);`
  let shown = count
  if (shown > 99) shown = '99+'
  return <span style={style} data-css={css} className="variant">{shown}</span>
}
