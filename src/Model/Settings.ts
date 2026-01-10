class Settings {
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

    get synchronization(): boolean {
        return this._synchronization;
    }

    set synchronization(value: boolean) {
        this._synchronization = value;
    }

    get autoConflictResolution(): boolean {
        return this._autoConflictResolution;
    }

    set autoConflictResolution(value: boolean) {
        this._autoConflictResolution = value;
    }

    get darkMode(): boolean {
        return this._darkMode;
    }

    set darkMode(value: boolean) {
        this._darkMode = value;
    }

    get timeoutActive(): boolean {
        return this._timeoutActive;
    }

    set timeoutActive(value: boolean) {
        this._timeoutActive = value;
    }
}