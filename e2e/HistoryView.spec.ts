import {expect, test} from "./playwrightSetup";

test('if the history displays the creation of an item', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    await page.getByRole('button', { name: 'Datenbankeinstellungen' }).dblclick();
    await page.getByRole('button', { name: 'Änderungsverlauf' }).dblclick();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - heading "Änderungsverlauf" [level=1]
    `);
    await page.getByRole('img').nth(1).click();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis Hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Eintrag', exact: true }).click();
    await page.getByRole('textbox').nth(1).fill('1');
    await page.getByRole('button', { name: 'Speichern' }).click();
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    await page.getByRole('button', { name: 'Änderungsverlauf' }).click();
    await expect(page.getByText('Eintrag erstellt')).toBeVisible();
    await expect(page.getByRole('heading', { name: '1' })).toBeVisible();
});