import {beforeEach, describe, expect, it} from "vitest";
import {AutomergeItem} from "../../../src/Model/Automerge/AutomergeItem";
import {AutomergeEntry} from "../../../src/Model/Automerge/AutomergeEntry";
import {AutomergeFolder} from "../../../src/Model/Automerge/AutomergeFolder";

describe('AutomergeItem',() => {
    let entry;
    let folder;

    beforeEach(()=>{
        entry = new AutomergeEntry("name", 2020, 2021, "id", "user", "password", "url", "note");
        folder = new AutomergeFolder("folder", 1, 2, "root");
    })

    it('should be able to get/set the name ', ()=> {
        expect(entry.name).toBe("name");
        entry.name = "newName";
        expect(entry.name).toBe("newName");
    })

    it('should be able to get/set the createdAt', ()=> {
        expect(entry.createdAt).toBe(2020);
        entry.createdAt = 20202;
        expect(entry.createdAt).toBe(20202);
    })

    it('should be able to get/set the editedAt', ()=> {
        expect(entry.editedAt).toBe(2021);
        entry.editedAt = 20222;
        expect(entry.editedAt).toBe(20222);
    })

    it('should be able to get/set the parentId', ()=> {
        expect(entry.parentId).toBe("id");
        entry.parentId = "newParent";
        expect(entry.parentId).toBe("newParent");
    })

    it('should be able to correctly return its type', ()=> {
        expect(entry.type).toBe("entry");
        expect(folder.type).toBe("folder");
    })
})