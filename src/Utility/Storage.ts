import type {AutomergeUrl} from "@automerge/automerge-repo";

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
export function renameDatabase(oldName: string, newName: string): void {
    const databases = loadAllDatabases();
    const autoMergeUrl = databases.get(oldName);
    if (autoMergeUrl) {
        databases.delete(oldName);
        databases.set(newName, autoMergeUrl);
        saveDatabases(databases);
    } else {
        console.warn(`Database with name ${oldName} does not exist.`);
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