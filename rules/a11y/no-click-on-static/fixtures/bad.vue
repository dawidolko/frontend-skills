<template>
  <ul>
    <li v-for="item in items" :key="item.id" @click="open(item)">{{ item.name }}</li>
  </ul>
</template>
