import {expect, it, describe, beforeEach, afterEach} from "vitest";


import {AutomergeUrl} from "@automerge/automerge-repo";
import {
    loadAllDatabases, loadCurrentSortCriterion, loadIsAscending,
    removeDatabase,
    saveCurrentSortCriterion,
    saveDatabases, saveIsAscending,
    storeDatabase
} from "../../src/Utility/Storage";

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

    it('should be able to correctly store a Database',()=> {
        saveDatabases(testMap);
        storeDatabase("TestDB2", "automerge-id-2" as AutomergeUrl);
        const reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(2);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
    })

    it('Should be able to remove a Database correctly', ()=> {
        storeDatabase("TestDB2", "automerge-id-2" as AutomergeUrl);
        let reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(1);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
        removeDatabase("TestDB2");
        reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(0);
    })

    it('should be able to store/and get sorting criteria', ()=> {
        saveCurrentSortCriterion("date");
        expect(loadCurrentSortCriterion()).toBe("date");
    })

    it('should be able to store if the items are sorted ascending', ()=> {
        expect(loadIsAscending()).toBe(null);
        saveIsAscending(false)
        expect(loadIsAscending()).toBe(false);
        saveIsAscending(true)
        expect(loadIsAscending()).toBe(true);
    })

})