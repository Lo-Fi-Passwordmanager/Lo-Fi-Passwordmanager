import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";


import {AutomergeUrl} from "@automerge/automerge-repo";
import {
    loadAllDatabases,
    loadCurrentSortCriterion,
    loadDarkModeSetting,
    loadIsAscending,
    loadP2PSetting,
    loadSelectedServerURLs,
    loadServers,
    loadTimeoutLength,
    loadTimeoutSettings,
    removeDatabase,
    renameDatabase,
    saveCurrentSortCriterion,
    saveDatabases,
    saveIsAscending,
    storeDatabase,
    storeSelectedServers,
    storeServers
} from "../../src/Utility/Storage";

const testMap = new Map<string, AutomergeUrl>();

describe("PasswordManagerViewModel", () => {
    beforeEach(() => {
        const url1: AutomergeUrl = "automerge-id-1" as AutomergeUrl;
        testMap.set("TestDB1", url1);
    });

    afterEach(() => {
        localStorage.clear();
        testMap.clear();
    });

    it("should load saved databases from localStorage", () => {
        saveDatabases(testMap);
        expect(loadAllDatabases()).toEqual(testMap);
    });

    it("should save an edited map of databases to localStorage", () => {
        saveDatabases(testMap);
        const loadedMap = loadAllDatabases();
        loadedMap.set("TestDB2", "automerge-id-2" as AutomergeUrl);
        saveDatabases(loadedMap);
        const reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(2);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
    });

    it("should return an empty map if no databases are stored", () => {
        const loadedMap = loadAllDatabases();
        expect(loadedMap.size).toBe(0);
    });

    it("should be able to correctly store a Database", () => {
        saveDatabases(testMap);
        storeDatabase("TestDB2", "automerge-id-2" as AutomergeUrl);
        const reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(2);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
    });

    it("Should be able to remove a Database correctly", () => {
        storeDatabase("TestDB2", "automerge-id-2" as AutomergeUrl);
        let reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(1);
        expect(reloadedMap.get("TestDB2")).toBe("automerge-id-2");
        removeDatabase("TestDB2");
        reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(0);
    });

    it("should be able to store/and get sorting criteria", () => {
        saveCurrentSortCriterion("date");
        expect(loadCurrentSortCriterion()).toBe("date");
    });

    it("should be able to store if the items are sorted ascending", () => {
        expect(loadIsAscending()).toBe(null);
        saveIsAscending(false);
        expect(loadIsAscending()).toBe(false);
        saveIsAscending(true);
        expect(loadIsAscending()).toBe(true);
    });

    it("should be able to rename a database", () => {
        storeDatabase("oldName", "automerge-id" as AutomergeUrl);
        let reloadedMap = loadAllDatabases();
        expect(reloadedMap.size).toBe(1);
        expect(reloadedMap.get("oldName")).toBe("automerge-id");
        renameDatabase("oldName", "newName");
        reloadedMap = loadAllDatabases();
        expect(reloadedMap.get("newName")).toBe("automerge-id");
    });

    it("Should throw if attempting to rename a database that doesnt exist", () => {
        expect(() => renameDatabase("oldName", "newName")).toThrow("Database with name oldName does not exist.");
    });

    it("should be able to load and save servers", () => {
        localStorage.setItem("servers_list", JSON.stringify([["server", "wss://server1.com"]]));
        const servers = loadServers();
        expect(servers).toEqual(new Map<string, string>([["server", "wss://server1.com"]]));
        servers.set("server2", "wss://server2.com");
        storeServers(servers);
        const storedServers = localStorage.getItem("servers_list");
        expect(storedServers).toBe(JSON.stringify([["server", "wss://server1.com"], ["server2", "wss://server2.com"]]));
    });

    it("should return the default server list if no servers are stored", () => {
        const servers = loadServers();
        // @ts-ignore
        expect(servers).toStrictEqual(new Map<string, string>([[import.meta.env.VITE_DEFAULT_SYNC_SERVER_NAME, import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL]]));
    });

    it("should be able to load and save the selected server URL", () => {
        localStorage.setItem("selected_server_urls", "[\"wss://server1.com\"]");
        expect(loadSelectedServerURLs()).toStrictEqual(["wss://server1.com"]);
        storeSelectedServers(["wss://server1.com", "wss://server2.com"]);
        expect(localStorage.getItem("selected_server_urls")).toStrictEqual("[\"wss://server1.com\",\"wss://server2.com\"]");
    });

    it("should return the default server URL if no URL is stored", () => {
        // @ts-ignore
        expect(loadSelectedServerURLs()).toStrictEqual([import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL]);
        // @ts-ignore
        expect(localStorage.getItem("selected_server_urls")).toBe(`["${import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL}"]`);
    });

    it("should log an error and return an empty map if the databases are not stored in the correct format", () => {
        localStorage.setItem("databases", "not a valid JSON");
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const loadedMap = loadAllDatabases();
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
        expect(loadedMap.size).toBe(0);
        consoleErrorSpy.mockRestore();
    });

    it("should return the stored option for dark mode", () => {
        expect(localStorage.getItem("dark_mode")).toBeNull();
        localStorage.setItem("dark_mode", "true");
        expect(loadDarkModeSetting()).toBe(true);
        localStorage.setItem("dark_mode", "false");
        expect(loadDarkModeSetting()).toBe(false);
    });

    it("should return the storedoption for timeout active", () => {
        expect(localStorage.getItem("timeout_active")).toBeNull();
        localStorage.setItem("timeout_active", "true");
        expect(loadTimeoutSettings()).toBe(true);
        localStorage.setItem("timeout_active", "false");
        expect(loadTimeoutSettings()).toBe(false);
    });

    it("should return the stored option for timeout length", () => {
        expect(localStorage.getItem("timeout_length")).toBeNull();
        localStorage.setItem("timeout_length", "300000");
        expect(loadTimeoutLength()).toBe(300000);
        localStorage.setItem("timeout_length", "600000");
        expect(loadTimeoutLength()).toBe(600000);
    });

    it("should return the stored option for P2P enabled", () => {
        expect(localStorage.getItem("p2p_enabled")).toBeNull();
        localStorage.setItem("p2p", "true");
        expect(loadP2PSetting()).toBe(true);
        localStorage.setItem("p2p", "false");
        expect(loadP2PSetting()).toBe(false);
    });
});