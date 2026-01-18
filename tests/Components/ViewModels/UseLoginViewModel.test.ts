import {afterEach, beforeEach, describe, it, vi} from "vitest";
//import {act, renderHook} from "@testing-library/react";
//import {useLoginViewModel} from "../../../src/Components/ViewModels/UseLoginViewModel";
import {Repo} from "@automerge/react";

describe('UseLoginViewModel',()=> {
    let repo;

    beforeEach(() => {
        repo = createMockRepo();
    })

    afterEach(() => {

    })

    it("should be able to create a new Database", () => {
        /*const { result } = renderHook(useLoginViewModel(repo))
        act(() => {
            result.current.createDatabase("name", "password");
        })*/
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