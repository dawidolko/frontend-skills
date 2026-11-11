<template>
  <div class="card"><slot /></div>
</template>

<style lang="scss" scoped>
// @import 'old-tokens'; is a comment
@use 'tokens';
@import url('https://fonts.example.com/inter.css');
@import 'print.css';
@import 'landscape' screen and (orientation: landscape);

.card {
  padding: tokens.$space-4;
}
</style>
