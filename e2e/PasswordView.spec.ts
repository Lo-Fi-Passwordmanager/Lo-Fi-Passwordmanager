import {expect, test} from "@playwright/test";

test('Creating a new Entry', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img "Passwortmanager Logo"
    - heading "LoFi Passwortmanager" [level=2]
    - button "Einstellungen öffnen"
    - button "⬅"
    - textbox "Suchen..."
    - button "Eintrag ins Startverzeichnis hinzufügen"
    - combobox:
      - option "Alphabetisch" [selected]
      - option "Erstellungsdatum"
      - option "Bearbeitungsdatum"
    - button "🡅"
    - button:
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - status
    - text: Bitte Eintrag auswählen
    - img "Logo"
    `);
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Eintrag', exact: true }).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - textbox: Neuer Eintrag
    - text: "Benutzername:"
    - textbox
    - text: "Passwort:"
    - textbox
    - button
    - button
    - text: "URL:"
    - textbox
    - text: "Notiz:"
    - textbox
    - button "Speichern"
    - button "Abbrechen"
    `);
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('Uni');
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill('Name');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('Passwort');
    await page.getByRole('textbox').nth(4).click();
    await page.getByRole('textbox').nth(4).fill('Url');
    await page.getByRole('textbox').nth(5).click();
    await page.getByRole('textbox').nth(5).fill('Note');
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - textbox: Uni
    - text: "Benutzername:"
    - textbox: Name
    - text: "Passwort:"
    - textbox: Passwort
    - button
    - button
    - text: "URL:"
    - textbox: Url
    - text: "Notiz:"
    - textbox: Note
    - button "Speichern"
    - button "Abbrechen"
    `);
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - text: "Uni Benutzername: Name"
    - button
    - text: "Passwort: ●●●●●●●●"
    - button
    - button
    - text: "URL:"
    - link "Url":
      - /url: https://Url
    - button
    - text: "Notiz: Note"
    - button "Bearbeiten"
    - button "Löschen"
    `);
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - button:
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - button "Uni":
      - text: ""
      - button "Eintrag löschen"
    - status
    `);
});