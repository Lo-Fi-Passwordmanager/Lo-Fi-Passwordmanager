import {Settings} from "../../Model/Settings";

import {useEffect, useState} from "react";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useSettingsViewModel = (setSync: (value: boolean) => void) => {

    const settings = Settings.getSettings();

    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    const [autoConflictRes, setAutoConflictRes] = useState(settings.getAutoConflictResolution());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [timeoutLength, setTimeoutLength] = useState(settings.getTimeoutLength());

    setSync(synchronisation);

    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");


    // When darkMode is updated, update settings
    useEffect(() => {
        settings.setDarkMode(darkMode);
        settings.setSynchronization(synchronisation);
        settings.setAutoConflictResolution(autoConflictRes);
        settings.setTimeoutActive(timeOutActive);
        settings.setTimeoutLength(timeoutLength);
    }, [darkMode, synchronisation, autoConflictRes, timeOutActive, settings, timeoutLength]);


    // Update darkMode
    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");
    }

    function toggleSynchronisation() {
        setSynchronisation(!synchronisation);
        setSync(!synchronisation);
    }

    function toggleAutoConflictRes() {
        setAutoConflictRes(!autoConflictRes);
    }

    function toggleTimeOutActive() {
        setTimeOutActive(!timeOutActive);
    }
    //Checks that timeout cant be 0 or less since that causes the whole app to be unusable
    function setTimeOutLengthVM(newLength: string) {
        const length:number = Number(newLength);
        if(length >= 1) {
            setTimeoutLength(length);
        }
    }


    return {
        darkMode,
        synchronisation,
        autoConflictRes,
        timeOutActive,
        settingsOpen,
        timeoutLength,

        toggleDarkMode,
        toggleSynchronisation,
        toggleAutoConflictRes,
        toggleTimeOutActive,
        setSettingsOpen,
        setTimeOutLengthVM,
    };
};