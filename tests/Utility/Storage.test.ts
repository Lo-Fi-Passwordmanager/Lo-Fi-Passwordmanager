import {expect, it, describe, beforeEach, afterEach} from "vitest";


import {AutomergeUrl} from "@automerge/automerge-repo";
import {
    loadAllDatabases, loadCurrentSortCriterion, loadIsAscending,
    removeDatabase, renameDatabase,
    saveCurrentSortCriterion,
    saveDatabases, saveIsAscending,
    storeDatabase, loadServers, loadSelectedServerURL, storeServers, storeSelectedServerURL
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

    it('should be able to rename a database', ()=> {
        storeDatabase("oldName", "automerge-id" as AutomergeUrl);
        let reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(1);
        expect(reloadedMap.get("oldName")).toBe("automerge-id");
        renameDatabase("oldName", "newName");
        reloadedMap = loadAllDatabases();
        expect(reloadedMap.get("newName")).toBe("automerge-id");
    });

    it('Should throw if attempting to rename a database that doesnt exist', ()=> {
        expect(() => renameDatabase("oldName", "newName")).toThrow("Database with name oldName does not exist.");
    })

    it('should be able to load and save servers', () => {
        localStorage.setItem("servers_list", JSON.stringify([["server", "wss://server1.com"]]));
        const servers = loadServers();
        expect(servers).toEqual(new Map<string, string>([["server", "wss://server1.com"]]));
        servers.set("server2", "wss://server2.com");
        storeServers(servers);
        const storedServers = localStorage.getItem("servers_list");
        expect(storedServers).toBe(JSON.stringify([["server", "wss://server1.com"], ["server2", "wss://server2.com"]]));
    });

    it('should return the default server list if no servers are stored', () => {
        const servers = loadServers();
        expect(servers).toEqual(new Map<string, string>([["Automerge Sync Server", "wss://sync.automerge.org"]]));
    });

    it('should be able to load and save the selected server URL', () => {
        localStorage.setItem("server_url", "wss://server1.com");
        expect(loadSelectedServerURL()).toBe("wss://server1.com");
        storeSelectedServerURL("wss://server2.com");
        expect(localStorage.getItem("server_url")).toBe("wss://server2.com");
    });

    it ('should return the default server URL if no URL is stored', () => {
        expect(loadSelectedServerURL()).toBe("wss://sync.automerge.org");
        expect(localStorage.getItem("server_url")).toBe("wss://sync.automerge.org");
    });
})