import { Page } from '@playwright/test';

// на automationexercise.com много рекламы (google vignette), она перекрывает кнопки
const AD_HOSTS = /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/;

export async function blockAds(page: Page) {
    await page.route(AD_HOSTS, (route) => route.abort());
}
