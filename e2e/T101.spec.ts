import { test, expect} from "@playwright/test";
import {waitFor} from "@testing-library/react";

test('T101', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByRole('img', { name: 'Passwortmanager Logo' })).toBeVisible();

    await page.getByRole('main').getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'Neue Datenbank erstellen' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Datenbankname' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Datenbankname');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('Masterpasswort');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await expect(page.getByRole('heading', { name: 'LoFi Passwortmanager' })).toBeVisible();

    await page.getByRole('button', { name: '⬅' }).click();
    await expect(page.getByRole('button', { name: 'Datenbankname' })).toBeVisible();

    await page.getByRole('button').nth(4).click();
    await expect(page.getByRole('heading', { name: 'Datenbank umbenennen:' })).toBeVisible();

    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('NeuerName');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'NeuerName' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('Masterpasswort');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await expect(page.getByRole('heading', { name: 'LoFi Passwortmanager' })).toBeVisible();

    await page.getByRole('button').first().click();
    await expect(page.locator('h1')).toBeVisible();

    await page.getByRole('button', { name: 'Datenbankeinstellungen' }).dblclick();
    await expect(page.getByRole('heading', { name: 'Datenbankeinstellungen' })).toBeVisible();

    await page.getByRole('button', { name: 'URL kopieren' }).click();
    const download1Promise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Verschlüsselt Exportieren' }).dblclick();
    const download1 = await download1Promise;
    await page.getByRole('img').nth(2).click();
    await page.getByRole('button', { name: '⬅' }).click();
    await expect(page.getByRole('button', { name: 'Copy URL' })).toBeVisible();

    await page.getByRole('button').nth(5).click();
    await expect(page.getByRole('heading', { name: 'Löschen bestätigen' })).toBeVisible();

    await page.getByRole('button', { name: 'Löschen' }).dblclick();
    await page.getByRole('main').getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'Neue Datenbank erstellen' })).toBeVisible();

    await page.getByRole('button', { name: 'Existierende Datenbank laden' }).click();
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Automerge Url' }).click();
    await page.getByRole('textbox', { name: 'Automerge Url' }).fill('BykRCDMtsdF2twjS38WMfwvDQeZ');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Name');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('Masterpasswort');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();

    await expect(page.getByRole('textbox', {name: 'Suchen...'})).toBeVisible();
    await expect(page.getByRole('button', { name: '⬅' })).toBeVisible();
});