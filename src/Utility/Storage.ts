import type {AutomergeUrl} from "@automerge/automerge-repo";

const SYNCHRONISATION = "synchronisation";
const DARK_MODE = "dark_mode"
const TIMEOUT_ACTIVE = "timeout_active"
const TIMEOUT_LENGTH = "timeout_length"

/**
 * Loads all database names with their automerge url from localStorage
 *
 * @returns map of database names to automerge urls
 */
export function loadAllDatabases(): Map<string, AutomergeUrl> {
    const rawDatabases = localStorage.getItem('databases');
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
    localStorage.setItem('databases', toStore);
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
    return localStorage.getItem('currentSortCriterion');
}

/**
 * Saves the current sort criterion to localStorage
 *
 * @param criterion the current sort criterion
 */
export function saveCurrentSortCriterion(criterion: string): void {
    localStorage.setItem('currentSortCriterion', criterion);
}

/**
 * Loads the isAscending flag from localStorage
 *
 * @returns the isAscending flag or null if not set
 */
export function loadIsAscending(): boolean | null {
    const value = localStorage.getItem('isAscending');
    if (value === null) {
        return null;
    }
    return value === 'true';
}

/**
 * Saves the isAscending flag to localStorage
 *
 * @param isAscending the isAscending flag
 */
export function saveIsAscending(isAscending: boolean): void {
    localStorage.setItem('isAscending', isAscending.toString());
}

/**
 * Gets the selected server URL from localStorage, or stores and returns the default if not present
 *
 * @returns the selected server URL
 */
export function loadSelectedServerURL(): string {
    const url = localStorage.getItem("server_url");
    if (url) {
        return url;
    } else {
        localStorage.setItem("server_url", "wss://sync.automerge.org")
        return "wss://sync.automerge.org";
    }
}

/**
 * Loads the list of servers from localStorage, or stores and returns the default list if not present
 *
 * @returns a map of server names to URLs
 */
export function loadServers(): Map<string, string> {
    const serverList = localStorage.getItem("servers_list");
    if (serverList) {
        const servers = new Map<string, string>();
        JSON.parse(serverList).forEach(([name, url]: [string, string]) => {
            servers.set(name, url);
        });
        return servers;
    } else {
        const defaultServers = new Map<string, string>([
            ["Automerge Sync Server", "wss://sync.automerge.org"]
        ]);
        localStorage.setItem("servers_list", JSON.stringify(Array.from(defaultServers.entries())));
        return defaultServers;
    }
}

/** stores the selected server URL in localStorage
 *
 * @param url the server URL to store
 */
export function storeSelectedServerURL(url: string): void {
    localStorage.setItem("server_url", url);
}

/** stores the list of servers in localStorage
 *
 * @param servers a map of server names to URLs
 */
export function storeServers(servers: Map<string, string>): void {
    localStorage.setItem("servers_list", JSON.stringify(Array.from(servers.entries())));
}

/**
 * Loads the boolean for the synchronization setting from localStorage or stores and returns the default if not present
 *
 * @returns the synchronization setting
 */
export function loadSynchronizationSettings(): boolean {
    const synchronisation = localStorage.getItem(SYNCHRONISATION);
    if (synchronisation) {
        return JSON.parse(synchronisation);
    } else {
        localStorage.setItem(SYNCHRONISATION, JSON.stringify(true))
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
        return JSON.parse(darkMode);
    } else {
        localStorage.setItem(DARK_MODE, JSON.stringify(true))
        return true
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
        return JSON.parse(timeoutActive);
    } else {
        localStorage.setItem(TIMEOUT_ACTIVE, JSON.stringify(true))
        return true
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
        return JSON.parse(timeoutLength);
    } else {
        localStorage.setItem(TIMEOUT_LENGTH, JSON.stringify(10))
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
    return localStorage.getItem("p2p") === "true";
}

/**
 * stores the boolean for the P2P setting in localStorage
 *
 * @param isP2P the P2P boolean to store
 */
export function storeP2PSetting(isP2P: boolean): void {
    localStorage.setItem("p2p", isP2P.toString());
}