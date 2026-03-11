import {expect, test} from "./playwrightSetup";

test('Creating a new Entry', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', {name: 'Neue Datenbank erstellen'}).click();
    await page.getByRole('textbox', {name: 'Datenbankname'}).fill('Name');
    await page.getByRole('textbox', {name: 'Masterpasswort'}).click();
    await page.getByRole('textbox', {name: 'Masterpasswort'}).fill('PW');
    await page.getByRole('button', {name: 'Bestätigen'}).click();
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
    await page.getByRole('button', {name: 'Eintrag ins Startverzeichnis hinzufügen', exact: true}).click();
    await page.getByRole('button', {name: 'Eintrag', exact: true}).click();
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
    await page.getByRole('button', {name: 'Speichern'}).click();
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
})

test('creating a new folder', async ({ page })=> {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).click();
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
    - button "Name":
      - text: ""
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - status
    - text: Bitte Eintrag auswählen
    - img "Logo"
    `);
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Ordner' }).click();
    await page.getByRole('button', { name: '▷ Neuer Ordner ⋮' }).getByRole('textbox').fill('Folder');
    await page.locator('div').filter({ hasText: 'Bitte Eintrag auswählen' }).nth(4).dblclick();
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
    - button "Name":
      - text: ""
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - button "▷ Folder ⋮":
      - button "▷"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - status
    - text: Bitte Eintrag auswählen
    - img "Logo"
    `);
});

test('swap ascending/descending', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis Hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Ordner' }).click();
    await page.getByRole('button', { name: '▷ Neuer Ordner ⋮' }).getByRole('textbox').fill('A');
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Ordner', exact: true }).click();
    await page.getByRole('button', { name: '▷ Neuer Ordner ⋮' }).getByRole('textbox').fill('B');
    await page.getByText('Bitte Eintrag auswählen').click();
    await expect(page.locator('body')).toMatchAriaSnapshot(`
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
    - button "Name":
      - text: ""
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - button "▷ A ⋮":
      - button "▷"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - button "▷ B ⋮":
      - button "▷"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - status
    - text: Bitte Eintrag auswählen
    - img "Logo"
    `);
    await page.getByRole('button', { name: '🡅' }).click();
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
    - button "🡇"
    - button "Name":
      - text: ""
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - button "▷ B ⋮":
      - button "▷"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - button "▷ A ⋮":
      - button "▷"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - status
    - text: Bitte Eintrag auswählen
    - img "Logo"
    `);
});

test('passwort Generator', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Eintrag', exact: true }).click();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Passwortgenerator" [level=1]
    - text: "Passwort-Länge:"
    - spinbutton: /\\d+/
    - text: "Großbuchstaben:"
    - checkbox [checked]
    - text: "Kleinbuchstaben:"
    - checkbox [checked]
    - text: "Zahlen:"
    - checkbox [checked]
    - text: "Sonderzeichen:"
    - checkbox [checked]
    - button "Bestätigen"
    - button "Abbrechen"
    `);
    await page.getByRole('spinbutton').click();
    await page.getByRole('spinbutton').fill('30');
    await page.getByRole('checkbox').nth(2).uncheck();
    await page.getByRole('checkbox').nth(3).uncheck();
    await page.getByRole('checkbox').nth(3).dblclick();
    await page.getByRole('checkbox').nth(1).uncheck();
    await page.getByRole('checkbox').first().uncheck();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Passwortgenerator" [level=1]
    - text: "Passwort-Länge:"
    - spinbutton: /\\d+/
    - text: "Großbuchstaben:"
    - checkbox
    - text: "Kleinbuchstaben:"
    - checkbox
    - text: "Zahlen:"
    - checkbox
    - text: "Sonderzeichen:"
    - checkbox
    - button "Bestätigen"
    - button "Abbrechen"
    `);
    await page.getByRole('checkbox').first().check();
    await page.getByRole('checkbox').nth(1).check();
    await page.getByRole('checkbox').nth(2).check();
    await page.getByRole('checkbox').nth(3).check();
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'Speichern' }).dblclick();
});

test('Editing an Entry', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).dblclick();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis Hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Eintrag', exact: true }).click();
    await page.getByRole('button', { name: 'Speichern' }).click();
    await page.getByRole('button', { name: 'Bearbeiten' }).click();
    await page.getByRole('textbox').nth(1).fill('1');
    await page.getByRole('textbox').nth(2).click();
    await page.getByRole('textbox').nth(2).fill('2');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('3');
    await page.getByRole('textbox').nth(4).click();
    await page.getByRole('textbox').nth(4).fill('4');
    await page.getByRole('textbox').nth(5).click();
    await page.getByRole('textbox').nth(5).fill('5');
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - text: "1 Benutzername: 2"
    - button
    - text: "Passwort: ●●●●●●●●"
    - button
    - button
    - text: "URL:"
    - link "4":
      - /url: https://4
    - button
    - text: "Notiz: 5"
    - button "Bearbeiten"
    - button "Löschen"
    `);
})

test('the pw visibility button', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).dblclick();
    await page.getByRole('textbox', { name: 'Datenbankname' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).dblclick();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Eintrag', exact: true }).click();
    await expect(page.locator('button').nth(5)).toBeVisible();
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('12345');
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.locator('div').filter({ hasText: /^●●●●●●●●$/ })).toBeVisible();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
    await expect(page.locator('div').filter({ hasText: /^12345$/ })).toBeVisible();
});


test('layered folders', async ({ page }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Neue Datenbank erstellen' }).click();
    await page.getByRole('textbox', { name: 'Datenbankname' }).fill('Name');
    await page.getByRole('textbox', { name: 'Masterpasswort' }).click();
    await page.getByRole('textbox', { name: 'Masterpasswort' }).fill('PW');
    await page.getByRole('button', { name: 'Bestätigen' }).click();
    await page.getByRole('button', { name: 'Eintrag ins Startverzeichnis Hinzufügen', exact: true }).click();
    await page.getByRole('button', { name: 'Ordner' }).click();
    await page.getByRole('button', { name: '▷ Neuer Ordner ⋮' }).getByRole('textbox').fill('123');
    await page.getByRole('button', { name: '▷', exact: true }).click();
    await page.getByRole('button', { name: '⋮', exact: true }).click();
    await page.getByRole('button', { name: 'Eintrag hinzufügen' }).click();
    await page.getByRole('button', { name: 'Ordner', exact: true }).click();
    await page.getByRole('button', { name: '▷ Neuer Ordner ⋮' }).getByRole('textbox').fill('456');
    await page.getByRole('button', { name: '▷', exact: true }).click();
    await page.getByRole('button', { name: '⋮' }).nth(3).click();
    await page.getByRole('button', { name: 'Eintrag hinzufügen' }).nth(1).click();
    await page.getByRole('button', { name: 'Ordner', exact: true }).click();
    await page.getByRole('button', { name: '▷ Neuer Ordner ⋮' }).getByRole('textbox').fill('789');
    await page.getByText('Name▼123⋮▼456⋮▷⋮ To pick up a').click();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - button "Name":
      - text: ""
      - button "Eintrag ins Startverzeichnis Hinzufügen"
    - button /▼ \\d+ ⋮/:
      - button "▼"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - button /▼ \\d+ ⋮/:
      - button "▼"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - button /▷ \\d+ ⋮/:
      - button "▷"
      - text: ""
      - button "Eintrag hinzufügen" [disabled]
      - button "Ordner umbennen" [disabled]
      - button "Ordner löschen" [disabled]
      - button "⋮"
    - status
    `);
});