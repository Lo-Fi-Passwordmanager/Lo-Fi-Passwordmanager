import {expect, test} from "./playwrightSetup";

test('if the history displays the creation of an item', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button').first().click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Änderungsverlauf" [level=1]
    `);
    await page.getByRole('img').nth(2).click();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis' }).click();
    await page.getByRole('button', { name: 'Eintrag', exact: true }).click();
    await page.getByRole('textbox').nth(1).fill('Neu');
    await page.getByRole('button', { name: 'Speichern' }).click();
    await page.getByRole('button').first().click();
    await expect(page.getByText('Eintrag erstellt')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Neu' })).toBeVisible();
});