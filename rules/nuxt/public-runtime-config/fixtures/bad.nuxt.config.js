export default defineNuxtConfig({
  runtimeConfig: {
    apiToken: '',
    public: {
      apiBase: '/api',
      stripeSecretKey: '',
      mailer: process.env.MAIL_PASSWORD
    }
  }
})
