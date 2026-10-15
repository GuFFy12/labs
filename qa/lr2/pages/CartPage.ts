import { Page, Locator } from '@playwright/test';

// Page Object для корзины (/view_cart)
export class CartPage {
    readonly page: Page;
    readonly rows: Locator;
    readonly productNames: Locator;
    readonly emptyCartMessage: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rows = page.locator('#cart_info_table tbody tr');
        this.productNames = page.locator('#cart_info_table .cart_description h4 a');
        this.emptyCartMessage = page.locator('#empty_cart');
        this.checkoutButton = page.getByText('Proceed To Checkout');
    }

    async goto() {
        await this.page.goto('/view_cart');
    }

    async removeProduct(productId: number) {
        await this.page.locator(`.cart_quantity_delete[data-product-id="${productId}"]`).click();
    }

    async proceedToCheckout() {
        // обработчик на кнопку вешается jQuery после загрузки скриптов, в firefox кликали раньше
        await this.page.waitForLoadState('load');
        await this.checkoutButton.click();
    }
}
