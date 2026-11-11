<script>
  let { items, first, last } = $props()
  let visible = $state([])
  let fullName = $state('')
  $effect(() => {
    visible = items.filter((item) => !item.hidden)
  })
  $effect(() => (fullName = `${first} ${last}`))
</script>

<p>{fullName}: {visible.length}</p>
