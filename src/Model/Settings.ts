import Peer, {type DataConnection} from "peerjs";
import {useEffect, useState} from "react";

import {PeerjsNetworkAdapter} from "../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import {
    loadDarkModeSetting,
    loadP2PSetting,
    loadSelectedServerURLs,
    loadServers,
    loadSynchronizationSettings,
    loadTimeoutLength,
    loadTimeoutSettings,
    storeDarkModeSetting,
    storeP2PSetting,
    storeSelectedServers,
    storeServers,
    storeSynchronizationSettings,
    storeTimeoutLength,
    storeTimeoutSettings
} from "../Utility/Storage.ts";


type SettingsListener = () => void;

export function useSettings() {
    //This mess below changes the version number of the settings, so that useEffect/observers trigger correctly
    const [_, setVersion] = useState(0);

    useEffect(() => {
        const unsubscribe = Settings.getSettings().subscribe(() => {
            setVersion(v => v + 1); // Force re-render
        });
        return () => unsubscribe();
    }, []);

    return Settings.getSettings();
}

/**
 * The Settings class, implementing a singleton pattern.
 * This guarantess that only one settings object can exist at a time.
 * On the start of the programm the settings get loaded from the local storage
 */
export class Settings {
    private static instance: Settings;
    //This refers to the synchronisation via the server
    private _synchronization: boolean;
    private _darkMode: boolean;
    private _timeoutActive: boolean;
    private _timeoutLength: number;
    private peer: Peer;
    private connector: DataConnection;
    private _activeServerURLs: string[];
    private _servers: Map<string, string>;
    private _p2p: boolean;

    private connectorsToAdapters: Map<string, [DataConnection, PeerjsNetworkAdapter]> = new Map();

    private listeners: SettingsListener[] = [];

    private constructor() {
        this._synchronization = loadSynchronizationSettings();
        this._darkMode = loadDarkModeSetting();
        this._timeoutActive = loadTimeoutSettings();
        this._timeoutLength = loadTimeoutLength();
        this._servers = loadServers();
        this._activeServerURLs = loadSelectedServerURLs();
        this._p2p = loadP2PSetting();
        this.peer = new Peer();
        this.connector = null as unknown as DataConnection;

        // Purge server URLs that are in active list, but not in server list
        const urlsInList = new Set(this._servers.values());
        this._activeServerURLs = this._activeServerURLs.filter((url => urlsInList.has(url)));
        storeSelectedServers(this._activeServerURLs);
        if (this._activeServerURLs.length == 0) {
            this._activeServerURLs = loadSelectedServerURLs();
        }


        //When someone is connecting to this peer, establish the direction in the other way
        this.peer.on("connection", incomingConn => {
            incomingConn.on("open", () => {
                this.setupConnection(incomingConn);
            });
        });
    }

    public static getSettings(): Settings {
        if (this.instance == null) {
            this.instance = new Settings();
        }
        return this.instance;
    }

    public getActiveServerUrls(): string[] {
        return this._activeServerURLs;
    }

    public activateServer(serverName: string) {
        const server = this._servers.get(serverName);
        if (!server) {
            console.error(`Cannot find server ${serverName} in server list`);
            return;
        }
        this._activeServerURLs.push(server);
        storeSelectedServers(this._activeServerURLs);
        this.notify();
    }

    public deactivateServer(serverName: string) {
        const server = this._servers.get(serverName);
        if (!server) {
            console.error(`Cannot find server ${serverName} in server list`);
            return;
        }
        const index = this._activeServerURLs.indexOf(server);
        this._activeServerURLs.splice(index, 1);

        storeSelectedServers(this._activeServerURLs);
        this.notify();
    }

    public getServerUrls(): Map<string, string> {
        return this._servers;
    }

    public getServerStates(): Map<string, boolean> {
        const servers = new Map<string, boolean>();

        for (const [server, url] of this._servers.entries()) {
            servers.set(server, this._activeServerURLs.includes(url));
        }

        return servers;
    }

    /**
     * Adds a new server to the server list, if the name does not already exist
     * @param serverName the name to be stored with the server
     * @param serverUrl the url of the server
     */
    public addServer(serverName: string, serverUrl: string): void {
        if (!this._servers.get(serverName)) {
            this._servers.set(serverName, serverUrl);
            storeServers(this._servers);
            this.notify();
        }
    }

    public removeServer(server: string): void {
        this.deactivateServer(server);
        this._servers.delete(server);
        storeServers(this._servers);
        this.notify();
    }

    public getP2P(): boolean {
        return this._p2p;
    }

    public setP2PActive(isP2P: boolean) {
        this._p2p = isP2P;
        storeP2PSetting(isP2P);
        this.notify();
    }

    public getSynchronization(): boolean {
        return this._synchronization;
    }

    /**
     * Sets the value of synchronisation to the given value. If the its deactivated due to editing, the setting will not be stored in localStorage, so that it is only active for the current session
     * @param value the new value for the synchronisation setting
     * @param editing if true, the synchronisation setting will not be stored in localStorage
     */
    public setSynchronization(value: boolean, editing?: boolean) {
        this._synchronization = value;
        if (!editing) {
            storeSynchronizationSettings(value);
        }
        this.notify();
    }


    public getDarkMode(): boolean {
        return this._darkMode;
    }

    public setDarkMode(value: boolean) {
        this._darkMode = value;
        storeDarkModeSetting(value);
    }

    public getTimeoutActive(): boolean {
        return this._timeoutActive;
    }

    public setTimeoutActive(value: boolean) {
        this._timeoutActive = value;
        storeTimeoutSettings(value);
    }

    public getTimeoutLength(): number {
        return this._timeoutLength;
    }

    /**
     * The idle timeout in Minutes
     * @param length
     */
    public setTimeoutLength(length: number) {
        this._timeoutLength = length;
        storeTimeoutLength(length);
        this.notify();
    }

    subscribe(listener: SettingsListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getPeer() {
        return this.peer;
    }

    /**
     * Connects your own peer to a given id
     * @param id the id to connect to
     */
    public addConnector(id: string) {

        const conn = this.peer.connect(id);

        conn.on("open", () => {
            this.setupConnection(conn);
        });
    }

    /**
     * Removes the Connection to the peer with the given id
     * @param id the id of the other peer
     */
    public async removeConnector(id: string) {
        const entry = this.connectorsToAdapters.get(id);
        if (!entry) return;

        const [conn, adapter] = entry;
        await conn.send({type: "disconnect"});
        // IMPORTANT: notify BEFORE close so Repo removes adapter cleanly
        this.connectorsToAdapters.delete(id);
        this.notify();

        adapter.disconnect();
        conn.close();
    }

    public getConnectorsToAdapters(): Map<string, [DataConnection, PeerjsNetworkAdapter]> {
        return this.connectorsToAdapters;
    }

    public getConnector() {
        return this.connector;
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    /**
     * Starts a new connection with the given connector and also adds the automerge PeerJsAdapter
     * @param conn the connector that the
     */
    private setupConnection(conn: DataConnection) {
        const adapter = new PeerjsNetworkAdapter(conn);

        this.connectorsToAdapters.set(conn.peer, [conn, adapter]);
        this.notify();

        conn.on("data", (data: unknown) => {
            if (data &&
                typeof data === "object" &&
                "type" in data &&
                (data as { type: string }).type === "disconnect"
            ) {
                this.cleanupConnection(conn.peer);
            }
        });

        conn.on("close", () => {
            this.cleanupConnection(conn.peer);
        });
    }

    /**
     * Closes the connection and disconnects the adapter
     * @param peerId the id of the peer on the other side of the connection
     */
    private cleanupConnection(peerId: string) {
        const entry = this.connectorsToAdapters.get(peerId);
        if (!entry) return;

        const [conn, adapter] = entry;

        this.connectorsToAdapters.delete(peerId);
        this.notify();

        try {
            adapter.disconnect();
        } catch {
            console.error("unable to disconnect");
        }

        try {
            conn.close();
        } catch {
            console.error("unable to close");
        }
    }
}