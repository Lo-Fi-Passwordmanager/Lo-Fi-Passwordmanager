import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Repo} from "@automerge/react";
import {AutomergeFacade} from "../../src/Utility/AutomergeFacade";
import {SecurityProvider} from "../../src/Utility/Security/SecurityProvider";


describe('AutomergeFacade', ()=> {
    let automergeFacade: AutomergeFacade;
    let repo: Repo;
    const secProvider = new SecurityProvider();

    beforeEach(()=> {
        repo = createMockRepo();
        automergeFacade = new AutomergeFacade(repo, undefined, secProvider);
    })

    afterEach(()=> {

    })

    it("creates a new database and sets the automergeURL correctly", () => {
        automergeFacade.createDatabase("salt", "validation");

        expect(automergeFacade.automergeURL).toBe("automerge:mock-url")
        expect(repo.create).toHaveBeenCalled()
    })

    it("creates a new database and sets salt and validation correctly", async () => {
        automergeFacade.createDatabase("salt", "validation");
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


    it("loads salt/validation via repo.find when salt is not cached", async () => {
        const repo2 = new Repo();
        const automergeFacade2 = new AutomergeFacade(repo2);

        automergeFacade2.createDatabase("salt", "validation");
        const url = automergeFacade2.automergeURL

        const facade2 = new AutomergeFacade(repo2, url);

        const salt = await facade2.getSalt();
        const validation = await facade2.getValidation();

        expect(salt).toBe("salt");
        expect(validation).toBe("validation");
    })

    it('should be able to return the SecurityProvider', ()=> {
        expect(automergeFacade.getSecurityProvider()).toBeInstanceOf(SecurityProvider)
    });

    it('should return null when history is called and automerge url is null', async ()=> {
        expect(await automergeFacade.getHistory()).toBe(null);
    });

    /*it('should', async ()=> {
        automergeFacade.createDatabase("salt", "string");
        console.log(await automergeFacade.getHistory());
    });*/
})

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