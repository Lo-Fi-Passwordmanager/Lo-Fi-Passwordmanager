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
            setSettings(Object.assign(Object.create(Object.getPrototypeOf(Settings.getSettings())), Settings.getSettings()));

        });

        return () => subscribe(); // Cleanup on unmount
    }, []);

    return settings;
}


export class Settings {
    private static instance: Settings;
    private _synchronization: boolean;
    private _darkMode: boolean;
    private _timeoutActive: boolean;
    private _timeoutLength: number;
    private _serverUrl: string;
    private _servers: Map<string, string>;

    private listeners: SettingsListener[] = [];

    private constructor() {
        this._synchronization = loadSynchronizationSettings();
        this._darkMode = loadDarkModeSetting();
        this._timeoutActive = loadTimeoutSettings();
        this._timeoutLength = loadTimeoutLength();
        this._serverUrl = loadSelectedServerURL();
        this._servers = loadServers();

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

    private notify() {
        this.listeners.forEach(l => l());
    }
}