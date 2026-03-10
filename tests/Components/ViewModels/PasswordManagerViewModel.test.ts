import {expect, it, describe, beforeEach, afterEach} from "vitest";

import {
    usePasswordManagerViewModel
} from "../../../src/Components/ViewModels/PasswordManagerViewModel";
import {act, renderHook} from "@testing-library/react";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";
import {Settings} from "../../../src/Model/Settings";

describe("PasswordManagerViewModel", () => {
    beforeEach(() => {

    })

    afterEach(() => {

    })

    it("should be able to state whether the user is logged in", () => {
        const { result } = renderHook(() => usePasswordManagerViewModel());
        expect(result.current.loggedIn).toBe(false);
        act(()=>{
            result.current.setLoggedIn(true);
        })
        expect(result.current.loggedIn).toBe(true);
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
        expect(result.current.loggedIn).toBe(false);
        act(()=>{
            result.current.setLoggedIn(true);
        })
        expect(result.current.loggedIn).toBe(true);
        const repo = new Repo();
        act(()=>{
            result.current.setAutomergeFacade(new AutomergeFacade(repo));
        })
        expect(result.current.getAutomergeFacade()).toBeInstanceOf(AutomergeFacade);
        act(()=>{
            result.current.closeLoggedIn();
        })
        expect(result.current.loggedIn).toBe(false);
        let foo: string;
        try {
            foo = result.current.securityProvider.encryptValue(" ");
        } catch {
            foo = null;
        }
        expect(foo).toBe(null);
        expect(result.current.getAutomergeFacade()).toBe(null);
    })

    it("should be able to switch automergeserver correctly", () => {
        const { result } = renderHook(() => usePasswordManagerViewModel());
        expect(result.current.loggedIn).toBe(false);
        const settings = Settings.getSettings();
        expect(result.current.getServerName()).toBe("Automerge Sync Server");
        act(()=>{
            settings.addServer("KIT", "wss://kit.edu")
            settings.setServerUrl("KIT")
        })

        expect(result.current.getServerName()).toBe("KIT");
    })

    it("should be able to disconnect after idle", () => {
        const { result } = renderHook(() => usePasswordManagerViewModel());
        expect(result.current.loggedIn).toBe(false);
        act(()=>{
            result.current.setLoggedIn(true);
        })
        expect(result.current.loggedIn).toBe(true);
        const settings = Settings.getSettings();
        act(()=>{
            settings.setTimeoutActive(true)
            settings.setTimeoutLength(0.01)
        })
        expect(result.current.loggedIn).toBe(true);
        setTimeout(() => expect(result.current.loggedIn).toBe(false), 400)
    })
})