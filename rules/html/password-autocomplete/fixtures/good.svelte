<script>
  let { mode = 'login', ...rest } = $props()
</script>

<form method="post">
  <label for="user">Email</label>
  <input id="user" name="email" type="email" autocomplete="username">
  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" autocomplete="current-password">
  <label for="new-pw">New password</label>
  <input id="new-pw" name="new-password" type="password" autocomplete="new-password">
  <label for="pw2">Password</label>
  <input id="pw2" type="password" autocomplete={mode === 'login' ? 'current-password' : 'new-password'}>
  <input type="password" {...rest}>
</form>
