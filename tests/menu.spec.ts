import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.beforeEach(async ({ page }) => {
    await login(page);
});

test('Reset App State vacía el carrito', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.locator('#react-burger-menu-btn').click();
    await page.getByTestId('reset-sidebar-link').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});

test('All Items lleva al inventario desde el carrito', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await page.locator('#react-burger-menu-btn').click();
    await page.getByTestId('inventory-sidebar-link').click();
    await expect(page).toHaveURL(/inventory\.html/);
});