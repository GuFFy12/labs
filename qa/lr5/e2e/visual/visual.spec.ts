import { test, expect } from '@playwright/test';

// Задание 2: визуальная регрессия через скриншоты Playwright
// эталоны снимаются в docker-образе playwright (linux), чтобы совпадать с CI:
// npm run test:visual:update
test.describe('Visual regression', () => {
    test('home page', async ({ page }) => {
        await page.goto('/');
        // ждём промо-баннер, он появляется через 1.2с
        await expect(page.locator('.promo')).toBeVisible();
        await expect(page).toHaveScreenshot('home.png', { fullPage: true });
    });

    test('login page', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveScreenshot('login.png');
    });

    test('login error state', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('wrong@example.com');
        await page.getByLabel('Password').fill('wrongpass');
        await page.getByRole('button', { name: 'Войти' }).click();
        await expect(page.getByRole('alert')).toBeVisible();
        await expect(page.locator('form')).toHaveScreenshot('login-error-form.png');
    });
});
