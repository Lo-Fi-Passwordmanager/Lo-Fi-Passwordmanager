import {beforeEach, describe, expect, it} from "vitest";
import {Entry} from "../../src/Model/Entry";
import {Folder} from "../../src/Model/Folder";
import {AutomergeDoc} from "../../src/Model/Automerge/AutomergeDoc";
import {SecurityProvider} from "../../src/Utility/Security/SecurityProvider";
import {AutomergeEntry} from "../../src/Model/Automerge/AutomergeEntry";
import {AutomergeFolder} from "../../src/Model/Automerge/AutomergeFolder";
import {
    buildDatabaseAsTree,
    databaseItemFromAutomergeItem,
    deleteValue,
    insertValue, updateValue
} from "../../src/Utility/AutomergeHelper";
import {build} from "vite";
import {getObjectId} from "@automerge/react";
import { AutomergeItem } from "../../src/Model/Automerge/AutomergeItem";

describe('AutomergeHelper', () => {
    const secProvider = new SecurityProvider();
    const salt = secProvider.getNewSalt();
    const validation = secProvider.getNewValidation("password", salt);
    let doc: AutomergeDoc;
    const folderName = secProvider.encryptValue("folderName");
    let entry: AutomergeEntry;
    let folder: AutomergeFolder;

    beforeEach(() => {
        doc = new AutomergeDoc(salt, validation);
        entry = new AutomergeEntry(secProvider.encryptValue("entryName"), 0, 0, "0", secProvider.encryptValue("user"),
            secProvider.encryptValue("pass"), secProvider.encryptValue("url"), secProvider.encryptValue("note"));
        folder = new AutomergeFolder(folderName, 0, 0, "");
    })


    it('Should be able to create a database item from an entry', ()=> {
        const item = databaseItemFromAutomergeItem(entry, secProvider);
        expect(item).toBeInstanceOf(Entry);
        expect((item as Entry).title).toBe("entryName");
    });

    it('Should be able to create a database item from an entry', ()=> {
        const item = databaseItemFromAutomergeItem(folder, secProvider);
        expect(item).toBeInstanceOf(Folder);
        expect((item as Entry).title).toBe("folderName");
    });

    it('should be able to insert an item into a doc', ()=> {
        expect(doc.items.length).toBe(0);
        insertValue(doc, null, folder);
        expect(doc.items.length).toBe(1);
        insertValue(doc, folder, entry);
        expect(doc.items.length).toBe(2);
    });

    it('should be able to build a empty database as a tree', ()=> {
        const tree = buildDatabaseAsTree(doc, secProvider);
        expect(tree[1].size).toBe(0);
    })

    it('should be able to delete items from a doc', ()=> {
        insertValue(doc, null, folder);
        expect(doc.items.length).toBe(1);
        const tree = buildDatabaseAsTree(doc, secProvider);
        deleteValue(doc, getObjectId(folder), tree[1]);
        expect(doc.items.length).toBe(0);
    });

    /*it('should be able to delete items recursively from a doc', ()=> {
        insertValue(doc, null, folder);
        insertValue(doc, folder, entry);
        expect(doc.items.length).toBe(2);
        const tree = buildDatabaseAsTree(doc, secProvider);
        deleteValue(doc, getObjectId(folder), tree[1]);
        expect(doc.items.length).toBe(0);
    });*/

    it('should be able to update a folder value', ()=> {
        insertValue(doc, null, folder);
        expect(doc.items.length).toBe(1);
        expect(doc.items[0].name).toBe(folderName);
        expect(doc.items[0].parentId).toBe("");
        const tree = buildDatabaseAsTree(doc, secProvider);
        updateValue(doc, getObjectId(folder), tree[1], "name", "bla");
        expect(doc.items[0].name).toBe("bla");
        updateValue(doc, getObjectId(folder), tree[1], "parentId", "1234");
        expect(doc.items[0].parentId).toBe("1234");
    });

    it('should throw when a value is tried to be updated that doesnt exist on folders', ()=> {
        insertValue(doc, null, folder);
        expect(doc.items.length).toBe(1);
        const tree = buildDatabaseAsTree(doc, secProvider);
        expect(() => updateValue(doc, getObjectId(folder), tree[1], "username", "bla")).toThrow("This attribute does not exist on folders.");
    });

    it('should be able to update an items Date', ()=> {
        insertValue(doc, null, folder);
        const tree = buildDatabaseAsTree(doc, secProvider);
        const newDate = new Date();
        updateValue(doc, getObjectId(folder), tree[1], "editedAt", newDate);
        expect(doc.items[0].editedAt).toBe(newDate.getTime() / 1000);
        updateValue(doc, getObjectId(folder), tree[1], "createdAt", newDate);
        expect(doc.items[0].createdAt).toBe(newDate.getTime() / 1000);
    });

    it('should throw when a date is tried to be assign to a string attribute', ()=> {
        insertValue(doc, null, folder);
        const tree = buildDatabaseAsTree(doc, secProvider);
        expect(() => updateValue(doc, getObjectId(folder), tree[1], "name", new Date())).toThrow();
    });

    it('should throw when a string is tried to be assign to a date attribute', ()=> {
        insertValue(doc, null, folder);
        const tree = buildDatabaseAsTree(doc, secProvider);
        expect(() => updateValue(doc, getObjectId(folder), tree[1], "createdAt", "newName")).toThrow();
    });

    it('should throw when updating an item that doesnt exist', ()=> {
        const tree = buildDatabaseAsTree(doc, secProvider);
        expect(() => updateValue(doc, getObjectId(folder), tree[1], "name", "newName")).toThrow();
    });

    it('should be able to update a folder value', ()=> {
        insertValue(doc, null, entry);
        expect(doc.items.length).toBe(1);
        const tree = buildDatabaseAsTree(doc, secProvider);
        updateValue(doc, getObjectId(entry), tree[1], "name", "bla");
        expect(doc.items[0].name).toBe("bla");
    });
})