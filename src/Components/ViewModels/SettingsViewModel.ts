import {Settings} from "../../Model/Settings";

import {useEffect, useState} from "react";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when changing settings, so that they get applied
 */
export const useSettingsViewModel = () => {

    const settings = Settings.getSettings();

    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [timeoutLength, setTimeoutLength] = useState(settings.getTimeoutLength());
    const [activeTab, setActiveTab] = useState<"general" | "database" | "about">("general");
    const [serverName, setServerName] = useState<string>(settings.getServerName());
    const [servers, setServers] = useState<Map<string, string>>(settings.getServers());
    const [serverNames, setServerNames] = useState<string[]>(Array.from(servers.keys()));
    const [addServerDialogOpen, setAddServerDialogOpen] = useState<boolean>(false);
    const [P2P, setP2P] = useState<boolean>(settings.getP2P());
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
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

    useEffect(() => {
        setServerNames(Array.from(servers.keys()));
    }, [servers]);


    // Update darkMode
    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");
    }

    function toggleSynchronisation() {
        setSynchronisation(!synchronisation);
    }

    function addSyncServer(name: string, url: string) {
        settings.addServer(name, url);
    }

    // Remove a server from the settings
    function removeServer(server: string) {
        settings.removeServer(server);
    }

    // Select a server from the settings
    function selectServer(server: string) {
        settings.setServerUrl(server);
        setServerName(server);
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

    //Increases timeout length by 1 minute
    function increaseTimeout() {
        setTimeOutLengthVM((timeoutLength + 1).toString());
    }

    // Decreases timeout length by 1 minute
    function decreaseTimeout() {
        if(timeoutLength > 1) {
            setTimeOutLengthVM((timeoutLength - 1).toString());
        }
    }

    /**
     * Get own peer id
     */
    function getPeerId() {
        return settings.getPeer().id;
    }

    /**
     * Set the peer id to connect to
     * @param id the id to connect to
     */
    function setConnection(id: string) {
        settings.setConnector(id);
    }

    function toggleP2P() {
        setP2P(!P2P);
        settings.setConnection(!P2P);
    }


    return {
        darkMode,
        synchronisation,
        timeOutActive,
        settingsOpen,
        timeoutLength,
        activeTab,
        serverName,
        addServerDialogOpen,
        serverNames,
        P2P,
        toastMessage,
        showToast,

        setActiveTab,
        setConnection,
        toggleDarkMode,
        toggleSynchronisation,
        toggleTimeOutActive,
        setSettingsOpen,
        setTimeOutLengthVM,
        increaseTimeout,
        decreaseTimeout,
        getPeerId,
        addServer: addSyncServer,
        removeServer,
        setAddServerDialogOpen,
        selectServer,
        toggleP2P,
        setToastMessage,
        setShowToast,
    };
};