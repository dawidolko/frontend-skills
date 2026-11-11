export function useSettings(page) {
  const settings = JSON.parse(localStorage.getItem('settings') || '{}')
  // eval(...) was removed
  setTimeout(() => refresh(), 1000)
  const result = await page.evaluate(() => document.title)
  return sandbox.eval(settings.expression)
}
