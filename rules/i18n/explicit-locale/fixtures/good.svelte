<script>
  let { date, total, locale } = $props()
  const shown = new Date(date).toLocaleDateString(locale, { dateStyle: 'long' })
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(total)
</script>
<p>{shown} {money}</p>
