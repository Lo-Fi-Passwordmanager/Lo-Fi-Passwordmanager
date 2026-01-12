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

    const settingsModel = Settings.getSettings();

    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settingsModel.getDarkMode());

    // When darkMode is updated, update settingsModel
    useEffect(() => {
        settingsModel.setDarkMode(darkMode)
    }, [darkMode])

    // Update darkMode
    function toggleDarkMode() {
        setDarkMode(!darkMode)
    }


    return {
        darkMode,
        toggleDarkMode
    };
};