import { Page, expect } from '@playwright/test';

export async function login(page: Page, user = 'standard_user') {
    await page.goto('/');
    await page.getByTestId('username').fill(user);
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
}