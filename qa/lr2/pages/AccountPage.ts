import { Page, Locator } from '@playwright/test';

export type User = {
    name: string;
    email: string;
    password: string;
};

// регистрация / вход / выход на automationexercise.com
export class AccountPage {
    readonly page: Page;
    readonly signupName: Locator;
    readonly signupEmail: Locator;
    readonly signupButton: Locator;
    readonly loginEmail: Locator;
    readonly loginPassword: Locator;
    readonly loginButton: Locator;
    readonly loggedInAs: Locator;
    readonly logoutLink: Locator;
    readonly loginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupName = page.locator('[data-qa="signup-name"]');
        this.signupEmail = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
        this.loginEmail = page.locator('[data-qa="login-email"]');
        this.loginPassword = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('[data-qa="login-button"]');
        this.loggedInAs = page.getByText('Logged in as');
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.loginLink = page.getByRole('link', { name: 'Signup / Login' });
    }

    static newUser(): User {
        const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
        return { name: `qa${id}`, email: `qa${id}@test.com`, password: 'Qwerty123!' };
    }

    async goto() {
        await this.page.goto('/login');
    }

    async register(user: User) {
        await this.goto();
        await this.signupName.fill(user.name);
        await this.signupEmail.fill(user.email);
        await this.signupButton.click();

        // форма с данными аккаунта
        await this.page.locator('#id_gender1').check();
        await this.page.locator('[data-qa="password"]').fill(user.password);
        await this.page.locator('[data-qa="days"]').selectOption('10');
        await this.page.locator('[data-qa="months"]').selectOption('5');
        await this.page.locator('[data-qa="years"]').selectOption('2000');
        await this.page.locator('[data-qa="first_name"]').fill('Ivan');
        await this.page.locator('[data-qa="last_name"]').fill('Ivanov');
        await this.page.locator('[data-qa="address"]').fill('Lenina 1');
        await this.page.locator('[data-qa="country"]').selectOption('Canada');
        await this.page.locator('[data-qa="state"]').fill('Ontario');
        await this.page.locator('[data-qa="city"]').fill('Toronto');
        await this.page.locator('[data-qa="zipcode"]').fill('10001');
        await this.page.locator('[data-qa="mobile_number"]').fill('+79990000000');
        await this.page.locator('[data-qa="create-account"]').click();
    }

    async continueAfterCreate() {
        await this.page.locator('[data-qa="continue-button"]').click();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async deleteAccount() {
        await this.page.goto('/delete_account');
    }
}
