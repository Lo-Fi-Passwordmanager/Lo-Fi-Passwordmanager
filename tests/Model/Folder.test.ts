import {afterEach, assert, beforeEach, describe, expect, it} from "vitest";
import {Folder} from "../../src/Model/Folder";

describe('Folder', ()=> {
    let rootFolder;
    let folder1;
    let folder2;
    let item;

    let subfolder1;
    let subfolder2;

    beforeEach(() => {
        item = new Folder("level1folder3", "id3", new Date(), new Date())

        rootFolder = new Folder("level0", "id0", new Date(), new Date())
        folder1 = new Folder("level1folder1", "id1", new Date(), new Date())
        folder2 = new Folder("level1folder2", "id2", new Date(), new Date())
        rootFolder.addItem(folder1);
        rootFolder.addItem(folder2);
        rootFolder.addItem(item);

        subfolder1 = new Folder("level2folder1", "id11", new Date(), new Date())
        subfolder2 = new Folder("level2folder2", "id12", new Date(), new Date())
        folder1.addItem(subfolder1);
        folder2.addItem(subfolder2);
    })

    afterEach(() => {

    })

    it('basic test of base function and correct creation when used as Item', () => {
        expect(item.isFolder()).toBe(true);
        expect(item.isEntry()).toBe(false);

        expect(item.title).toBe("level1folder3");
        expect(item.id).toBe("id3");
    })

    it('basic test of base function and correct creation when used as Entry', () => {
        expect(rootFolder.isFolder()).toBe(true);
        expect(rootFolder.isEntry()).toBe(false);

        expect(rootFolder.title).toBe("level0");
        expect(rootFolder.id).toBe("id0");

        const oldDate = rootFolder.editedAt;
        rootFolder.title = "superCoolName";
        assert.notEqual(oldDate, rootFolder.editedAt);
        expect(oldDate).lessThanOrEqual(rootFolder.editedAt);
        expect(rootFolder.title).toBe("superCoolName");
    })

    it('should be able to return its entries',()=> {
        expect(rootFolder.entries).toStrictEqual([folder1, folder2, item])
    })

    it('should be able to return a child via the childs id', ()=> {
        console.log(rootFolder.getChildById("id1"));
        expect(rootFolder.getChildById("id1")).toBe(folder1);
        expect(folder1.getChildById("id11")).toBe(subfolder1);
    })

    it('should be able to remove a child item', () => {
        expect(rootFolder.entries).toStrictEqual([folder1, folder2, item])
        rootFolder.removeItem(folder2);
        expect(rootFolder.entries).toStrictEqual([folder1, item])
        expect(rootFolder.getChildById("id2")).toBe(null);
    })
})