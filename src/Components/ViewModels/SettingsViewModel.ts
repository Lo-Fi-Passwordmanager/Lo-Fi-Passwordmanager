import {Settings} from "../../Model/Settings";

import {useState, useEffect} from 'react';

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useSettingsViewModel = (getSync: (value: boolean) => void) => {

    const settings = Settings.getSettings();

    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    const [autoConflictRes, setAutoConflictRes] = useState(settings.getAutoConflictResolution());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());
    const [settingsOpen, setSettingsOpen] = useState(false);

    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");


    // When darkMode is updated, update settings
    useEffect(() => {
        settings.setDarkMode(darkMode)
        settings.setSynchronization(synchronisation);
        settings.setAutoConflictResolution(autoConflictRes);
        settings.setTimeoutActive(timeOutActive);
    }, [darkMode, synchronisation, autoConflictRes, timeOutActive, settings]);


    // Update darkMode
    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");
    }

    function toggleSynchronisation() {
        setSynchronisation(!synchronisation);
        getSync(!synchronisation);
    }

    function toggleAutoConflictRes() {
        setAutoConflictRes(!autoConflictRes);
    }

    function toggleTimeOutActive() {
        setTimeOutActive(!timeOutActive);
    }


    return {
        darkMode,
        synchronisation,
        autoConflictRes,
        timeOutActive,
        settingsOpen,

        toggleDarkMode,
        toggleSynchronisation,
        toggleAutoConflictRes,
        toggleTimeOutActive,
        setSettingsOpen,
    };
};