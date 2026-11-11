<script>
  let { save } = $props()
  function submit(event) {
    event.preventDefault()
    save(new FormData(event.currentTarget))
  }
</script>

<form onsubmit={submit}>
  <label>Title <input name="title" required /></label>
  <button>Save</button>
</form>
