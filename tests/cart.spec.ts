import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.beforeEach(async ({ page }) => {
    await login(page);
});

test('quitar un producto desde el carrito', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();

    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
});

test('continuar comprando regresa al inventario', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/inventory\.html/);
});

test('el carrito vacío no tiene productos ni contador', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});