export class Settings {
    private static instance: Settings;
    private _synchronization: boolean;
    private _autoConflictResolution: boolean;
    private _darkMode: boolean;
    private _timeoutActive: boolean;

    private constructor() {
        //standard settings - think before changing
        this._synchronization = true;
        this._autoConflictResolution = true;
        this._darkMode = true;
        this._timeoutActive = true;
    }

    public static getSettings(): Settings {
        if (this.instance == null) {
            this.instance = new Settings();
        }
        return this.instance;
    }

    public get synchronization(): boolean {
        return this._synchronization;
    }

    public set synchronization(value: boolean) {
        this._synchronization = value;
    }

    public get autoConflictResolution(): boolean {
        return this._autoConflictResolution;
    }

    public set autoConflictResolution(value: boolean) {
        this._autoConflictResolution = value;
    }

    public get darkMode(): boolean {
        return this._darkMode;
    }

    public set darkMode(value: boolean) {
        this._darkMode = value;
    }

    public get timeoutActive(): boolean {
        return this._timeoutActive;
    }

    public set timeoutActive(value: boolean) {
        this._timeoutActive = value;
    }
}