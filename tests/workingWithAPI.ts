import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('https://conduit.bondaracademy.com/')
})
test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
