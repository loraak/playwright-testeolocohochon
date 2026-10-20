import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.beforeEach(async ({ page }) => {
    await login(page);
});

    test('ordenar por precio de mayor a menor', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('hilo');
    const textos = await page.getByTestId('inventory-item-price').allInnerTexts();
    const precios = textos.map((t) => parseFloat(t.replace('$', '')));
    expect(precios).toEqual([...precios].sort((a, b) => b - a));
});

test('ordenar por nombre de A a Z', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('az');
    const nombres = await page.getByTestId('inventory-item-name').allInnerTexts();
    expect(nombres).toEqual([...nombres].sort());
});

test('el detalle de un producto muestra su información', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack').click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(page.getByTestId('inventory-item-price')).toHaveText('$29.99');

    await page.getByTestId('back-to-products').click();
    await expect(page).toHaveURL(/inventory\.html/);
});

test('el carrito conserva los productos al recargar', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.reload();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});