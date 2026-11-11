<template>
  <nav>
    <button type="button" @click="router.push('/pricing')">See pricing</button>
    <button type="button" @click="navigateTo({ name: 'account' })">Account</button>
  </nav>
</template>

<script setup>
const router = useRouter()
</script>
