import { test, expect, Page } from '@playwright/test';
import { login } from './helpers';

test.beforeEach(async ({ page }) => {
    await login(page);
});

async function irAlFormulario(page: Page) {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
}

test('falta el apellido', async ({ page }) => {
    await irAlFormulario(page);
    await page.getByTestId('firstName').fill('Ana');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('Last Name is required');
});

test('falta el código postal', async ({ page }) => {
    await irAlFormulario(page);
    await page.getByTestId('firstName').fill('Ana');
    await page.getByTestId('lastName').fill('García');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('Postal Code is required');
});

test('cancelar el checkout regresa al carrito', async ({ page }) => {
    await irAlFormulario(page);
    await page.getByTestId('cancel').click();
    await expect(page).toHaveURL(/cart\.html/);
});

test('el total es subtotal más impuesto', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Ana');
    await page.getByTestId('lastName').fill('García');
    await page.getByTestId('postalCode').fill('38000');
    await page.getByTestId('continue').click();

    const numero = async (id: string) =>
    parseFloat((await page.getByTestId(id).innerText()).replace(/[^0-9.]/g, ''));

    const subtotal = await numero('subtotal-label');
    const impuesto = await numero('tax-label');
    const total = await numero('total-label');

    expect(subtotal).toBeCloseTo(29.99 + 9.99, 2);
    expect(total).toBeCloseTo(subtotal + impuesto, 2);
});

test('al terminar la compra se puede volver al inventario', async ({ page }) => {
    await irAlFormulario(page);
    await page.getByTestId('firstName').fill('Ana');
    await page.getByTestId('lastName').fill('García');
    await page.getByTestId('postalCode').fill('38000');
    await page.getByTestId('continue').click();
    await page.getByTestId('finish').click();
    await page.getByTestId('back-to-products').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});