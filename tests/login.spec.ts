import { test, expect } from '@playwright/test';

const usuariosValidos = [
    'standard_user',
    'problem_user',
    'performance_glitch_user',
    'error_user',
    'visual_user',
];

for (const user of usuariosValidos) {
    test(`login permitido para ${user}`, async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('username').fill(user);
        await page.getByTestId('password').fill('secret_sauce');
        await page.getByTestId('login-button').click();
        await expect(page).toHaveURL(/inventory\.html/);
    });
}

test('contraseña vacía exige password', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Password is required');
});

test('el error se puede cerrar', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-button').click();
    await page.getByTestId('error-button').click();
    await expect(page.getByTestId('error')).toBeHidden();
});