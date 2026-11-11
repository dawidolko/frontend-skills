import { test, expect } from '@playwright/test'

test('shows the cart count', async ({ page }) => {
  await page.goto('/')
  expect(await page.getByRole('status').isVisible()).toBe(true)
  expect(await page.getByTestId('cart-count').textContent()).toBe('2')
})
