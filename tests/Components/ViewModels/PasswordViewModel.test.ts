import {afterEach, beforeEach, describe, it} from "vitest";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";

describe('PasswordViewModel',() => {
    let automergeFacade;
    let repo;


    beforeEach(()=> {
        repo = new Repo();
        automergeFacade = new AutomergeFacade(repo);
        automergeFacade.createDatabase("salt", "validation", "Database");
    })

    afterEach(() => {

    })

    it('should be able to toggle editable Password view',() => {
        /*const { result } = renderHook(() => usePasswortViewModel(automergeFacade));
        expect(result.current.getInEditablePasswordView()).toBe(false);
        act(() => {
            result.current.toggleEditablePasswordView();
        })
        expect(result.current.getInEditablePasswordView()).toBe(true);
        act(() => {
            result.current.toggleEditablePasswordView();
        })
        expect(result.current.getInEditablePasswordView()).toBe(false);*/
    })

})
