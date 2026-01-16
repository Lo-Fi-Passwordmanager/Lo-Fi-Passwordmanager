import {useLoginViewModel} from "./UseLoginViewModel.ts";
import {BroadcastChannelNetworkAdapter, IndexedDBStorageAdapter, Repo, WebSocketClientAdapter} from "@automerge/react";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import {useState} from "react";

export const usePasswordManagerViewModel = () => {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);


    const repo = new Repo({
        network: [new BroadcastChannelNetworkAdapter(),
            new WebSocketClientAdapter("wss://5bcaaf94-60ef-4757-b55c-5f2e443c480c.ka.bw-cloud-instance.org/"),
        ],
        storage: new IndexedDBStorageAdapter(),
    });

    const loginViewModel = useLoginViewModel(repo);

    function getLoggedIn(): boolean {
        return loggedIn;
    }

    function setLoggedIn(loggedIn: boolean): void {
        setLoggedIn(loggedIn);
    }

    return {
        repo,
        getLoggedIn,
        setLoggedIn,
    };
}

/**
 * Loads all database names with their automerge url from localStorage
 * @returns map of database names to automerge urls
 *
 * @author uwing
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
 * @param databases map of database names to automerge urls
 *
 * @author uwing
 */
export function saveDatabases(databases: Map<string, AutomergeUrl>): void {
    const toStore = JSON.stringify(Array.from(databases.entries()));
    localStorage.setItem('databases', toStore);
}

/**
 * Stores a database name with its automerge url to localStorage
 * @param name the name of the database
 * @param autoMergeUrl the automerge url of the database
 *
 * @author uwing
 */
export function storeDatabase(name: string, autoMergeUrl: AutomergeUrl): void {
    const databases = loadAllDatabases();
    databases.set(name, autoMergeUrl);
    saveDatabases(databases);
}