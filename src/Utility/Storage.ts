import type { AutomergeUrl } from "@automerge/automerge-repo";

// --- Constants ---
export const STORAGE_KEYS = {
    SYNCHRONISATION: "synchronisation",
    DARK_MODE: "dark_mode",
    TIMEOUT_ACTIVE: "timeout_active",
    TIMEOUT_LENGTH: "timeout_length",
    SERVER_LIST: "servers_list",
    SELECTED_SERVER_URLS: "selected_server_urls",
    CURRENT_SORT_CRITERIA: "currentSortCriterion",
    SORT_IS_ASCENDING: "isAscending",
    DATABASES: "databases",
    P2P: "p2p",
    RELEVANCE: "relevance",
    INDIVIDUAL: "individual",
    IS_INDIVIDUAL_SORTING: "is-individual-sorting",
    RECENTLY_USED: "recentlyUsed",
    ACTIVE_COLOR_INDEX: "active_color_index",
    CUSTOM_COLOR: "custom_color",
} as const;

// --- Generic Helpers ---

/**
 * Generic Save: Handles Map-to-Array conversion automatically
 */
export function saveToStorage<T>(key: string, value: T): void {
    const dataToStore = value instanceof Map
        ? Array.from(value.entries())
        : value;
    localStorage.setItem(key, JSON.stringify(dataToStore));
}

/**
 * Generic Load: Handles default values, JSON parsing, and Map hydration
 */
export function getFromStorage<T>(
    key: string,
    defaultValue: T,
    transform?: (parsed: any) => T
): T {
    const raw = localStorage.getItem(key);
    if (raw === null) {
        saveToStorage(key, defaultValue);
        return defaultValue;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(raw);
        return transform ? transform(parsed) : (parsed as T);
    } catch (e) {
        console.error(`Error parsing storage key "${key}":`, e);
        return defaultValue;
    }
}

// Reusable hydration logic
const asMap = <K, V>(data: any) => new Map<K, V>(data);

// --- Database Operations ---

export const loadAllDatabases = () =>
    getFromStorage<Map<string, AutomergeUrl>>(STORAGE_KEYS.DATABASES, new Map(), asMap);

export const saveDatabases = (databases: Map<string, AutomergeUrl>) =>
    saveToStorage(STORAGE_KEYS.DATABASES, databases);

export function storeDatabase(name: string, autoMergeUrl: AutomergeUrl): void {
    const databases = loadAllDatabases();
    databases.set(name, autoMergeUrl);
    saveDatabases(databases);
}

export function removeDatabase(name: string): void {
    const databases = loadAllDatabases();
    databases.delete(name);
    saveDatabases(databases);
}

export function renameDatabase(oldName: string, newName: string): Map<string, AutomergeUrl> {
    const databases = loadAllDatabases();
    const autoMergeUrl = databases.get(oldName);
    if (autoMergeUrl) {
        databases.delete(oldName);
        databases.set(newName, autoMergeUrl);
        saveDatabases(databases);
        return databases;
    }
    throw new Error(`Database with name ${oldName} does not exist.`);
}

// --- Sort & Search Operations ---

export const loadCurrentSortCriterion = () => getFromStorage<string | null>(STORAGE_KEYS.CURRENT_SORT_CRITERIA, null);
export const saveCurrentSortCriterion = (v: string) => saveToStorage(STORAGE_KEYS.CURRENT_SORT_CRITERIA, v);

export const loadIsAscending = () => getFromStorage<boolean | null>(STORAGE_KEYS.SORT_IS_ASCENDING, null);
export const saveIsAscending = (v: boolean) => saveToStorage(STORAGE_KEYS.SORT_IS_ASCENDING, v);

export const loadRelevanceSorting = () =>
    getFromStorage<Map<string, number>>(STORAGE_KEYS.RELEVANCE, new Map(), asMap);

export function addRelevance(itemId: string): void {
    const relevance = loadRelevanceSorting();
    relevance.set(itemId, (relevance.get(itemId) ?? 0) + 1);
    saveToStorage(STORAGE_KEYS.RELEVANCE, relevance);
}

// --- Server Operations ---

export const loadSelectedServerURLs = () =>
    getFromStorage<string[]>(STORAGE_KEYS.SELECTED_SERVER_URLS, [import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL]);

export const storeSelectedServers = (urls: string[]) => saveToStorage(STORAGE_KEYS.SELECTED_SERVER_URLS, urls);

export const loadServers = () =>
    getFromStorage<Map<string, string>>(
        STORAGE_KEYS.SERVER_LIST,
        new Map([[import.meta.env.VITE_DEFAULT_SYNC_SERVER_NAME, import.meta.env.VITE_DEFAULT_SYNC_SERVER_URL]]),
        asMap
    );

export const storeServers = (servers: Map<string, string>) => saveToStorage(STORAGE_KEYS.SERVER_LIST, servers);

// --- Settings & UI ---

export const loadSynchronizationSettings = () => getFromStorage(STORAGE_KEYS.SYNCHRONISATION, true);
export const storeSynchronizationSettings = (v: boolean) => saveToStorage(STORAGE_KEYS.SYNCHRONISATION, v);

export const loadDarkModeSetting = () => getFromStorage(STORAGE_KEYS.DARK_MODE, true);
export const storeDarkModeSetting = (v: boolean) => saveToStorage(STORAGE_KEYS.DARK_MODE, v);

export const loadTimeoutSettings = () => getFromStorage(STORAGE_KEYS.TIMEOUT_ACTIVE, true);
export const storeTimeoutSettings = (v: boolean) => saveToStorage(STORAGE_KEYS.TIMEOUT_ACTIVE, v);

export const loadTimeoutLength = () => getFromStorage(STORAGE_KEYS.TIMEOUT_LENGTH, 10);
export const storeTimeoutLength = (v: number) => saveToStorage(STORAGE_KEYS.TIMEOUT_LENGTH, v);

export const loadP2PSetting = () => getFromStorage(STORAGE_KEYS.P2P, true);
export const storeP2PSetting = (v: boolean) => saveToStorage(STORAGE_KEYS.P2P, v);

export const loadActiveColorIndex = () => getFromStorage(STORAGE_KEYS.ACTIVE_COLOR_INDEX, 0);
export const storeActiveColorIndex = (v: number) => saveToStorage(STORAGE_KEYS.ACTIVE_COLOR_INDEX, v);

export const loadCustomColor = () => getFromStorage(STORAGE_KEYS.CUSTOM_COLOR, "#FFFFFF");
export const storeCustomColor = (v: string) => saveToStorage(STORAGE_KEYS.CUSTOM_COLOR, v);

// --- Individual Sorting ---

export const loadIndividualSorting = () => getFromStorage<Map<string, number>>(STORAGE_KEYS.INDIVIDUAL, new Map(), asMap);
export const storeIndividualSorting = (v: Map<string, number>) => saveToStorage(STORAGE_KEYS.INDIVIDUAL, v);

export const loadIndividualSortingSetting = () => getFromStorage(STORAGE_KEYS.IS_INDIVIDUAL_SORTING, true);
export const storeIndividualSortingSetting = (v: boolean) => saveToStorage(STORAGE_KEYS.IS_INDIVIDUAL_SORTING, v);

// --- Recently Used ---

export const loadRecentlyUsedSorting = () =>
    getFromStorage<Map<string, Date>>(
        STORAGE_KEYS.RECENTLY_USED,
        new Map(),
        (data: [string, string][]) => new Map(data.map(([k, v]) => [k, new Date(v)]))
    );

export function addRecentlyUsed(id: string): void {
    const recently = loadRecentlyUsedSorting();
    recently.set(id, new Date());
    saveToStorage(STORAGE_KEYS.RECENTLY_USED, recently);
}