import {beforeEach, describe, expect, it} from "vitest";
import {AutomergeDoc} from "../../../src/Model/Automerge/AutomergeDoc";

describe('AutomergeDoc', ()=> {
    let doc: AutomergeDoc;
    const salt = "Meerwasser";
    const validation = "weniger Wasser";

    beforeEach(()=> {
        doc = new AutomergeDoc(salt, validation);
    })

    it('should be able to get and set the salt', () => {
        expect(doc.salt).toBe(salt);
        doc.salt = "nochMeerWasser";
        expect(doc.salt).toBe("nochMeerWasser");
    })

    it('should be able to get and set the validation', () => {
        expect(doc.validation).toBe(validation);
        doc.validation = "keinWasser";
        expect(doc.validation).toBe("keinWasser");
    })

    it('should be able to get and set the item list', ()=> {
        expect(doc.items).toStrictEqual([]);
        //TODO set items noch testen
    })

})