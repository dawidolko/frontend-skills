export async function submit(form, save, report, showError) {
  try {
    await save(form)
  } catch (err) {
    showError('Could not save. Try again.')
    report(err)
  }
  try {
    localStorage.setItem('seen', '1')
  } catch {
    // storage may be disabled; the banner just shows again
  }
  return save(form).catch((err) => {
    /* reported by the global handler */
  })
}
