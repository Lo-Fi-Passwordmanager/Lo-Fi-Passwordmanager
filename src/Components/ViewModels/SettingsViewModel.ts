import {Settings} from "../../Model/Settings";

// export class SettingsViewModel {
//     private settingsInstance: Settings;
//
//     constructor() {
//         this.settingsInstance =  Settings.getSettings();
//     }
//
//     public toggleSynchronisation() {
//         this.settingsInstance.synchronization = !this.settingsInstance.synchronization;
//     }
//
//     public toggleAutoConflictRes() {
//         this.settingsInstance.autoConflictResolution = !this.settingsInstance.autoConflictResolution;
//     }
//
//     public toggleDarkMode() {
//         this.settingsInstance.darkMode = !this.settingsInstance.darkMode;
//     }
//
//     public toggleTimeout() {
//         this.settingsInstance.timeoutActive = !this.settingsInstance.timeoutActive;
//     }
//
//     public get synchronization(): boolean {
//         return this.settingsInstance.synchronization;
//     }
//
//     public get autoConflictResolution(): boolean {
//         return this.settingsInstance.autoConflictResolution;
//     }
//
//     public get darkMode(): boolean {
//         return this.settingsInstance.darkMode;
//     }
//
//     public get timeoutActive(): boolean {
//         return this.settingsInstance.timeoutActive;
//     }
// }

import { useState, useEffect } from 'react';

export const useSettingsViewModel = () => {

    const settings = Settings.getSettings();

    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    const [autoConclictRes, setAutoConflictRes] = useState(settings.getAutoConflictResolution());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());

    document.getElementById("root")?.setAttribute("data-theme", darkMode ? "dark" : "light");

    // When darkMode is updated, update settings
    useEffect(() => {
        settings.setDarkMode(darkMode)
        settings.setSynchronization(synchronisation);
        settings.setAutoConflictResolution(autoConclictRes);
        settings.setTimeoutActive(timeOutActive);
    }, [darkMode, synchronisation, autoConclictRes, timeOutActive]);


    // Update darkMode
    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.getElementById("root")?.setAttribute("data-theme", darkMode ? "dark" : "light");
    }
    function toggleSynchronisation() {
        setSynchronisation(!synchronisation);
    }
    function toggleAutoConclictRes() {
        setAutoConflictRes(!autoConclictRes);
    }
    function toggleTimeOutActive() {
        setTimeOutActive(!timeOutActive);
    }


    return {
        darkMode,
        synchronisation,
        autoConclictRes,
        timeOutActive,

        toggleDarkMode,
        toggleSynchronisation,
        toggleAutoConclictRes,
        toggleTimeOutActive,
    };
};