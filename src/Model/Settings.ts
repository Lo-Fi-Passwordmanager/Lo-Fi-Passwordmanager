const SYNCHRONISATION = "synchronisation";
const AUTO_CONFLICT_RESOLUTION = "auto_conflict_resolution";
const DARK_MODE = "dark_mode"
const TIMEOUT_ACTIVE = "timeout_active"
const TIMEOUT_LENGTH = "timeout_length"

type SettingsListener = () => void;

export class Settings {
    private static instance: Settings;
    private _synchronization: boolean;
    private _autoConflictResolution: boolean;
    private _darkMode: boolean;
    private _timeoutActive: boolean;
    private _timeoutLength: number;

    private listeners: SettingsListener[] = [];

    private constructor() {
        //standard settings - think before changing
        const synchronisation = localStorage.getItem(SYNCHRONISATION)
        const autoConflictResolution = localStorage.getItem(AUTO_CONFLICT_RESOLUTION)
        const darkMode = localStorage.getItem(DARK_MODE)
        const timeoutActive = localStorage.getItem(TIMEOUT_ACTIVE)
        const timeoutLength = localStorage.getItem(TIMEOUT_LENGTH);

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
            localStorage.setItem(TIMEOUT_LENGTH, JSON.stringify(1))
            this._timeoutLength = 1;
        }
    }

    public static getSettings(): Settings {
        if (this.instance == null) {
            this.instance = new Settings();
        }
        return this.instance;
    }

    public getSynchronization(): boolean {
        return this._synchronization;
    }

    public setSynchronization(value: boolean) {
        this._synchronization = value;
        localStorage.setItem(SYNCHRONISATION, JSON.stringify(value))
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