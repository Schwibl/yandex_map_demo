import { expect, test } from '@playwright/test';

// PNG IHDR width/height sit at bytes 16 and 20.
function pngSize(body: Buffer): { width: number; height: number } {
  return { width: body.readUInt32BE(16), height: body.readUInt32BE(20) };
}

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
  await expect(page.getByRole('button', { name: 'Map', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'List', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
});

// No API key is baked into the build, so the map pane shows a user-facing card.
test('shows a placeholder card when the map key is missing', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Map is unavailable right now')).toBeVisible();
  await expect(page.getByText('The list still works')).toBeVisible();
  await expect(page.getByText('Set VITE_YANDEX_MAPS_API_KEY')).toHaveCount(0);

  await page.getByRole('button', { name: 'Show list' }).click();
  await expect(page.locator('.catalogue-page')).toHaveClass(/catalogue-page--list-view/);
  await expect(page.locator('.map')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
});

// Shared head tags and the 1200×630 preview image.
test('head advertises icon, description, and social preview', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Yandex map clusters demo/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\.png$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /yandex-map-demo\.vercel\.app/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0f1218');
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');

  const icon = await page.request.get('/favicon.svg');
  expect(icon.ok()).toBeTruthy();
  const image = await page.request.get('/og.png');
  expect(image.ok()).toBeTruthy();
  expect(pngSize(await image.body())).toEqual({ width: 1200, height: 630 });
});

// Chips use labels, the count updates, and a selected row is painted.
test('filters capitalise districts and mark the selected row', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'North', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'north', exact: true })).toHaveCount(0);
  await expect(page.getByText('12 warehouses')).toBeVisible();

  const row = page.locator('.map-sidebar__item').first();
  const pad = await row.evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
  expect(pad).toBeGreaterThanOrEqual(8);
  expect(pad).toBeLessThanOrEqual(12);

  const mapToggle = page.getByRole('button', { name: 'Map', exact: true });
  const toggleBox = await mapToggle.evaluate((el) => el.getBoundingClientRect());
  expect(toggleBox.height).toBeGreaterThanOrEqual(36);
  expect(toggleBox.width).toBeGreaterThanOrEqual(36);

  const allChip = page.getByRole('button', { name: 'All', exact: true });
  const chipBox = await allChip.evaluate((el) => el.getBoundingClientRect());
  expect(chipBox.height).toBeGreaterThanOrEqual(36);
  expect(chipBox.width).toBeGreaterThanOrEqual(36);

  await page.getByRole('button', { name: 'North', exact: true }).click();
  await expect(page.getByText('4 warehouses')).toBeVisible();

  const item = page.getByRole('button', { name: /North warehouse/ });
  await item.click();
  await expect(item).toHaveAttribute('aria-pressed', 'true');
  const background = await item.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).not.toBe('rgba(0, 0, 0, 0)');
});

// At phone width with no key, Map and List each reveal a single pane.
test('phone shows one pane and starts on the list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
  await expect(page.locator('.map')).toBeHidden();

  const listToggle = page.getByRole('button', { name: 'List', exact: true });
  const toggleBox = await listToggle.evaluate((el) => el.getBoundingClientRect());
  expect(toggleBox.height).toBeGreaterThanOrEqual(44);
  expect(toggleBox.width).toBeGreaterThanOrEqual(44);

  const allChip = page.getByRole('button', { name: 'All', exact: true });
  const chipBox = await allChip.evaluate((el) => el.getBoundingClientRect());
  expect(chipBox.height).toBeGreaterThanOrEqual(44);
  expect(chipBox.width).toBeGreaterThanOrEqual(44);

  await page.getByRole('button', { name: 'Map', exact: true }).click();
  await expect(page.getByText('Map is unavailable right now')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeHidden();

  await page.getByRole('button', { name: 'Show list' }).click();
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
  await expect(page.locator('.map')).toBeHidden();
});
