import { test, expect } from '@playwright/test'

// test.only('debug', …) is fine in a comment
test('adds an item', async ({ page }) => {
  await page.goto('/cart')
  await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible()
})
const onlyOnce = { only: true }
