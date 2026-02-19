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

test("that the user is able to click through the pages of the settings menu", async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    await expect(page.getByRole('heading', { name: 'Allgemeine Einstellungen' })).toBeVisible();
    await page.getByRole('button', { name: 'Datenbankeinstellungen' }).click();
    await expect(page.getByRole('heading', { name: 'Datenbankeinstellungen' })).toBeVisible();
    await expect(page.getByText('Bitte Datenbank auswählen.')).toBeVisible();
    await page.getByRole('button', { name: 'Über die App' }).dblclick();
    await expect(page.getByRole('heading', { name: 'Über diese Anwendung' })).toBeVisible();
    await expect(page.getByText('Lizenz: MIT License')).toBeVisible();
    await page.locator('.dialog.settings-layout > .closeIcon').click();
});

test("should check that all settings toggle buttons work correctly", async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    //Dark Mode
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Dark-Mode" [checked]
    - text: Dark-Mode
    `);
    await page.locator('label').filter({ hasText: 'Dark-Mode' }).locator('span').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Dark-Mode"
    - text: Dark-Mode
    `);
    await page.locator('label').filter({ hasText: 'Dark-Mode' }).locator('span').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Dark-Mode" [checked]
    - text: Dark-Mode
    `);
    //Sync
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Synchronisation" [checked]
    - text: Synchronisation
    `);
    await page.locator('span').nth(1).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Synchronisation"
    - text: Synchronisation
    `);
    await page.locator('span').nth(1).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Synchronisation" [checked]
    - text: Synchronisation
    `);
    //p2p
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Peer-to-Peer Synchronisation" [checked]
    - text: Peer-to-Peer Synchronisation
    `);
    await page.locator('label').filter({ hasText: 'Peer-to-Peer Synchronisation' }).locator('span').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Peer-to-Peer Synchronisation"
    - text: Peer-to-Peer Synchronisation
    `);
    await page.locator('label').filter({ hasText: 'Peer-to-Peer Synchronisation' }).locator('span').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Peer-to-Peer Synchronisation" [checked]
    - text: Peer-to-Peer Synchronisation
    `);
    //auto Logout
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Bei Inaktivität abmelden" [checked]
    `);
    await page.locator('label').filter({ hasText: 'Bei Inaktivität abmelden' }).locator('span').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Bei Inaktivität abmelden"
    `);
    await page.locator('label').filter({ hasText: 'Bei Inaktivität abmelden' }).locator('span').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - checkbox "Bei Inaktivität abmelden" [checked]
    `);
});

test("auto logout input field", async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', {name: 'Einstellungen öffnen'}).click();
    await expect(page.getByRole('spinbutton')).toHaveValue('10');
    await page.getByRole('button').nth(4).click();
    await page.getByRole('button').nth(4).click();
    await expect(page.getByRole('spinbutton')).toHaveValue('12');
    await page.getByRole('button').nth(3).click();
    await expect(page.getByRole('spinbutton')).toHaveValue('11');
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('100');
    await page.getByRole('spinbutton').press('Enter');
    await expect(page.getByRole('spinbutton')).toHaveValue('100');
});
test("add server field", async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', {name: 'Einstellungen öffnen'}).click();

    await page.getByRole('button').nth(5).click();
    await page.getByRole('textbox', { name: 'Server Name: Server URL:' }).fill('Name');
    await page.getByRole('textbox', { name: 'wss://my-server.org' }).click();
    await page.getByRole('textbox', { name: 'wss://my-server.org' }).fill('wss://mein-server.org');
    await page.getByRole('button', { name: 'Hinzufügen' }).click();
    await expect(page.getByText('Verfügbare Server:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(2)).toBeVisible();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
});