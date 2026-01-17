import {beforeEach, describe, expect, it} from "vitest";
import {AutomergeItem} from "../../../src/Model/Automerge/AutomergeItem";
import {AutomergeFolder} from "../../../src/Model/Automerge/AutomergeFolder";

describe('AutomergeFolder',() => {
    let item: AutomergeItem;

    beforeEach(()=> {
        item = new AutomergeFolder("name", 2020, 2021, "id");
    })

    it('should be created correctly', ()=> {
        expect(item).toBeInstanceOf(AutomergeFolder);
        expect(item.name).toBe("name");
        expect(item.createdAt).toBe(2020);
        expect(item.editedAt).toBe(2021);
        expect(item.parentId).toBe("id");
    })
})