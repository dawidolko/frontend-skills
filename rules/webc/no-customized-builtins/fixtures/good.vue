<template>
  <fancy-button>Save</fancy-button>
  <table>
    <tbody>
      <tr is="vue:order-row" v-for="order in orders" :key="order.id" :order="order"></tr>
    </tbody>
  </table>
  <component is="AsyncPanel" />
</template>

<script setup>
class FancyButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).innerHTML = '<button type="button"><slot></slot></button>'
  }
}
customElements.define('fancy-button', FancyButton)
defineProps({ orders: Array })
</script>
