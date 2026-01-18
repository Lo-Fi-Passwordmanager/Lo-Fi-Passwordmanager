import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {IndexedDBStorageAdapter, Repo} from "@automerge/react";
import {AutomergeFacade} from "../../src/Utility/AutomergeFacade";


function createMockRepo() {
    return {
        create: vi.fn().mockReturnValue({
            url: "automerge:mock-url",
        }),
        find: vi.fn().mockResolvedValue({
            doc: () => ({
                salt: "salt123",
                validation: "val123",
            }),
        }),
    } as unknown as Repo
}


function createNoUrlRepo() {
    return {
        find: vi.fn().mockResolvedValue({
            doc: () => ({
                salt: "salt123",
                validation: "val123",
            }),
        }),
    } as unknown as Repo
}

describe('AutomergeFacade', ()=> {
    let automergeFacade;
    let repo;
    repo = new Repo({
        storage: new IndexedDBStorageAdapter(),
    });

    beforeEach(()=> {
        repo = createMockRepo();
        automergeFacade = new AutomergeFacade(repo);
    })

    afterEach(()=> {

    })

    it("creates a new database and sets the automergeURL correctly", () => {
        automergeFacade.createDatabase("salt", "validation", "Database");

        expect(automergeFacade.automergeURL).toBe("automerge:mock-url")
        expect(repo.create).toHaveBeenCalled()
    })

    it("creates a new database and sets salt and validation correctly", async () => {
        automergeFacade.createDatabase("salt", "validation", "Database");
        const salt = await automergeFacade.getSalt();
        const validation = await automergeFacade.getValidation();

        expect(salt).toBe("salt");
        expect(validation).toBe("validation");
    })

    it("return null when no database exists for salt and validation correctly", async () => {

        const salt = await automergeFacade.getSalt();
        const validation = await automergeFacade.getValidation();

        expect(salt).toBe(null);
        expect(validation).toBe(null);
    })

    it("should throw an error when the url is invalid", ()=> {
        const repo = createMockRepo();
        expect(() => {
            new AutomergeFacade(repo, 'invalid-url');
        }).toThrow("invalid-url is not a valid automerge URL.");
    })

    /*it("should be able to get salt/validation from a repo without a url",async ()=> {
        const repo = createNoUrlRepo();

        automergeFacade = new AutomergeFacade(repo, "automerge://test-document");

        const salt = await automergeFacade.getSalt();
        const validation = await automergeFacade.getValidation();

        expect(salt).toBe("salt");
        expect(validation).toBe("validation");
    })
    */
})