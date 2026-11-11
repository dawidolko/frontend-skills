<script>
  let { size = 'small', price, locale: lang } = $props()
  const label = size === 'small' ? 'S' : 'L'
  const formatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' })
</script>

<span>{label} {formatter.format(price)}</span>
