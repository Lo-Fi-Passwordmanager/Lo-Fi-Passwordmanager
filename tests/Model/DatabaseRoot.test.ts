import {beforeEach, describe, expect, it} from "vitest";
import {Folder} from "../../src/Model/Folder";
import {DatabaseRoot} from "../../src/Model/DatabaseRoot";

describe('DatabaseRoot', ()=> {
    let root;
    let folder;
    let rootCompareFolder

    beforeEach(()=> {
        root = new DatabaseRoot("salt");
        rootCompareFolder = new Folder("root", "")
        folder = new Folder("name", "id");
    })

    it('should be able to add an item and find it via id', ()=> {
        root.addItem(folder);
        expect(root.getChildById("id")).toBe(folder);
    })

    it('should be able to return the salt', ()=>{
        expect(root.salt).toBe("salt");
    })
    //TODO might fail because createdAt/editedAdd are not the same some times
    it("should be able to return the root folder", ()=> {
        expect(root.rootFolder).toStrictEqual(rootCompareFolder);
    })

})