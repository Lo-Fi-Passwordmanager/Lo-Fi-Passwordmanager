import {
    BroadcastChannelNetworkAdapter,
    IndexedDBStorageAdapter,
    type NetworkAdapterInterface,
    Repo,
    WebSocketClientAdapter
} from "@automerge/react";
import {useEffect, useState} from "react";
import {useIdleTimer} from "react-idle-timer";

import {PeerjsNetworkAdapter} from "../../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import {Settings, useSettings} from "../../Model/Settings.ts";
import type {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";

/**
 * The view model used by the PasswordManagerView. Manages the state and logic for the password manager.
 */
export const usePasswordManagerViewModel = () => {
    const settings = useSettings();
    const [loggedIn, setLogedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const timeout = Settings.getSettings().getTimeoutLength() * 60000;
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [openedDatabaseName, setOpenedDatabaseName] = useState<string>("");
    const [oldP2PSize, setOldP2PSize] = useState<number>(settings.getConnectorsToAdapters().size);

    function setLoggedIn(value: boolean) {
        setLogedIn(value);
    }

    const [repo] = useState(new Repo({
        network: [new BroadcastChannelNetworkAdapter()],
        storage: new IndexedDBStorageAdapter()
    }));

    const syncEnabled = settings.getSynchronization();
    const p2pEnabled = settings.getP2P();
    const connectorsSize = settings.getConnectorsToAdapters().size;
    const connectorAdapter = settings.getConnectorsToAdapters();
    const serverUrl = settings.getServerUrl();
    //Whenever something about the synchronisation happens, the old adapters get removed and new ones get added.
    //This enables the repo the be kept as state while still changing the adapters
    useEffect(() => {
        const removeArray: NetworkAdapterInterface[] = [];

        for (const adapter of repo.networkSubsystem.adapters) {
            if (!syncEnabled && adapter instanceof WebSocketClientAdapter) {
                removeArray.push(adapter);
            } else if (!p2pEnabled && adapter instanceof PeerjsNetworkAdapter) {
                removeArray.push(adapter);
            } else if (adapter instanceof PeerjsNetworkAdapter && !connectorAdapter.has(adapter.getPeerId())) {
                removeArray.push(adapter);
            }
        }
        for (const adapter of removeArray) {
            repo.networkSubsystem.removeNetworkAdapter(adapter);
        }

        if (syncEnabled && !repo.networkSubsystem.adapters.some(a => a instanceof WebSocketClientAdapter)) {
            repo.networkSubsystem.addNetworkAdapter(
                new WebSocketClientAdapter(serverUrl)
            );
        }

        if (p2pEnabled) {
            for (const adapter of connectorAdapter.values()) {
                if (!repo.networkSubsystem.adapters.includes(adapter[1])) {
                    repo.networkSubsystem.addNetworkAdapter(adapter[1]);
                }
            }
        }

    }, [syncEnabled, p2pEnabled, connectorsSize, connectorAdapter, repo.networkSubsystem, serverUrl]);


    useEffect(() => {
        if (connectorsSize > oldP2PSize) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToastMessage("Neue PeerToPeer Verbindung aufgebaut.");
            setToastVisible(true);
            setTimeout(() => {
                setToastVisible(false);
            }, 3000);
        }
        setOldP2PSize(connectorsSize);
    }, [connectorsSize, oldP2PSize]);

    function getAutomergeFacade(): AutomergeFacade | null {
        return automergeFacade;
    }

    /**
     * This closes the Passwordview and loggs out the user
     */
    function closeLoggedIn(): void {
        setLoggedIn(false);
        setAutomergeFacade(null);
        securityProvider.clearKey();
    }

    const onIdle = () => {
        if (Settings.getSettings().getTimeoutActive() && loggedIn) {
            closeLoggedIn();
            setToastMessage("Der Nutzer wurde auf Grund von Inaktivität automatisch abgemeldet.");
            setToastVisible(true);
        }
    };

    const onActive = () => {
        if (toastVisible) {
            setToastVisible(false);
        }
    };

    function getSync(): string | null {
        return settings.getSynchronization() ? "server" : (settings.getP2P() ? "p2p" : null);
    }

    function getServerName(): string {
        return settings.getActiveServerName();
    }

    const idleTimer = useIdleTimer({timeout, onIdle, onActive, debounce: 100});


    useEffect(() => {
        idleTimer.reset();
    }, [idleTimer, timeout]);

    return {
        repo,
        securityProvider,
        toastMessage,
        toastVisible,
        openedDatabaseName,
        loggedIn,
        setOpenedDatabaseName,
        setLoggedIn,
        setAutomergeFacade,
        getAutomergeFacade,
        closeLoggedIn,
        setToastVisible,
        getSync,
        getServerName
    };
};