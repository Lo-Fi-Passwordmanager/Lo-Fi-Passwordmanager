import {expect, it, describe, beforeEach, afterEach, assert} from "vitest";
import {Item} from "../../src/Model/Item";
import {Folder} from "../../src/Model/Folder";
import {Entry} from "../../src/Model/Entry";

describe('Item', () => {
    let item1: Item;
    let item2: Item;

    let root: Folder;
    let subFolder1: Folder;
    let subFolder2: Folder;
    let entry : Entry;
    let entry3: Entry;
    let entry2: Entry;
    let entry4: Entry;
    let entry5: Entry;

    beforeEach(() => {
        item1 = new Folder("Folder1", "id1");
        item2 = new Entry("Entry1", "id2", new Date(), new Date(), "entryName1", "password1", "url1", "note1")

        root = new Folder("krasser Titel", "123", new Date(), new Date())
        subFolder1 = new Folder("subFolder 1", "123", new Date(), new Date())
        subFolder2 = new Folder("subFolder 2", "123", new Date(), new Date())
        entry = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
        entry3 = new Entry("Name3", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
        entry2 = new Entry("Name2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
        entry4 = new Entry("subentry1", "id234", new Date(), new Date(), "name2", "password", "url", "note");
        entry5 = new Entry("subentry2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
        root.addItem(subFolder1);
        subFolder1.addItem(entry4);
        subFolder1.addItem(subFolder2);
        subFolder2.addItem(entry5);
        root.addItem(entry);
        root.addItem(entry2);
        root.addItem(entry3);

        //root
        //      entry
        //      entry2
        //      entry3
        //      subfolder1
        //              entry4
        //              subfolder2
        //                      entry5
    })

    afterEach(() => {
    })

    it('basic test of base function and correct creation', () => {
        expect(item1.isFolder()).toBe(true);
        expect(item1.isEntry()).toBe(false);
        expect(item2.isEntry()).toBe(true);
        expect(item2.isFolder()).toBe(false);
    })

    it('moving folder', () => {
        expect(root.items.includes(entry)).toBe(true);
        expect(root.items.includes(entry2)).toBe(true);
        expect(root.items.includes(entry3)).toBe(true);
        expect(root.items.includes(subFolder1)).toBe(true);
        expect(subFolder1.items.includes(subFolder2)).toBe(true);
        expect(subFolder1.items.includes(entry4)).toBe(true);
        expect(subFolder2.items.includes(entry5)).toBe(true);


        subFolder2.addItem(entry5);
        expect(root.items.includes(subFolder2)).toBe(false);
        root.addItem(subFolder2);
        expect(root.items.includes(subFolder2)).toBe(true);
    })

    it('should correctly handle its creation and last edited date', () =>{
        const testEntry = new Entry("Entry", "id000", new Date(), new Date(), "entryName", "password", "url", "note");
        expect(testEntry.createdAt).toStrictEqual(testEntry.editedAt);
        testEntry.password = "test";
        assert.notEqual(testEntry.createdAt, testEntry.editedAt);
    })

    it('should be able to get/set the items id', ()=> {
        expect(item1.id).toBe("id1");
        item1.id = "newId";
        expect(item1.id).toBe("newId");
    })

    it('should be able to get/set deleted correctly', ()=> {
        expect(item1.deleted).toBe(false);
        item1.deleted = true;
        expect(item1.deleted).toBe(true);
    })
})