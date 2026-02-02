import {useEffect, useState} from "react";

const SYNCHRONISATION = "synchronisation";
const AUTO_CONFLICT_RESOLUTION = "auto_conflict_resolution";
const DARK_MODE = "dark_mode"
const TIMEOUT_ACTIVE = "timeout_active"
const TIMEOUT_LENGTH = "timeout_length"

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


export class Settings {
    private static instance: Settings;
    private _synchronization: boolean;
    private _autoConflictResolution: boolean;
    private _darkMode: boolean;
    private _timeoutActive: boolean;
    private _timeoutLength: number;
    private _serverUrl: string;
    private _servers: Map<string, string>;

    private listeners: SettingsListener[] = [];

    private constructor() {
        //standard settings - think before changing
        const synchronisation = localStorage.getItem(SYNCHRONISATION)
        const autoConflictResolution = localStorage.getItem(AUTO_CONFLICT_RESOLUTION)
        const darkMode = localStorage.getItem(DARK_MODE)
        const timeoutActive = localStorage.getItem(TIMEOUT_ACTIVE)
        const timeoutLength = localStorage.getItem(TIMEOUT_LENGTH);
        const serverUrl = localStorage.getItem("server_url");
        const servers = localStorage.getItem("servers_list");

        if (serverUrl) {
            this._serverUrl = serverUrl;
        } else {
            localStorage.setItem("server_url", "wss://sync.automerge.org")
            this._serverUrl = "wss://sync.automerge.org"
        }

        if (servers) {
            this._servers = new Map<string, string>();
            JSON.parse(servers).forEach(([name, url]: [string, string]) => {
                this._servers.set(name, url);
            });
        } else {
            const defaultServers = new Map<string, string>([
                ["Automerge Sync Server", "wss://sync.automerge.org"]
            ]);
            localStorage.setItem("servers_list", JSON.stringify(Array.from(defaultServers.entries())));
            this._servers = defaultServers;
        }

        if (synchronisation) {
            this._synchronization = JSON.parse(synchronisation);
        } else {
            localStorage.setItem(SYNCHRONISATION, JSON.stringify(true))
            this._synchronization = true
        }

        if (autoConflictResolution) {
            this._autoConflictResolution = JSON.parse(autoConflictResolution);
        } else {
            localStorage.setItem(AUTO_CONFLICT_RESOLUTION, JSON.stringify(true))
            this._autoConflictResolution = true
        }

        if (darkMode) {
            this._darkMode = JSON.parse(darkMode);
        } else {
            localStorage.setItem(DARK_MODE, JSON.stringify(true))
            this._darkMode = true
        }

        if (timeoutActive) {
            this._timeoutActive = JSON.parse(timeoutActive);
        } else {
            localStorage.setItem(TIMEOUT_ACTIVE, JSON.stringify(true))
            this._timeoutActive = true
        }

        if (timeoutLength != null) {
            this._timeoutLength = JSON.parse(timeoutLength);
        } else {
            localStorage.setItem(TIMEOUT_LENGTH, JSON.stringify(10))
            this._timeoutLength = 10;
        }
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
        localStorage.setItem("server_url", this._serverUrl);
        this.notify();
    }

    public getServers(): Map<string, string> {
        return new Map(this._servers);
    }

    public addServer(serverName: string, serverUrl: string): void {
        if (!this._servers.get(serverName)) {
            this._servers.set(serverName, serverUrl);
            localStorage.setItem("servers_list", JSON.stringify(Array.from(this._servers.entries())));
            this.notify();
        }
    }

    public removeServer(server: string): void {
        this._servers = this._servers.delete(server) ? this._servers : this._servers;
        localStorage.setItem("servers_list", JSON.stringify(Array.from(this._servers.entries())));
        this.notify();
    }

    public getSynchronization(): boolean {
        return this._synchronization;
    }

    public setSynchronization(value: boolean) {
        this._synchronization = value;
        localStorage.setItem(SYNCHRONISATION, JSON.stringify(value));
        this.notify();
    }

    public getAutoConflictResolution(): boolean {
        return this._autoConflictResolution;
    }

    public setAutoConflictResolution(value: boolean) {
        this._autoConflictResolution = value;
        localStorage.setItem(AUTO_CONFLICT_RESOLUTION, JSON.stringify(value))
    }

    public getDarkMode(): boolean {
        return this._darkMode;
    }

    public setDarkMode(value: boolean) {
        this._darkMode = value;
        localStorage.setItem(DARK_MODE, JSON.stringify(value))
    }

    public getTimeoutActive(): boolean {
        return this._timeoutActive;
    }

    public setTimeoutActive(value: boolean) {
        this._timeoutActive = value;
        localStorage.setItem(TIMEOUT_ACTIVE, JSON.stringify(value))
    }

    public getTimeoutLength(): number {
        return this._timeoutLength;
    }

    public setTimeoutLength(length: number) {
        this._timeoutLength = length;
        localStorage.setItem(TIMEOUT_LENGTH, JSON.stringify(length));
        this.notify();
    }

    subscribe(listener: SettingsListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}