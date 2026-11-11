import { test, expect } from '@playwright/test'

test('saves the profile', async ({ page }) => {
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(2000)
  await new Promise((r) => setTimeout(r, 500))
  expect(await page.getByText('Saved').isVisible()).toBe(true)
})
