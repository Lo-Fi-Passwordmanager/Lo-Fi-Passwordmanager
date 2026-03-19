import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {getObjectId, Repo} from "@automerge/react";
import {AutomergeFacade} from "../../src/Utility/AutomergeFacade";
import {SecurityProvider} from "../../src/Utility/Security/SecurityProvider";
import {AutomergeDoc} from "../../src/Model/Automerge/AutomergeDoc";


describe("AutomergeFacade mocked Repo", () => {
    let automergeFacade: AutomergeFacade;
    let repo: Repo;
    const secProvider = new SecurityProvider();

    beforeEach(() => {
        repo = createMockRepo();
        automergeFacade = new AutomergeFacade(repo, undefined, secProvider);
    });

    afterEach(() => {

    });

    it("creates a new database and sets the automergeURL correctly", () => {
        automergeFacade.createDatabase("salt", "validation");

        expect(automergeFacade.automergeURL).toBe("automerge:mock-url");
        expect(repo.create).toHaveBeenCalled();
    });

    it("creates a new database and sets salt and validation correctly", async () => {
        automergeFacade.createDatabase("salt", "validation");
        const salt = await automergeFacade.getSalt();
        const validation = await automergeFacade.getValidation();

        expect(salt).toBe("salt");
        expect(validation).toBe("validation");
    });

    it("return null when no database exists for salt and validation correctly", async () => {
        const salt = await automergeFacade.getSalt();
        const validation = await automergeFacade.getValidation();

        expect(salt).toBe(null);
        expect(validation).toBe(null);
    });

    it("should throw an error when the url is invalid", () => {
        const repo = createMockRepo();
        expect(() => {
            new AutomergeFacade(repo, "invalid-url");
        }).toThrow("invalid-url is not a valid automerge URL.");
    });


    it("loads salt/validation via repo.find when salt is not cached", async () => {
        const repo2 = new Repo();
        const automergeFacade2 = new AutomergeFacade(repo2);

        automergeFacade2.createDatabase("salt", "validation");
        const url = automergeFacade2.automergeURL;

        const facade2 = new AutomergeFacade(repo2, url);

        const salt = await facade2.getSalt();
        const validation = await facade2.getValidation();

        expect(salt).toBe("salt");
        expect(validation).toBe("validation");
    });

    it("should be able to return the SecurityProvider", () => {
        expect(automergeFacade.getSecurityProvider()).toBeInstanceOf(SecurityProvider);
    });

    it("should return null when history is called and automerge url is null", async () => {
        expect(await automergeFacade.getHistory()).toBe(null);
    });

    /*it('should', async ()=> {
        automergeFacade.createDatabase("salt", "string");
        console.log(await automergeFacade.getHistory());
    });*/
});

describe("AutomergeFacade unmocked Repo", () => {

    let automergeFacade: AutomergeFacade;
    let repo: Repo;
    const secProvider = new SecurityProvider();

    beforeEach(() => {
        repo = new Repo({
                network: [],
                storage: undefined
            }
        );
        automergeFacade = new AutomergeFacade(repo, undefined, secProvider);
    });

    it("should return null if automergeURL is not set", async () => {
        const history = await automergeFacade.getHistory();
        expect(history).toBeNull();
    });

    it("should correctly track inserts and updates in history", async () => {
        automergeFacade.createDatabase("test-salt", "test-validation");
        const handle = await repo.find<AutomergeDoc>(automergeFacade.automergeURL!);
        await handle.whenReady();

        handle.change((doc: any) => {
            doc.items = [];
        });

        handle.change((doc: any) => {
            doc.items.push({name: "Test Item 1", note: "Start"});
        });

        handle.change((doc: any) => {
            doc.items[0].name = "Test Item Updated";
        });

        const history = await automergeFacade.getHistory();


        expect(history).not.toBeNull();

        const itemChanges = history!.filter(h => h.item && h.type !== undefined);

        expect(itemChanges.length).toBeGreaterThanOrEqual(2);

        const updateEntry = itemChanges.find(h => h.type === "update");
        expect(updateEntry).toBeDefined();
        expect(updateEntry?.changes.get("name")).toBe("Test Item Updated");
    });

    it("should export the database to a Uint8Array", async () => {
        automergeFacade.createDatabase("export-salt", "export-validation");

        const handle = await repo.find(automergeFacade.automergeURL!);
        await handle.whenReady();

        // put some data in the document
        handle.change((doc: any) => {
            doc.items = [{name: "Export Me"}];
        });

        const binary = await automergeFacade.exportAutomergeToBinary();

        expect(binary).toBeDefined();
        expect(binary).toBeInstanceOf(Uint8Array);
        expect(binary!.length).toBeGreaterThan(0);
    });

    it("should identify parent changes as item move and resolve folder names", async () => {
        automergeFacade.createDatabase("move-salt", "move-validation");
        const handle = await repo.find<AutomergeDoc>(automergeFacade.automergeURL!);
        await handle.whenReady();

        handle.change((doc: any) => {
            doc.items = [];
        });

        handle.change((doc: any) => {
            doc.items.push({name: "folder A"});
            doc.items.push({name: "folder B"});
            doc.items.push({name: "entry"});
        });

        const docState = handle.doc();
        const folderAId = getObjectId(docState.items[0]);
        const folderBId = getObjectId(docState.items[1]);

        // first move: move entry  into folder A
        handle.change((doc: any) => {
            doc.items[2].parentId = folderAId;
        });

        // second move: move entry from folder A to folder B
        handle.change((doc: any) => {
            doc.items[2].parentId = folderBId;
        });

        const history = await automergeFacade.getHistory();
        expect(history).not.toBeNull();

        const moveChanges = history!.filter(h => h.type === "move");

        expect(moveChanges.length).toBe(2);

        expect(moveChanges[0].oldParent).toBe("");
        expect(moveChanges[0].changes.get("parentId")).toBe("folder A");

        expect(moveChanges[1].oldParent).toBe("folder A");
        expect(moveChanges[1].changes.get("parentId")).toBe("folder B");
    });
});

function createMockRepo() {
    return {
        create: vi.fn().mockReturnValue({
            url: "automerge:mock-url"
        }),
        find: vi.fn().mockResolvedValue({
            doc: () => ({
                salt: "salt123",
                validation: "val123"
            })
        })
    } as unknown as Repo;
}