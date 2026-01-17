import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {IndexedDBStorageAdapter, Repo} from "@automerge/react";
import {AutomergeFacade} from "../../src/Utility/AutomergeFacade";
import {SecurityProvider} from "../../src/Utility/Security/SecurityProvider";

const SAMPLE_PASSWORD = "password";

describe('AutomergeFacade', ()=> {
    let automergeFacade;
    let secProvider;
    let repo;
    repo = new Repo({
        storage: new IndexedDBStorageAdapter(),
    });

    beforeEach(()=> {
        repo = new Repo({
            storage: new IndexedDBStorageAdapter(),
        });
        automergeFacade = new AutomergeFacade(repo);
        secProvider = new SecurityProvider();
    })

    afterEach(()=> {

    })

    it('should be able to create a new Database',()=> {
        const salt = secProvider.getNewSalt();
        const validation = secProvider.getNewValidation(SAMPLE_PASSWORD, salt, "tolleDatenbank");
        automergeFacade.createDatabase(salt, validation);
    })
})