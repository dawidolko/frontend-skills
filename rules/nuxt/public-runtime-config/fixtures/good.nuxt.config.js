export default defineNuxtConfig({
  runtimeConfig: {
    stripeSecretKey: '',
    // public: { secretKey: '' } in a comment is not config
    public: {
      apiBase: '/api',
      stripePublishableKey: '',
      mapsApiKey: '',
      turnstile: { siteKey: '' }
    }
  }
})
