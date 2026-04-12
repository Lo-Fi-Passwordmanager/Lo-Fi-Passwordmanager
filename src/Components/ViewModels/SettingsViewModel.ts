import type {DataConnection} from "peerjs";
import {type ChangeEventHandler, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

import {useToast} from "./Provider/ToastProviderViewModel.ts";
import type {PeerjsNetworkAdapter} from "../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import {Settings, useSettings} from "../../Model/Settings";
import {loadActiveColorIndex, loadCustomColor, storeActiveColorIndex, storeCustomColor} from "../../Utility/Storage.ts";


/**
 * The type of the Setting Viewmodel
 */
export type SettingsViewModel = ReturnType<typeof useSettingsViewModel>

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when changing settings, so that they get applied
 */
export const useSettingsViewModel = () => {

export const useSettingsViewModel = () => {
    const CUSTOM_COLOR_NAME = "custom_color";
    const settings = Settings.getSettings();
    const settingsHook = useSettings();
    // Reactive state to store values during runtime
    const [darkMode, setDarkMode] = useState(settings.getDarkMode());
    const [synchronisation, setSynchronisation] = useState(settings.getSynchronization());
    const [timeOutActive, setTimeOutActive] = useState(settings.getTimeoutActive());
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [timeoutLength, setTimeoutLength] = useState(settings.getTimeoutLength());
    const [activeTab, setActiveTab] = useState<"general" | "appearance" | "database" | "about">("general");
    const [serverUrls, setServerUrls] = useState<Map<string, string>>(settings.getServerUrls());
    const [serverStates, setServerStates] = useState<Map<string, boolean>>(settings.getServerStates());
    const [addServerDialogOpen, setAddServerDialogOpen] = useState<boolean>(false);
    const [P2P, setP2P] = useState<boolean>(settings.getP2P());
    const [recursiveDelete, setRecursiveDelete] = useState<boolean>(settings.getRecursiveDelete());
    //On connecting to a remote peer, this is the id that will be used, if no other argument is given
    const [remotePeerId, setRemotePeerId] = useState("");
    const [otherPeerMap, setOtherPeerMap] = useState<Map<string, [DataConnection, PeerjsNetworkAdapter]>>(settings.getConnectorsToAdapters());
    const [customColor, setUpCustomColor] = useState<string>(loadCustomColor());
    const colorSchemes = new Map<string, string>([["Lo-Fi Green", "#306844"],
        ["Fern", "#477831"],
        ["Dusk", "#5C80BC"],
        ["Cherry", "#B80053"],
        ["Sakura", "#e86a89"],
        ["Sunflower", "#F1B42F"],
        ["Granite", "#848482"],
        [CUSTOM_COLOR_NAME, customColor],]);
    const [activeColorIndex, setActiveColorIndex] = useState<number>(loadActiveColorIndex());
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    document.documentElement.style.setProperty("--color", Array.from(colorSchemes.values())[activeColorIndex]);

    const [showToast, _] = useToast();

    const { i18n, t } = useTranslation();
    const handleLanguageChange: ChangeEventHandler<HTMLSelectElement, HTMLSelectElement> =  (e) => {
        void i18n.changeLanguage(e.target.value);
    };

    useEffect(() => {
        settings.setDarkMode(darkMode);
        settings.setSynchronization(synchronisation);
        settings.setTimeoutActive(timeOutActive);
        settings.setTimeoutLength(timeoutLength);
        settings.setRecursiveDelete(recursiveDelete);
    }, [darkMode, synchronisation, timeOutActive, settings, timeoutLength, recursiveDelete]);

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

    function toggleRecursiveDelete() {
        setRecursiveDelete(!recursiveDelete);
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

    function changeColorScheme(index: number) {
        setActiveColorIndex(index);
        storeActiveColorIndex(index);
    }

    function toggleTimeOutActive() {
        setTimeOutActive(!timeOutActive);
    }

    //Checks that timeout cant be 0 or less since that causes the whole app to be unusable
    function setTimeOutLengthVM(newLength: string) {
        const length: number = Number(newLength);
        setTimeoutLength(Math.min(1000, Math.max(length, 1)));
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
        showToast(t("common.copied_clipboard"));
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

    function connectToPeer(id?: string) {
        Settings.getSettings().addConnector(id ?? remotePeerId);
    }

    function setCustomColor(color: string) {
        setUpCustomColor(color);
        colorSchemes.set(CUSTOM_COLOR_NAME, color);
        storeCustomColor(color);
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
        showToast,
        serverUrls,
        serverStates,
        activeColorIndex,
        colorSchemes,
        customColor,

        setCustomColor,
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
        remotePeerId,
        setRemotePeerId,
        connectToPeer,
        otherPeerMap,
        removePeer,
        isLastServer,
        isLastActiveServer,
        copyToClipboard,
        changeColorScheme,
        toggleRecursiveDelete,
        recursiveDelete,
        handleLanguageChange
    };
};