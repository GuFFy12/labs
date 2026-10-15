import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { blockAds } from '../utils/blockAds';

test.describe('automationexercise.com', () => {
    test.beforeEach(async ({ page }) => {
        await blockAds(page);
    });

    test('регистрация нового пользователя', async ({ page }) => {
        const account = new AccountPage(page);
        const user = AccountPage.newUser();

        await account.register(user);
        await expect(page.locator('[data-qa="account-created"]')).toHaveText('Account Created!');

        await account.continueAfterCreate();
        await expect(account.loggedInAs).toContainText(user.name);

        // подчищаем за собой
        await account.deleteAccount();
        await expect(page.locator('[data-qa="account-deleted"]')).toBeVisible();
    });

    test('поиск товара', async ({ page }) => {
        const products = new ProductsPage(page);
        await products.goto();
        await products.search('Jeans');

        await expect(products.title).toHaveText('Searched Products');
        await expect(products.productNames.first()).toBeVisible();

        const names = await products.productNames.allTextContents();
        expect(names.length).toBeGreaterThan(0);
        for (const name of names) {
            expect(name.toLowerCase()).toContain('jeans');
        }
    });

    test('добавление товаров в корзину', async ({ page }) => {
        const products = new ProductsPage(page);
        const cart = new CartPage(page);

        await products.goto();
        await products.addToCart(1);
        await products.continueShopping();
        await products.addToCart(2);
        await products.openCart();

        await expect(page).toHaveURL(/view_cart/);
        await expect(cart.rows).toHaveCount(2);
        await expect(cart.productNames).toHaveText(['Blue Top', 'Men Tshirt']);
    });

    test('оформление заказа', async ({ page }) => {
        const account = new AccountPage(page);
        const products = new ProductsPage(page);
        const cart = new CartPage(page);
        const checkout = new CheckoutPage(page);
        const user = AccountPage.newUser();

        await account.register(user);
        await account.continueAfterCreate();

        await products.goto();
        await products.addToCart(1);
        await products.openCart();
        await cart.proceedToCheckout();

        await expect(page).toHaveURL(/checkout/);
        await checkout.placeOrder();
        await checkout.pay();

        await expect(checkout.orderPlaced).toHaveText('Order Placed!');

        await account.deleteAccount();
    });

    test('выход из аккаунта', async ({ page }) => {
        const account = new AccountPage(page);
        const user = AccountPage.newUser();

        await account.register(user);
        await account.continueAfterCreate();
        await expect(account.loggedInAs).toBeVisible();

        await account.logout();

        await expect(page).toHaveURL(/login/);
        await expect(account.loginLink).toBeVisible();
        await expect(account.loggedInAs).toBeHidden();

        // логинимся обратно, чтобы удалить тестовый аккаунт
        await account.loginEmail.fill(user.email);
        await account.loginPassword.fill(user.password);
        await account.loginButton.click();
        await account.deleteAccount();
    });
});
