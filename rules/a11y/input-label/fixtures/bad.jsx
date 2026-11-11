export function Signup() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <label htmlFor="pw">Password</label>
      <input id="password" type="password" />
      <select name="plan"><option>Basic</option></select>
    </form>
  )
}
