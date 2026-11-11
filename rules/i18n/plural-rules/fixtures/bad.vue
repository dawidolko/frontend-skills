<template>
  <p>{{ count }} {{ count === 1 ? 'file' : 'files' }}</p>
  <p>{{ items.length > 1 ? t('photos') : t('photo') }}</p>
</template>
