<template>
  <label for="country">Country</label>
  <select id="country" name="country" required>
    <option value="">Choose a country</option>
    <option value="pl">Poland</option>
  </select>
  <label for="size">Size</label>
  <select id="size" name="size" required>
    <option value="" disabled selected hidden>Choose a size</option>
    <option>Small</option>
  </select>
  <label for="tags">Tags</label>
  <select id="tags" name="tags" required multiple>
    <option value="a">A</option>
  </select>
  <label for="plan">Plan</label>
  <select id="plan" name="plan">
    <option value="free">Free</option>
  </select>
  <label for="dyn">Item</label>
  <select id="dyn" required>
    <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
  </select>
</template>
