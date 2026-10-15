import { Page, Locator } from '@playwright/test';

// оформление заказа: /checkout -> /payment -> /payment_done
export class CheckoutPage {
    readonly page: Page;
    readonly placeOrderLink: Locator;
    readonly orderPlaced: Locator;

    constructor(page: Page) {
        this.page = page;
        this.placeOrderLink = page.getByRole('link', { name: 'Place Order' });
        this.orderPlaced = page.locator('[data-qa="order-placed"]');
    }

    async placeOrder() {
        await this.placeOrderLink.click();
    }

    async pay() {
        await this.page.locator('[data-qa="name-on-card"]').fill('IVAN IVANOV');
        await this.page.locator('[data-qa="card-number"]').fill('4111111111111111');
        await this.page.locator('[data-qa="cvc"]').fill('123');
        await this.page.locator('[data-qa="expiry-month"]').fill('12');
        await this.page.locator('[data-qa="expiry-year"]').fill('2030');
        await this.page.locator('[data-qa="pay-button"]').click();
    }
}
