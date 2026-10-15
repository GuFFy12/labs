import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Dashboard', () => {
    test('should show user email after login', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('user@example.com', 'password123');

        await expect(page.getByRole('heading', { name: 'Личный кабинет' })).toBeVisible();
        await expect(page.locator('#user-email')).toHaveText('user@example.com');
    });

    test('should redirect to login without session', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/login/);
    });

    test('should logout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('user@example.com', 'password123');
        await page.getByRole('button', { name: 'Выйти' }).click();

        await expect(page).toHaveURL(/login/);
    });
});
