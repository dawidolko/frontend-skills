<script>
  let { date, total } = $props()
  const shown = new Date(date).toLocaleDateString()
  const money = new Intl.NumberFormat().format(total)
</script>
<p>{shown} {money}</p>
