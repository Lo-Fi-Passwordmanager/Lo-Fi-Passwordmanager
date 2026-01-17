import {expect, it, describe, beforeEach, afterEach, assert} from "vitest";
import {Item} from "../../src/Model/Item";
import {Entry} from "../../src/Model/Entry";

describe('Entry', () => {
    let item1: Item;
    let item2: Item;

    let entry1 : Entry;

    beforeEach(() => {
        item1 = new Entry("Entry1", "id2", new Date(), new Date(), "entryName1", "password1", "url1", "note1");
        item2 = new Entry("Entry2", "id3", null, null, "entryName", "password", "url", "note");

        entry1 = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password2", "url2", "note2");
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

    it('should be able to update its username', ()=> {
        expect(entry1.username).toBe("benutzer1");
        entry1.username = "newUser";
        expect(entry1.username).toBe("newUser");
    })

    it('should be able to update its password', ()=> {
        expect(entry1.password).toBe("password2");
        entry1.password = "newPassword";
        expect(entry1.password).toBe("newPassword");
    })

    it('should be able to update its url', ()=> {
        expect(entry1.url).toBe("url2");
        entry1.url = "newUrl";
        expect(entry1.url).toBe("newUrl");
    })

    it('should be able to update its url', ()=> {
        expect(entry1.note).toBe("note2");
        entry1.note = "newNote";
        expect(entry1.note).toBe("newNote");
    })


    it('should add a date if its null', ()=> {
        expect(item2.createdAt).toBeInstanceOf(Date);
        expect(item2.editedAt).toBeInstanceOf(Date);
    })


})