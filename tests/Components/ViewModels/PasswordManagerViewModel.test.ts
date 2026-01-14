import {expect, it, describe, beforeEach, afterEach} from "vitest";

import {loadAllDatabases, saveDatabases} from "../../../src/Components/ViewModels/PasswordManagerViewModel";

const testMap = new Map<string, string>();

describe("PasswordManagerViewModel", () => {
    beforeEach(() => {
        testMap.set("TestDB1", "automerge-id-1");
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
        loadedMap.set("TestDB2", "automerge-id-2");
        saveDatabases(loadedMap);
        const reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(2);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
    })

    it('should return an empty map if no databases are stored', () => {
        const loadedMap = loadAllDatabases();
        expect(loadedMap.size).toBe(0);
    })
})