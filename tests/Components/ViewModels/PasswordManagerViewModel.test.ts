import {expect, it, describe, beforeEach, afterEach} from "vitest";

import {
    loadAllDatabases,
    saveDatabases,
    usePasswordManagerViewModel
} from "../../../src/Components/ViewModels/PasswordManagerViewModel";
import {AutomergeUrl} from "@automerge/automerge-repo";
import {act, renderHook} from "@testing-library/react";
import {AutomergeFacade} from "../../../src/Utility/AutomergeFacade";
import {Repo} from "@automerge/react";

const testMap = new Map<string, AutomergeUrl>();

describe("PasswordManagerViewModel", () => {
    beforeEach(() => {
        const url1: AutomergeUrl = "automerge-id-1" as AutomergeUrl;
        testMap.set("TestDB1", url1);
    })

    afterEach(() => {
        localStorage.clear();
        testMap.clear();
    })

    it('should load saved databases from localStorage', () => {
        saveDatabases(testMap);
        expect(loadAllDatabases()).toEqual(testMap);
    })

    it('should save an edited map of databases to localStorage', () => {
        saveDatabases(testMap);
        const loadedMap = loadAllDatabases();
        loadedMap.set("TestDB2", "automerge-id-2" as AutomergeUrl);
        saveDatabases(loadedMap);
        const reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(2);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
    })

    it('should return an empty map if no databases are stored', () => {
        const loadedMap = loadAllDatabases();
        expect(loadedMap.size).toBe(0);
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