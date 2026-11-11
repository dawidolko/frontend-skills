<template>
  <header class="toolbar">
    <Icon name="search" />
    <button type="button" aria-label="Close">
      <img src="/icons/close.svg" alt="" width="16" height="16" />
    </button>
    <img src="@/assets/icons/menu.svg" alt="Menu" width="16" height="16" />
    <svg aria-hidden="true"><use href="/assets/sprite.svg#icon-cart"></use></svg>
  </header>
</template>

<script setup>
import Icon from '@/components/Icon.vue'
</script>
