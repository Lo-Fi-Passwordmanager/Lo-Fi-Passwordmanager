import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {usePasswortViewModel} from "../../../src/Components/ViewModels/PasswordViewModel";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";

describe('PasswordViewModel',() => {
    let automergeFacade;
    let repo;

    beforeEach(()=> {
        repo = createMockRepo();
        automergeFacade = new AutomergeFacade(repo, "automerge:mock-url");
    })

    afterEach(() => {

    })

    it('should be able to toggle editable Password view',() => {
        const { result  } = renderHook(() => usePasswortViewModel(automergeFacade));
        expect(result.current.getInEditablePasswordView()).toBe(false);
        act(() => {
            result.current.toggleEditablePasswordView();
        })
        expect(result.current.getInEditablePasswordView()).toBe(true);
        act(() => {
            result.current.toggleEditablePasswordView();
        })
        expect(result.current.getInEditablePasswordView()).toBe(false);
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