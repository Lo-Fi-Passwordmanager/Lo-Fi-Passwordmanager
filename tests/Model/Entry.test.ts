import {expect, it, describe, beforeEach, afterEach, assert} from "vitest";
import {Item} from "../../src/Model/Item";
import {Entry} from "../../src/Model/Entry";
import {v} from "vitest/dist/chunks/reporters.d.Rsi0PyxX";

describe('Entry', () => {
    let item1: Item;
    let item2: Item;

    let entry1 : Entry;
    let entry2: Entry;

    beforeEach(() => {
        item1 = new Entry("Entry1", "id2", new Date(), new Date(), "entryName1", "password1", "url1", "note1");
        item2 = new Entry("Entry2", "id3", null, null, "entryName", "password", "url", "note");

        entry1 = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password2", "url2", "note2");
        entry2 = new Entry("Name2", "id234", new Date(), new Date(), "name2", "password3", "url3", "note3");
    })

    afterEach(() => {
    })

    it('basic test of base function and correct creation when used as Item', () => {
        expect(item1.isEntry()).toBe(true);
        expect(item1.isFolder()).toBe(false);

        expect(item1.title).toBe("Entry1");
        expect(item1.id).toBe("id2");
    })

    it('basic test of base function and correct creation when used as Entry', () => {
        expect(entry1.isEntry()).toBe(true);
        expect(entry1.isFolder()).toBe(false);

        expect(entry1.title).toBe("Name1");
        expect(entry1.id).toBe("id123");
        expect(entry1.username).toBe("benutzer1");
        expect(entry1.password).toBe("password2");
        expect(entry1.url).toBe("url2");
        expect(entry1.note).toBe("note2");

        const oldDate = entry1.editedAt;
        entry1.username = "superCoolName";
        assert.notEqual(oldDate, entry1.editedAt);
        expect(oldDate).lessThanOrEqual(entry1.editedAt);
        expect(entry1.username).toBe("superCoolName");
    })


})