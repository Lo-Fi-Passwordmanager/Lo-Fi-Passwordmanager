/**
 * Loads all database names with their automerge id from localStorage
 * @returns map of database names to automerge ids
 *
 * @author uwing
 */
export function loadAllDatabases(): Map<string, string> {
    const raw = localStorage.getItem('databases');
    if (!raw) {
        return new Map();
    }
    try {
        const parsed = new Map(JSON.parse(raw) as [string, string][]);
        return new Map(parsed);
    } catch (e) {
        console.error(e);
        return new Map();
    }
}

/**
 * Saves the database names with their automerge id to localStorage
 * @param databases map of database names to automerge ids
 *
 * @author uwing
 */
export function saveDatabases(databases: Map<string, string>): void {
    const toStore = JSON.stringify(Array.from(databases.entries()));
    localStorage.setItem('databases', toStore);
}