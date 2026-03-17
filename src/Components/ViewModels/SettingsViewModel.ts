import type {DataConnection} from "peerjs";
import {useEffect, useState} from "react";

import type {PeerjsNetworkAdapter} from "../../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import {Settings, useSettings} from "../../Model/Settings";


/**
 * The type of the Setting Viewmodel
 */
export type SettingsViewModel = {
    darkMode: boolean;
    synchronisation: boolean;
    timeOutActive: boolean;
    settingsOpen: boolean;
    timeoutLength: number;
    activeTab: "general" | "database" | "about";
    addServerDialogOpen: boolean;
    P2P: boolean;
    toastMessage: string;
    showToast: boolean;
    serverUrls: Map<string, string>;
    serverStates: Map<string, boolean>;
    setActiveTab: (value: (((prevState: ("general" | "database" | "about")) => ("general" | "database" | "about")) | "general" | "database" | "about")) => void;
    setConnection: (id: string) => void;
    toggleDarkMode: () => void;
    toggleSynchronisation: () => void;
    toggleTimeOutActive: () => void;
    setSettingsOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    setTimeOutLengthVM: (newLength: string) => void;
    increaseTimeout: () => void;
    decreaseTimeout: () => void;
    getPeerId: () => string;
    addSyncServer: (name: string, url: string) => void;
    removeSyncServer: (serverName: string) => void;
    setAddServerDialogOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    toggleSyncServer: (serverName: string) => void;
    toggleP2P: () => void;
    setToastMessage: (value: (((prevState: string) => string) | string)) => void;
    setShowToast: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    remotePeerId: string;
    setRemotePeerId: (value: (((prevState: string) => string) | string)) => void;
    connectToPeer: () => void;
    otherPeerMap: Map<string, [DataConnection, PeerjsNetworkAdapter]>;
    removePeer: (id: string) => Promise<void>;
    isLastServer: () => boolean;
    isLastActiveServer: (serverName: string) => boolean;
    copyToClipboard: (text: string) => void
}

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when changing settings, so that they get applied
 */
export const useSettingsViewModel: () => SettingsViewModel = () => {

    const settings = Settings.getSettings();
    const settingsHook = useSettings();
    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [timeoutLength, setTimeoutLength] = useState(settings.getTimeoutLength());
    const [activeTab, setActiveTab] = useState<"general" | "database" | "about">("general");
    const [serverUrls, setServerUrls] = useState<Map<string, string>>(settings.getServerUrls());
    const [serverStates, setServerStates] = useState<Map<string, boolean>>(settings.getServerStates());
    const [addServerDialogOpen, setAddServerDialogOpen] = useState<boolean>(false);
    const [P2P, setP2P] = useState<boolean>(settings.getP2P());
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [otherPeerMap, setOtherPeerMap] = useState<Map<string, [DataConnection, PeerjsNetworkAdapter]>>(settings.getConnectorsToAdapters());
    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", darkMode ? "dark" : "light");

    useEffect(() => {
        settings.setDarkMode(darkMode);
        settings.setSynchronization(synchronisation);
        settings.setTimeoutActive(timeOutActive);
        settings.setTimeoutLength(timeoutLength);
    }, [darkMode, synchronisation, timeOutActive, settings, timeoutLength]);

    useEffect(() => {
        const handleUpdate = () => {
            setServerUrls(new Map(settings.getServerUrls()));
            setServerStates(new Map(settings.getServerStates()));
        };

        const unsubscribe = settings.subscribe(handleUpdate);
        return () => {
            unsubscribe();
        };
    }, [settings]);

    const connectorsToAdaptersHook = settingsHook.getConnectorsToAdapters();
    useEffect(() => {
        setOtherPeerMap(connectorsToAdaptersHook);
    }, [connectorsToAdaptersHook]);

    const connectorHook = settingsHook.getConnector();
    useEffect(() => {
        if (connectorHook != null) {
            setRemotePeerId(connectorHook.peer);
        }
    }, [connectorHook]);


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

    function refreshServers() {
        setServerUrls(new Map(settings.getServerUrls()));
        setServerStates(new Map(settings.getServerStates()));
    }

    function isLastServer(): boolean {
        return serverStates.size == 1;
    }

    function isLastActiveServer(serverName: string): boolean {
        const server = serverStates.get(serverName);
        return settings.getActiveServerUrls().length == 1 && !!server;
    }

    // Remove a server from the settings
    function removeSyncServer(serverName: string) {
        const server = serverStates.get(serverName);
        if (settings.getActiveServerUrls().length == 1 && server) {
            console.error("Cannot remove the only active server"); // realisticly this should never happen since the UI shouldnt allow it
            return;
        }
        settings.removeServer(serverName);
        refreshServers();
    }

    function toggleSyncServer(serverName: string) {
        if (serverStates.get(serverName)) {
            settings.deactivateServer(serverName);
        } else {
            settings.activateServer(serverName);
        }

        refreshServers();

        // Toggle synchronisation off and on again to ensure that the new server is connected
        // directly change settings so the UI doenst change
        settings.setSynchronization(false);
        setTimeout(() => {
            settings.setSynchronization(true);
        }, 50); // Timeout is needed to ensure that the synchronisation setting is updated before it is toggled on again
    }

    function toggleTimeOutActive() {
        setTimeOutActive(!timeOutActive);
    }

    //Checks that timeout cant be 0 or less since that causes the whole app to be unusable
    function setTimeOutLengthVM(newLength: string) {
        const length: number = Number(newLength);
        if (length >= 1) {
            setTimeoutLength(length);
        }
    }

    //Increases timeout length by 1 minute
    function increaseTimeout() {
        setTimeOutLengthVM((timeoutLength + 1).toString());
    }

    // Decreases timeout length by 1 minute
    function decreaseTimeout() {
        if (timeoutLength > 1) {
            setTimeOutLengthVM((timeoutLength - 1).toString());
        }
    }

    /**
     * Copy the given text to the clipboard and show a toast message
     */
    function copyToClipboard(text: string) {
        setToastMessage("In die Zwischenablage kopiert");
        setShowToast(true);
        void navigator.clipboard.writeText(text);
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
        settings.addConnector(id);
    }

    function toggleP2P() {
        setP2P(!P2P);
        settings.setP2PActive(!P2P);
    }

    async function removePeer(id: string) {
        await settings.removeConnector(id);
    }


    return {
        darkMode,
        synchronisation,
        timeOutActive,
        settingsOpen,
        timeoutLength,
        activeTab,
        addServerDialogOpen,
        P2P,
        toastMessage,
        showToast,
        serverUrls,
        serverStates,

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
        addSyncServer,
        removeSyncServer,
        setAddServerDialogOpen,
        toggleSyncServer,
        toggleP2P,
        setToastMessage,
        setShowToast,
        remotePeerId,
        setRemotePeerId,
        connectToPeer: () => Settings.getSettings().addConnector(remotePeerId),
        otherPeerMap,
        removePeer,
        isLastServer,
        isLastActiveServer,
        copyToClipboard
    };
};