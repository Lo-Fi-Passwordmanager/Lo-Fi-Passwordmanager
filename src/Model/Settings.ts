import {useEffect, useState} from "react";
import {
    loadDarkModeSetting,
    loadSelectedServerURL,
    loadServers,
    loadSynchronizationSettings,
    loadTimeoutLength,
    loadTimeoutSettings,
    storeSynchronizationSettings,
    storeDarkModeSetting,
    storeSelectedServerURL,
    storeServers,
    storeTimeoutLength,
    storeTimeoutSettings, loadP2PSetting, storeP2PSetting,
} from "../Utility/Storage.ts";
import Peer, {type DataConnection} from "peerjs";
import {PeerjsNetworkAdapter} from "automerge-repo-network-peerjs";


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
    private _serverUrl: string;
    private _servers: Map<string, string>;
    private _p2p: boolean;
    private p2pAdapter: PeerjsNetworkAdapter;

    private listeners: SettingsListener[] = [];

    private constructor() {
        this._synchronization = loadSynchronizationSettings();
        this._darkMode = loadDarkModeSetting();
        this._timeoutActive = loadTimeoutSettings();
        this._timeoutLength = loadTimeoutLength();
        this._serverUrl = loadSelectedServerURL();
        this._servers = loadServers();
        this._p2p = loadP2PSetting();
        this.peer = new Peer();
        this.connector = this.peer.connect("");
        this.p2pAdapter = new PeerjsNetworkAdapter(this.connector);


        //When someone is connecting to this peer, establish the direction in the other way
        this.peer.on('connection', incomingConn => {
            incomingConn.on('open', () => {
                this.p2pAdapter = new PeerjsNetworkAdapter(incomingConn);
                console.log("Versuche zurück zu verbinden")
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
        return this._serverUrl;
    }

    public getServerName(): string {
        for (const [name, url] of this._servers) {
            if (url === this._serverUrl) {
                return name;
            }
        }
        return "Unknown Server";
    }

    public setServerUrl(name: string) {
        this._serverUrl = this._servers.get(name) || "";
        storeSelectedServerURL(this._serverUrl);
        this.notify();
    }

    public getServers(): Map<string, string> {
        return new Map(this._servers);
    }

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
        this.notify();
    }

    public getP2P(): boolean {
        return this._p2p;
    }

    public setConnection(isP2P: boolean) {
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

    public setSynchronization(value: boolean) {
        this._synchronization = value;
        storeSynchronizationSettings(value);
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
    public setConnector(id: string) {

        this.peer.connect(id);
        this.peer.on('open', () => {
            const conn = this.peer.connect(id)
            this.p2pAdapter = new PeerjsNetworkAdapter(conn);
        })

        this.connector = this.peer.connect(id);
        this.notify();
    }

    public getConnector() {
        return this.connector;
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}