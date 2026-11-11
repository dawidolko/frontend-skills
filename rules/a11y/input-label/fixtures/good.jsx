export function Signup({ field }) {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="email" />
      <label>
        Password <input type="password" />
      </label>
      <input type="search" aria-label="Search the docs" />
      <input type="hidden" name="csrf" value="x" />
      <input {...field} />
      <button type="submit">Sign up</button>
    </form>
  )
}
