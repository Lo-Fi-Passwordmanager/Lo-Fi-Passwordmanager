import {expect, it, describe, beforeEach, afterEach} from "vitest";

import {
    usePasswordManagerViewModel
} from "../../../src/Components/ViewModels/PasswordManagerViewModel";
import {act, renderHook} from "@testing-library/react";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";

describe("PasswordManagerViewModel", () => {
    beforeEach(() => {

    })

    afterEach(() => {

    })

    it("should be able to state whether the user is logged in", () => {
        const { result } = renderHook(() => usePasswordManagerViewModel());
        expect(result.current.getLoggedIn()).toBe(false);
        act(()=>{
            result.current.setLoggedIn(true);
        })
        expect(result.current.getLoggedIn()).toBe(true);
    })

    it("should be able to return its AutomergeFacade",() => {
        const { result } = renderHook(() => usePasswordManagerViewModel());
        const repo = new Repo();
        act(()=>{
            result.current.setAutomergeFacade(new AutomergeFacade(repo));
        })
        expect(result.current.getAutomergeFacade()).toBeInstanceOf(AutomergeFacade);
    })

    it("should be able log out correctly", () => {
        const { result } = renderHook(() => usePasswordManagerViewModel());
        expect(result.current.getLoggedIn()).toBe(false);
        act(()=>{
            result.current.setLoggedIn(true);
        })
        expect(result.current.getLoggedIn()).toBe(true);
        const repo = new Repo();
        act(()=>{
            result.current.setAutomergeFacade(new AutomergeFacade(repo));
        })
        expect(result.current.getAutomergeFacade()).toBeInstanceOf(AutomergeFacade);
        act(()=>{
            result.current.closeLoggedIn();
        })
        expect(result.current.getLoggedIn()).toBe(false);
        let foo: string;
        try {
            foo = result.current.securityProvider.encryptValue(" ");
        } catch {
            foo = null;
        }
        expect(foo).toBe(null);

        expect(result.current.getAutomergeFacade()).toBe(null);
    })
})