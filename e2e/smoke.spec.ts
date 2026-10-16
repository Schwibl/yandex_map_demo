import { expect, test } from '@playwright/test';

// Page responds and the document title is the demo title.
test('app loads', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Yandex map clusters demo/);
});

// Header, view toggles, and catalogue sidebar are on the page.
test('main UI renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Warehouse map demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Map' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'List' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
});

// No API key is baked into the build, so the map area states that instead of throwing.
test('shows map API key not configured without a key', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Map API key not configured')).toBeVisible();
});
