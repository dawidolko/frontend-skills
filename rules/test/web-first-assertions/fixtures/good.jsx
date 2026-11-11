import { test, expect } from '@playwright/test'

test('shows the cart count', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Cart' })).toHaveText('Cart (2)')
  const rows = await page.getByRole('row').all()
  expect(rows.length).toBeGreaterThan(0)
})
