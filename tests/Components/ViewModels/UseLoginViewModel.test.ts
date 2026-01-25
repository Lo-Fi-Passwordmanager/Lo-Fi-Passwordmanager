import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useLoginViewModel} from "../../../src/Components/ViewModels/UseLoginViewModel";
import {Repo} from "@automerge/react";
import {SecurityProvider} from "../../../src/Utility/Security/SecurityProvider";
import {loadAllDatabases} from "../../../src/Utility/Storage";

describe('UseLoginViewModel',()=> {
    let repo;
    const setLoggedIn = vi.fn();
    const setAutomergeFacade = vi.fn();
    const setOpenedDbName = vi.fn();
    let secProv: SecurityProvider;
    beforeEach(() => {
        repo = new Repo();
        secProv = new SecurityProvider();
        let vali = secProv.getNewValidation("password", secProv.getNewSalt());
    })

    afterEach(() => {

    })

    it("should be able to create a new Database", async () => {
        const { result } = renderHook(() =>
            useLoginViewModel(repo, setLoggedIn, setAutomergeFacade, secProv, setOpenedDbName));
        act(()=> {
            result.current.createDatabase("name", "password");
        })
        act(() => {
            console.log(result.current.databases);
        })
        const databases = loadAllDatabases();
        console.log(databases);
        //expect(result.current.databases.size).toBe(1);
    })
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