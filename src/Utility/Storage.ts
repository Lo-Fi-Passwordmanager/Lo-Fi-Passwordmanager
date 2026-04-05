import type {AutomergeUrl} from "@automerge/automerge-repo";

const SYNCHRONISATION = "synchronisation";
const DARK_MODE = "dark_mode";
const TIMEOUT_ACTIVE = "timeout_active";
const TIMEOUT_LENGTH = "timeout_length";
const SERVER_LIST = "servers_list";
const SELECTED_SERVER_URLS = "selected_server_urls";
const CURRENT_SORT_CRITERIA = "currentSortCriterion";
const SORT_IS_ASCENDING = "isAscending";

/**
 * Loads all database names with their automerge url from localStorage
 *
 * @returns map of database names to automerge urls
 */
export function loadAllDatabases(): Map<string, AutomergeUrl> {
    const rawDatabases = localStorage.getItem("databases");
    if (!rawDatabases) {
        return new Map();
    }
    try {
        const parsedDatabases = new Map(JSON.parse(rawDatabases) as [string, AutomergeUrl][]);
        return new Map(parsedDatabases);
    } catch (e) {
        console.error(e);
        return new Map();
    }
}

/**
 * Saves the database names with their automerge url to localStorage
 *
 * @param databases map of database names to automerge urls
 */
export function saveDatabases(databases: Map<string, AutomergeUrl>): void {
    const toStore = JSON.stringify(Array.from(databases.entries()));
    localStorage.setItem("databases", toStore);
}

/**
 * Stores a database name with its automerge url to localStorage
 *
 * @param name the name of the database
 * @param autoMergeUrl the automerge url of the database
 */
export function storeDatabase(name: string, autoMergeUrl: AutomergeUrl): void {
    const databases = loadAllDatabases();
    databases.set(name, autoMergeUrl);
    saveDatabases(databases);
}

/**
 * Renames a database in localStorage
 *
 * @param oldName the current name of the database
 * @param newName the new name of the database
 */
export function renameDatabase(oldName: string, newName: string): Map<string, AutomergeUrl> {
    const databases = loadAllDatabases();
    const autoMergeUrl = databases.get(oldName);
    if (autoMergeUrl) {
        databases.delete(oldName);
        databases.set(newName, autoMergeUrl);
        saveDatabases(databases);
        return databases;
    } else {
        throw new Error(`Database with name ${oldName} does not exist.`);
    }
}

/**
 * Removes a database name and its automerge url from localStorage
 *
 * @param name the name of the database to remove
 */
export function removeDatabase(name: string): void {
    const databases = loadAllDatabases();
    databases.delete(name);
    saveDatabases(databases);
}

/**
 * Loads the current sort criterion from localStorage
 *
 * @returns the current sort criterion or null if not set
 */
export function loadCurrentSortCriterion(): string | null {
    return localStorage.getItem(CURRENT_SORT_CRITERIA);
}

/**
 * Saves the current sort criterion to localStorage
 *
 * @param criterion the current sort criterion
 */
export function saveCurrentSortCriterion(criterion: string): void {
    localStorage.setItem(CURRENT_SORT_CRITERIA, criterion);
}


/**
 * Loads the isAscending flag from localStorage
 *
 * @returns the isAscending flag or null if not set
 */
export function loadIsAscending(): boolean | null {
    const value = localStorage.getItem(SORT_IS_ASCENDING);
    if (value === null) {
        return null;
    }
    return value === "true";
}

/**
 * Saves the isAscending flag to localStorage
 *
 * @param isAscending the isAscending flag
 */
export function saveIsAscending(isAscending: boolean): void {
    localStorage.setItem(SORT_IS_ASCENDING, isAscending.toString());
}

/**
 * Gets the selected server URL from localStorage, or stores and returns the default if not present
 *
 * @returns the selected server URL
 */
export function loadSelectedServerURLs(): string[] {
    const urls = localStorage.getItem(SELECTED_SERVER_URLS);
    if (urls) {
        return JSON.parse(urls) as string[];
    } else {
        localStorage.setItem(SELECTED_SERVER_URLS, JSON.stringify([import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL]));
        return [import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL];
    }
}

/**
 * Loads the list of servers from localStorage, or stores and returns the default list if not present
 *
 * @returns a map of server names to URLs
 */
export function loadServers(): Map<string, string> {
    const serverList = localStorage.getItem(SERVER_LIST);
    if (serverList) {
        const servers = new Map<string, string>();
        (JSON.parse(serverList) as [[name: string, url: string]]).forEach(([name, url]: [string, string]) => {
            servers.set(name, url);
        });
        return servers;
    } else {
        const defaultServers = new Map<string, string>([
            [import.meta.env.VITE_DEFAULT_SYNC_SERVER_NAME, import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL]
        ]);
        storeServers(defaultServers);
        return defaultServers;
    }
}

/** Stores the selected servers urls in localStorage
 *
 * @param serverURLs the server URLs to store
 */
export function storeSelectedServers(serverURLs: string[]): void {
    localStorage.setItem(SELECTED_SERVER_URLS, JSON.stringify(serverURLs));
}

/** stores the list of servers in localStorage
 *
 * @param servers a map of server names to URLs
 */
export function storeServers(servers: Map<string, string>): void {
    localStorage.setItem(SERVER_LIST, JSON.stringify(Array.from(servers.entries())));
}

/**
 * Loads the boolean for the synchronization setting from localStorage or stores and returns the default if not present
 *
 * @returns the synchronization setting
 */
export function loadSynchronizationSettings(): boolean {
    const synchronisation = localStorage.getItem(SYNCHRONISATION);
    if (synchronisation) {
        return JSON.parse(synchronisation) as boolean;
    } else {
        localStorage.setItem(SYNCHRONISATION, JSON.stringify(true));
        return true;
    }
}

/** stores the boolean for the synchronization setting in localStorage
 *
 * @param value the synchronization setting to store
 */
export function storeSynchronizationSettings(value: boolean): void {
    localStorage.setItem(SYNCHRONISATION, JSON.stringify(value));
}

/**
 * Loads the boolean for the dark mode setting from localStorage or stores and returns the default if not present
 *
 * @returns the dark mode setting
 */
export function loadDarkModeSetting(): boolean {
    const darkMode = localStorage.getItem(DARK_MODE);
    if (darkMode) {
        return JSON.parse(darkMode) as boolean;
    } else {
        localStorage.setItem(DARK_MODE, JSON.stringify(true));
        return true;
    }
}

/**
 * stores the boolean for the dark mode setting in localStorage
 *
 * @param value the dark mode setting to store
 */
export function storeDarkModeSetting(value: boolean): void {
    localStorage.setItem(DARK_MODE, JSON.stringify(value));
}

/**
 * Loads the boolean for the timeout active setting from localStorage or stores and returns the default if not present
 *
 * @returns the timeout active setting
 */
export function loadTimeoutSettings(): boolean {
    const timeoutActive = localStorage.getItem(TIMEOUT_ACTIVE);
    if (timeoutActive) {
        return JSON.parse(timeoutActive) as boolean;
    } else {
        localStorage.setItem(TIMEOUT_ACTIVE, JSON.stringify(true));
        return true;
    }
}

/**
 * stores the boolean for the timeout active setting in localStorage
 *
 * @param value the timeout active setting to store
 */
export function storeTimeoutSettings(value: boolean): void {
    localStorage.setItem(TIMEOUT_ACTIVE, JSON.stringify(value));
}

/**
 * Loads the timeout length from localStorage or stores and returns the default if not present
 *
 * @returns the timeout length
 */
export function loadTimeoutLength(): number {
    const timeoutLength = localStorage.getItem(TIMEOUT_LENGTH);
    if (timeoutLength != null) {
        return JSON.parse(timeoutLength) as number;
    } else {
        localStorage.setItem(TIMEOUT_LENGTH, JSON.stringify(10));
        return 10;
    }
}

/**
 * stores the timeout length in localStorage
 *
 * @param length the timeout length to store
 */
export function storeTimeoutLength(length: number): void {
    localStorage.setItem(TIMEOUT_LENGTH, JSON.stringify(length));
}

/**
 * Loads the boolean for the P2P setting from localStorage
 *
 * @returns the P2P setting
 */
export function loadP2PSetting(): boolean {
    const p2p = localStorage.getItem("p2p");
    if (p2p != null) {
        return JSON.parse(p2p) as boolean;
    } else {
        localStorage.setItem("p2p", JSON.stringify(true));
        return true;
    }
}

/**
 * stores the boolean for the P2P setting in localStorage
 *
 * @param isP2P the P2P boolean to store
 */
export function storeP2PSetting(isP2P: boolean): void {
    localStorage.setItem("p2p", JSON.stringify(isP2P));
}

/**
 * Loads a map with item ids to their relevance
 */
export function loadRelevanceSorting(): Map<string, number> {
    const rawRelevance = localStorage.getItem("relevance");
    if (!rawRelevance) {
        return new Map();
    }
    try {
        const parsedRelevance = new Map(JSON.parse(rawRelevance) as [string, number][]);
        return new Map(parsedRelevance);
    } catch (e) {
        console.error(e);
        return new Map();
    }
}

/**
 * Increases the relevance of an item by 1
 * @param itemId the id of  the item
 */
export function addRelevance(itemId: string): void {
    const relevance = loadRelevanceSorting();
    const currentRelevance = relevance.get(itemId) ?? 0;
    relevance.set(itemId, currentRelevance + 1);
    localStorage.setItem("relevance", JSON.stringify(Array.from(relevance.entries())));
}

/**
 * Loads a map with ids to their sorting index
 */
export function loadIndividualSorting(): Map<string, number> {
    const rawIndividuals = localStorage.getItem("individual");
    if (!rawIndividuals) {
        return new Map();
    }
    try {
        const parsedIndividuals = new Map(JSON.parse(rawIndividuals) as [string, number][]);
        return new Map(parsedIndividuals);
    } catch (e) {
        console.error(e);
        return new Map();
    }
}

/**
 * Stores the individual sorting map in localStorage
 *
 * @param newSorting the map with ids to their sorting index to store
 */
export function storeIndividualSorting(newSorting: Map<string, number>): void {
    localStorage.setItem("individual", JSON.stringify(Array.from(newSorting.entries())));
}

/**
 * Loads the setting for individual sorting from localStorage or stores and returns the default if not present
 */
export function loadIndividualSortingSetting(): boolean {
    const rawIndividual  = localStorage.getItem("is-individual-sorting");
    if (!rawIndividual) {
        storeIndividualSortingSetting(true);
        return true;
    }
    try {
        return JSON.parse(rawIndividual) as boolean;
    } catch (e) {
        console.error(e);
        storeIndividualSortingSetting(true);
        return true;
    }
}

/**
 * Stores the new setting for individual sorting to the localstorage
 * @param isIndividual the new setting
 */
export function storeIndividualSortingSetting(isIndividual: boolean): void {
    localStorage.setItem("is-individual-sorting", JSON.stringify(isIndividual));
}