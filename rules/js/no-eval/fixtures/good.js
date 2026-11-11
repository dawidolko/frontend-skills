// eval('x') in a comment is not code
export function schedule(refresh, page) {
  setTimeout(refresh, 1000)
  const label = 'do not eval(this)'
  return page.evaluate(() => document.title) && page.eval && label
}
