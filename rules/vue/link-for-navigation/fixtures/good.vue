<template>
  <nav>
    <RouterLink to="/pricing" class="button">See pricing</RouterLink>
    <NuxtLink :to="{ name: 'account' }">Account</NuxtLink>
    <button type="button" @click="save().then(() => router.push('/done'))">Save</button>
    <button type="button" @click="goBack">Back</button>
    <BaseButton @click="router.push('/help')">Help</BaseButton>
  </nav>
</template>

<script setup>
const router = useRouter()
const save = async () => {}
const goBack = () => router.back()
</script>
