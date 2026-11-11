import { test, expect } from '@playwright/test'

test('saves the profile', async ({ page }) => {
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('status')).toHaveText('Saved')
  cy.wait('@saveProfile')
})
