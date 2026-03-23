import {expect, test} from "./playwrightSetup";

test("Creating a new Entry", async ({page}) => {
    await page.goto("");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis"}).click();
    await page.getByRole("button", {name: "Eintrag", exact: true}).click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - textbox: Neuer Eintrag
    - text: "Benutzername:"
    - textbox
    - text: "Passwort:"
    - textbox
    - button "Passwort anzeigen"
    - button "Passwort generieren"
    - text: "URL:"
    - textbox
    - text: "Notiz:"
    - textbox
    - button "Speichern"
    - button "Abbrechen"
    `);
    await page.getByRole("textbox").nth(1).click();
    await page.getByRole("textbox").nth(1).fill("Eintragname");
    await page.getByRole("textbox").nth(2).click();
    await page.getByRole("textbox").nth(2).fill("Username");
    await page.locator("input[type=\"password\"]").click();
    await page.locator("input[type=\"password\"]").fill("PW");
    await page.getByRole("textbox").nth(4).click();
    await page.getByRole("textbox").nth(4).fill("url");
    await page.getByRole("textbox").nth(5).click();
    await page.getByRole("textbox").nth(5).fill("note");
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - textbox: Eintragname
    - text: "Benutzername:"
    - textbox: Username
    - text: "Passwort:"
    - textbox: PW
    - button "Passwort anzeigen"
    - button "Passwort generieren"
    - text: "URL:"
    - textbox: url
    - text: "Notiz:"
    - textbox: note
    - button "Speichern"
    - button "Abbrechen"
    `);
    await page.getByRole("button", {name: "Speichern"}).click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - text: "Eintragname Benutzername: Username"
    - button "In Zwischenablage kopieren"
    - text: "Passwort: ●●●●●●●●"
    - button "Passwort anzeigen"
    - button "In Zwischenablage kopieren"
    - text: "URL:"
    - link "url":
      - /url: https://url
    - button "In Zwischenablage kopieren"
    - text: "Notiz: note"
    - button "Bearbeiten"
    - button "Löschen"
    `);
    await expect(page.getByRole("button", {name: "Eintragname"})).toBeVisible();
});

test("creating a new folder", async ({page}) => {
    await page.goto("");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis"}).click();
    await page.getByRole("button", {name: "Ordner"}).click();
    await expect(page.getByRole("button", {name: "▷ Neuer Ordner ⋮"})).toBeVisible();
    await page.getByRole("button", {name: "⋮", exact: true}).click();
    await page.getByRole("button", {name: "Ordner umbennen"}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("Name");
    await expect(page.getByRole("button", {name: "▷ Name ⋮"})).toBeVisible();
    await page.getByRole("button", {name: "⋮", exact: true}).click();
    await page.getByRole("button", {name: "Eintrag hinzufügen"}).click();
    await page.getByRole("button", {name: "Ordner", exact: true}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("2");
    await expect(page.getByRole("button", {name: "▷ 2 ⋮"})).toBeVisible();
});

test("swap ascending/descending", async ({page}) => {
    await page.goto("");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis"}).click();
    await page.getByRole("button", {name: "Ordner"}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("A");
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis"}).click();
    await page.getByRole("button", {name: "Ordner", exact: true}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("B");
    await page.getByText("Bitte Eintrag auswählen").click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
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
    `);
    await page.getByRole("button", {name: "Absteigend sortieren"}).click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
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
    `);
    await expect(page.getByRole("button", {name: "Aufsteigend sortieren"})).toBeVisible();
});

test("passwort Generator", async ({page}) => {
    await page.goto("");
    await page.goto("http://localhost:5173/");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis"}).click();
    await page.getByRole("button", {name: "Eintrag", exact: true}).click();
    await page.getByRole("button", {name: "Passwort generieren"}).click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
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
    await page.getByRole("spinbutton").click();
    await page.getByRole("spinbutton").fill("30");
    await page.locator("span").nth(3).click();
    await page.locator("span").nth(4).click();
    await page.locator("span").nth(5).click();
    await page.locator("label:nth-child(10) > .slider").click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
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
    await page.locator("span").nth(3).click();
    await page.locator("span").nth(4).click();
    await page.locator("span").nth(5).click();
    await page.locator("label:nth-child(10) > .slider").click();
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Speichern"}).dblclick();
});

test("Editing an Entry", async ({page}) => {
    await page.goto("");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).dblclick();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis Hinzufügen", exact: true}).click();
    await page.getByRole("button", {name: "Eintrag", exact: true}).click();
    await page.getByRole("button", {name: "Speichern"}).click();
    await page.getByRole("button", {name: "Bearbeiten"}).click();
    await page.getByRole("textbox").nth(1).fill("1");
    await page.getByRole("textbox").nth(2).click();
    await page.getByRole("textbox").nth(2).fill("2");
    await page.locator("input[type=\"password\"]").click();
    await page.locator("input[type=\"password\"]").fill("3");
    await page.getByRole("textbox").nth(4).click();
    await page.getByRole("textbox").nth(4).fill("4");
    await page.getByRole("textbox").nth(5).click();
    await page.getByRole("textbox").nth(5).fill("5");
    await page.getByRole("button", {name: "Speichern"}).click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
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
});

test("the pw visibility button", async ({page}) => {
    await page.goto("");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis"}).click();
    await page.getByRole("button", {name: "Eintrag", exact: true}).click();
    await page.getByRole("textbox").nth(1).fill("Name");
    await page.locator("input[type=\"password\"]").click();
    await page.locator("input[type=\"password\"]").fill("12345");
    await page.getByRole("button", {name: "Speichern"}).click();
    await expect(page.locator("#root")).toContainText("●●●●●●●●");
    await page.getByRole("button", {name: "Passwort anzeigen"}).click();
    await expect(page.locator("#root")).toContainText("12345");
});


test("layered folders", async ({page}) => {
    await page.goto("");
    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Name");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("PW");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Eintrag ins Startverzeichnis Hinzufügen", exact: true}).click();
    await page.getByRole("button", {name: "Ordner"}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("123");
    await page.getByRole("button", {name: "▷", exact: true}).click();
    await page.getByRole("button", {name: "⋮", exact: true}).click();
    await page.getByRole("button", {name: "Eintrag hinzufügen"}).click();
    await page.getByRole("button", {name: "Ordner", exact: true}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("456");
    await page.getByRole("button", {name: "▷", exact: true}).click();
    await page.getByRole("button", {name: "⋮"}).nth(3).click();
    await page.getByRole("button", {name: "Eintrag hinzufügen"}).nth(1).click();
    await page.getByRole("button", {name: "Ordner", exact: true}).click();
    await page.getByRole("button", {name: "▷ Neuer Ordner ⋮"}).getByRole("textbox").fill("789");
    await page.getByText("Name▼123⋮▼456⋮▷⋮ To pick up a").click();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
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