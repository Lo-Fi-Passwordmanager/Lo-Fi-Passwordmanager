import {Settings} from "../../Model/Settings";

import {useEffect, useState} from "react";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useSettingsViewModel = () => {

    const settings = Settings.getSettings();

    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    // not working right now
    //const [autoConflictRes, setAutoConflictRes] = useState(settings.getAutoConflictResolution());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [timeoutLength, setTimeoutLength] = useState(settings.getTimeoutLength());
    const [activeTab, setActiveTab] = useState<"general" | "database" | "about">("general");
    const [serverUrl, setServerUrl] = useState<string>(settings.getServerUrl());
    const [servers, setServers] = useState<string[]>(settings.getServers());
    const [addServerDialogOpen, setAddServerDialogOpen] = useState<boolean>(false);


    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");


    // When darkMode is updated, update settings
    useEffect(() => {
        settings.setDarkMode(darkMode);
        settings.setSynchronization(synchronisation);
        //settings.setAutoConflictResolution(autoConflictRes);
        settings.setTimeoutActive(timeOutActive);
        settings.setTimeoutLength(timeoutLength);
    }, [darkMode, synchronisation,
        //autoConflictRes,
        timeOutActive, settings, timeoutLength]);

    useEffect(() => {
        const handleUpdate = () => {
            setServers(settings.getServers());
        }
        const unsubscribe = settings.subscribe(handleUpdate);
        return () => {
            unsubscribe();
        };
    }, [settings]);


    // Update darkMode
    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");
    }

    function toggleSynchronisation() {
        setSynchronisation(!synchronisation);
    }

    function addServer(url: string) {
        settings.addServer(url);
    }

    function removeServer(server: string) {
        settings.removeServer(server);
    }

    function selectServer(server: string) {
        settings.setServerUrl(server);
        setServerUrl(server);
    }

    /*
    function toggleAutoConflictRes() {
        setAutoConflictRes(!autoConflictRes);
    }*/

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

    function increase() {
        setTimeOutLengthVM((timeoutLength + 1).toString());
    }

    function decrease() {
        if(timeoutLength > 1) {
            setTimeOutLengthVM((timeoutLength - 1).toString());
        }
    }


    return {
        darkMode,
        synchronisation,
        //autoConflictRes,
        timeOutActive,
        settingsOpen,
        timeoutLength,
        activeTab,
        serverUrl,
        servers,
        addServerDialogOpen,

        setActiveTab,
        toggleDarkMode,
        toggleSynchronisation,
        //toggleAutoConflictRes,
        toggleTimeOutActive,
        setSettingsOpen,
        setTimeOutLengthVM,
        increase,
        decrease,
        addServer,
        removeServer,
        setAddServerDialogOpen,
        selectServer,
    };
};