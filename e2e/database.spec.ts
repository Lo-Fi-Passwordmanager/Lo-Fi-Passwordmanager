import {expect, test} from "@playwright/test";

test("create a new DB, delete it and add it again via URL", async ({page}) => {

    if (page.context().browser() && page.context().browser().browserType().name() == "chromium") {
        await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    }

    await page.goto("");
    await expect(page.getByRole("img", {name: "Passwortmanager Logo"})).toBeVisible();
    //klickt auf +
    await page.getByRole("main").getByRole("button").click();
    await expect(page.getByRole("heading", {name: "Neue Datenbank erstellen"})).toBeVisible();
    //erstellt eine neue Datenbank
    await page.getByRole("textbox", {name: "Datenbankname"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Datenbankname");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("Masterpasswort");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    //überprüft das wir angemeldet sind
    await expect(page.getByRole("textbox", {name: "Suchen..."})).toBeVisible();
    await expect(page.getByRole("button", {name: "⬅"})).toBeVisible();
    //meldet sich ab
    await page.getByRole("button", {name: "⬅"}).click();
    await expect(page.getByRole("button", {name: "Datenbankname"})).toBeVisible();
    //klickt auf den umbennen button
    await page.getByRole("button").nth(4).click();
    await expect(page.getByRole("heading", {name: "Datenbank umbenennen:"})).toBeVisible();
    //bennent die Datenbank um
    await page.getByRole("textbox").click();
    await page.getByRole("textbox").fill("NeuerName");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    //meldet sich in die umbenannte Datenbank an
    await page.getByRole("button", {name: "NeuerName"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("Masterpasswort");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    //überprüft das wir angemeldet sind
    await expect(page.getByRole("textbox", {name: "Suchen..."})).toBeVisible();
    await expect(page.getByRole("button", {name: "⬅"})).toBeVisible();
    //Einstellungen öffnen
    await page.getByRole("button").first().click();
    await expect(page.locator("h1")).toBeVisible();
    //DB Einstellung öffnen
    await page.getByRole("button", {name: "Datenbankeinstellungen"}).dblclick();
    await expect(page.getByRole("heading", {name: "Datenbankeinstellungen"})).toBeVisible();
    //automerge url kopieren und DB exportieren
    await page.getByRole("button", {name: "URL kopieren"}).click();
    const copiedText = await page.evaluate(() => {
        return navigator.clipboard.readText();
    });
    const download1Promise = page.waitForEvent("download");
    await page.getByRole("button", {name: "Verschlüsselt Exportieren"}).dblclick();
    const download1 = await download1Promise;
    //abmelden
    await page.getByRole("img").nth(2).click();
    await page.getByRole("button", {name: "⬅"}).click();
    await expect(page.getByRole("button", {name: "URL kopieren"})).toBeVisible();
    //Db löschen
    await page.getByRole("button").nth(5).click();
    await expect(page.getByRole("heading", {name: "Löschen bestätigen"})).toBeVisible();
    await page.getByRole("button", {name: "Löschen"}).dblclick();
    //Menu für Db mit url laden öffnen
    await page.getByRole("main").getByRole("button").click();
    await expect(page.getByRole("heading", {name: "Neue Datenbank erstellen"})).toBeVisible();
    await page.getByRole("button", {name: "Existierende Datenbank laden"}).click();
    await expect(page.getByRole("textbox", {name: "Name"})).toBeVisible();
    //Db Daten eingeben und anmelden
    await page.getByRole("textbox", {name: "Automerge Url"}).click();
    await page.getByRole("textbox", {name: "Automerge Url"}).fill(copiedText);
    await page.getByRole("textbox", {name: "Name"}).click();
    await page.getByRole("textbox", {name: "Name"}).fill("Datenbankname");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Datenbankname"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("Masterpasswort");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    //überprüft das wir angemeldet sind
    await expect(page.getByRole("textbox", {name: "Suchen..."})).toBeVisible();
    await expect(page.getByRole("button", {name: "⬅"})).toBeVisible();
});

test("create a Database and rename it", async ({page}) => {
    await page.goto("");
    await expect(page.getByRole("img", {name: "Passwortmanager Logo"})).toBeVisible();

    await page.getByRole("main").getByRole("button").click();
    await expect(page.getByRole("heading", {name: "Neue Datenbank erstellen"})).toBeVisible();

    await page.getByRole("textbox", {name: "Datenbankname"}).click();
    await page.getByRole("textbox", {name: "Datenbankname"}).fill("Datenbankname");
    await page.getByRole("textbox", {name: "Masterpasswort"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("Masterpasswort");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    //überprüft das wir angemeldet sind
    await expect(page.getByRole("textbox", {name: "Suchen..."})).toBeVisible();
    await expect(page.getByRole("button", {name: "⬅"})).toBeVisible();

    await page.getByRole("button", {name: "⬅"}).click();
    await expect(page.getByRole("button", {name: "Datenbankname"})).toBeVisible();

    await page.getByRole("button").nth(4).click();
    await expect(page.getByRole("heading", {name: "Datenbank umbenennen:"})).toBeVisible();

    await page.getByRole("textbox").click();
    await page.getByRole("textbox").fill("NeuerName");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "NeuerName"}).click();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("Masterpasswort");
    await page.getByRole("button", {name: "Bestätigen"}).click();
});

test("add a database with a link", async ({page}) => {
    await page.goto("");
    await expect(page.getByRole("img", {name: "Passwortmanager Logo"})).toBeVisible();

    await page.getByRole("button", {name: "Neue Datenbank erstellen"}).click();
    await expect(page.getByRole("heading", {name: "Neue Datenbank erstellen"})).toBeVisible();
    await page.getByRole("button", {name: "Existierende Datenbank laden"}).click();
    await expect(page.getByRole("textbox", {name: "Automerge Url"})).toBeVisible();

    //Db Daten eingeben und anmelden
    await page.getByRole("textbox", {name: "Automerge Url"}).click();
    await page.getByRole("textbox", {name: "Automerge Url"}).fill("3SLSyunA52oN1V9LN7Eq6RZQnqFA");
    await page.getByRole("textbox", {name: "Name"}).click();
    await page.getByRole("textbox", {name: "Name"}).fill("Datenbankname");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    await page.getByRole("button", {name: "Datenbankname"}).click();
    await expect(page.getByRole("heading", {name: "Datenbank öffnen"})).toBeVisible();
    await page.getByRole("textbox", {name: "Masterpasswort"}).fill("Masterpasswort");
    await page.getByRole("button", {name: "Bestätigen"}).click();
    //überprüft das wir angemeldet sind
    await expect(page.getByRole("textbox", {name: "Suchen..."})).toBeVisible();
    await expect(page.getByRole("button", {name: "⬅"})).toBeVisible();
    await page.getByRole("button", {name: "⬅"}).click();
});
