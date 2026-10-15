import { Page, Locator } from '@playwright/test';

// Page Object для каталога товаров (/products)
export class ProductsPage {
    readonly page: Page;
    readonly title: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly cartModal: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('h2.title');
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.productCards = page.locator('.productinfo');
        this.productNames = page.locator('.productinfo p');
        this.cartModal = page.locator('#cartModal');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartLink = this.cartModal.getByRole('link', { name: 'View Cart' });
    }

    async goto() {
        await this.page.goto('/products');
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }

    async addToCart(productId: number) {
        await this.page.locator(`.productinfo a[data-product-id="${productId}"]`).click();
        await this.cartModal.waitFor({ state: 'visible' });
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
        await this.cartModal.waitFor({ state: 'hidden' });
    }

    async openCart() {
        await this.viewCartLink.click();
    }
}
