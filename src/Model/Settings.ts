import Peer, {type DataConnection} from "peerjs";
import {useEffect, useState} from "react";

import {PeerjsNetworkAdapter} from "../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import {
    loadDarkModeSetting,
    loadP2PSetting,
    loadSelectedServerURL,
    loadServers,
    loadSynchronizationSettings,
    loadTimeoutLength,
    loadTimeoutSettings,
    storeDarkModeSetting,
    storeP2PSetting,
    storeSelectedServerURL,
    storeServers,
    storeSynchronizationSettings,
    storeTimeoutLength,
    storeTimeoutSettings,
} from "../Utility/Storage.ts";


type SettingsListener = () => void;

export function useSettings() {
    // Local state to force React to re-render
    const [settings, setSettings] = useState(Settings.getSettings());

    useEffect(() => {
        // Subscribe to changes in the Singleton
        const subscribe = Settings.getSettings().subscribe(() => {
            // When notify() is called, we update state to trigger a re-render
            //The code below moves the settings object to a new address in memory, forcing react to rerender it
            //FIXME somehow this should just be able to rerender by increasing a counter or smth but I couldnt do it ~Jesko
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setSettings(Object.assign(Object.create(Object.getPrototypeOf(Settings.getSettings())), Settings.getSettings()));

        });

        return () => subscribe(); // Cleanup on unmount
    }, []);

    return settings;
}

/**
 * The Settings class, implementing a singleton pattern.
 * This guarantess that only one settings object can exist at a time.
 * On the start of the programm the settings get loaded from the local storage
 */
export class Settings {
    private static instance: Settings;
    private _synchronization: boolean;
    private _darkMode: boolean;
    private _timeoutActive: boolean;
    private _timeoutLength: number;
    private peer: Peer;
    private connector: DataConnection;
    private _activeServerUrl: string;
    private _servers: Map<string, string>;
    private _p2p: boolean;
    private p2pAdapter: PeerjsNetworkAdapter;

    private connectorsToAdapters: Map<string, [DataConnection, PeerjsNetworkAdapter]> = new Map();

    private listeners: SettingsListener[] = [];

    private constructor() {
        this._synchronization = loadSynchronizationSettings();
        this._darkMode = loadDarkModeSetting();
        this._timeoutActive = loadTimeoutSettings();
        this._timeoutLength = loadTimeoutLength();
        this._activeServerUrl = loadSelectedServerURL();
        this._servers = loadServers();
        this._p2p = loadP2PSetting();
        this.peer = new Peer();
        this.connector = null as unknown as DataConnection;
        this.p2pAdapter = null as unknown as PeerjsNetworkAdapter;


        //When someone is connecting to this peer, establish the direction in the other way
        this.peer.on('connection', incomingConn => {
            incomingConn.on('open', () => {
                this.setupConnection(incomingConn);
            })
        })
    }

    public static getSettings(): Settings {
        if (this.instance == null) {
            this.instance = new Settings();
        }
        return this.instance;
    }

    public getServerUrl(): string {
        return this._activeServerUrl;
    }


    /**
     * Returns the name of the active Server
     */
    public getActiveServerName(): string {
        for (const [name, url] of this._servers) {
            if (url === this._activeServerUrl) {
                return name;
            }
        }
        return "Unknown Server";
    }

    public setServerUrl(name: string) {
        this._activeServerUrl = this._servers.get(name) || "";
        storeSelectedServerURL(this._activeServerUrl);
        this.notify();
    }

    public getServers(): Map<string, string> {
        return new Map(this._servers);
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
        this._servers = this._servers.delete(server) ? this._servers : this._servers;
        storeServers(this._servers);
    }

    public getP2P(): boolean {
        return this._p2p;
    }

    public setP2PActive(isP2P: boolean) {
        this._p2p = isP2P;
        storeP2PSetting(isP2P);
        this.notify();
    }

    public getP2PAdapter(): PeerjsNetworkAdapter {
        return this.p2pAdapter;
    }

    public getSynchronization(): boolean {
        return this._synchronization;
    }

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
            console.error("unable to disconnect")
        }

        try {
            conn.close();
        } catch {
            console.error("unable to close")
        }
    }
}