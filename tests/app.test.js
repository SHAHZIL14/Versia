import { test, expect } from '@playwright/test';

test('auth page login works correctly', async ({ page }) => {
  await page.goto('https://versia.vercel.app/auth');

  // Optional: wait for animations or transitions
  await page.waitForTimeout(3000);

  // 🧪 Use placeholder-based selector (if applicable)
  await page.getByPlaceholder('Email').fill('demo@example.com');
  await page.getByPlaceholder('Password').fill('123456');

  // 🧪 Click login button (update text if needed)
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }),
    page.getByRole('button', { name: /login/i }).click(),
  ]);

  // ✅ Confirm navigation to a post-login route
  await expect(page).toHaveURL(/dashboard|feed|home/i);
});
