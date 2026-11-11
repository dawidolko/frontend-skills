<script setup>
const plural = new Intl.PluralRules('pl')
const label = (n) => ({ one: 'plik', few: 'pliki', many: 'plików', other: 'pliku' })[plural.select(n)]
const first = page === 1 ? 'first' : 'next'
</script>
<template>
  <p>{{ t('files', { count }) }}</p>
  <p>{{ count }} {{ label(count) }}</p>
</template>
