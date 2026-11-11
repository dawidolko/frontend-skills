export function Contact({ fieldType, ...rest }) {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" />
      <label htmlFor="phone">Phone</label>
      <input id="phone" name="phone" type="tel" autoComplete="tel" />
      <label htmlFor="site">Website</label>
      <input id="site" name="website" type="url" />
      <label htmlFor="any">Other</label>
      <input id="any" name="email" type={fieldType} />
      <input name="email" {...rest} />
      <label htmlFor="nick">Nickname</label>
      <input id="nick" name="nickname" />
    </form>
  )
}
