import { test, expect } from '@playwright/test';

test('to open the app correctly', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveTitle(/Local-First Passwortmanager/);
    await expect(page.getByRole('img', { name: 'Passwortmanager Logo' })).toBeVisible();
});

test('click the + button and check that every menu is correct', async ({ page }) => {
    await page.goto('');

    await page.getByRole('main').getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'Neue Datenbank erstellen' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Datenbankname' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Masterpasswort' })).toBeVisible();

    await page.getByRole('button', { name: 'Existierende Datenbank laden' }).click();
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Automerge Url' })).toBeVisible();

    await page.getByRole('button', { name: 'Datenbank importieren' }).click();
    await expect(page.getByRole('textbox', { name: 'Datenbankname' })).toBeVisible();
    await expect(page.locator('label').nth(2)).toBeVisible();

    await page.locator('button:has-text("Neue Datenbank erstellen")').click();
    await expect(page.getByRole('textbox', { name: 'Datenbankname' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Masterpasswort' })).toBeVisible();

    await page.getByRole('button', { name: 'Abbrechen' }).click();
});