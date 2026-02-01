import {beforeEach, describe, expect, it} from "vitest";
import {Entry} from "../../src/Model/Entry";
import {Folder} from "../../src/Model/Folder";
import {AutomergeDoc} from "../../src/Model/Automerge/AutomergeDoc";
import {SecurityProvider} from "../../src/Utility/Security/SecurityProvider";

describe('AutomergeHelper', () => {
    const entry = new Entry("name1", "id1", new Date(), new Date(), "user", "pass", "url", "note");
    const folder = new Folder("name2", "id2");
    const secProvider = new SecurityProvider();
    const salt = secProvider.getNewSalt();
    const validation = secProvider.getNewValidation("password", salt);
    let d:AutomergeDoc;

    beforeEach(() => {
        d = new AutomergeDoc(salt, validation);
    })
    it('Should tell whether an item is an entry or a folder', ()=> {
        expect(entry.isEntry()).toBe(true);
        expect(entry.isFolder()).toBe(false);
        expect(folder.isFolder()).toBe(true);
        expect(folder.isEntry()).toBe(false);
    });

    it('should ', ()=> {

    })
})