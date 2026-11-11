<template>
  <button type="button" @click="close">{{ t('close') }}</button>
  <a href="/help"><slot /></a>
  <button type="button" title="Delete"><TrashIcon /></button>
  <button type="button" v-text="label"></button>
  <button type="button"><sl-icon name="x"></sl-icon></button>
</template>
