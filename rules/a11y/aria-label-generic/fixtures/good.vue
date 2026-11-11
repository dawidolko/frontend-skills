<template>
  <section aria-label="Product filters">
    <button type="button" aria-label="Close"><i class="icon icon-close" aria-hidden="true"></i></button>
    <span role="img" :aria-label="statusText" class="dot"></span>
    <div role="region" aria-labelledby="filters-title"></div>
    <div v-bind="attrs" aria-label="Maybe a region"></div>
  </section>
</template>
