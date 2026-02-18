import {
    BroadcastChannelNetworkAdapter,
    IndexedDBStorageAdapter,
    type NetworkAdapterInterface,
    Repo,
    WebSocketClientAdapter
} from "@automerge/react";
import {useEffect, useState} from "react";
import {useIdleTimer} from "react-idle-timer";

import {PeerjsNetworkAdapter} from "../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import {Settings, useSettings} from "../../Model/Settings.ts";
import type {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";

/**
 * The view model used by the PasswordManagerView. Manages the state and logic for the password manager.
 */
export const usePasswordManagerViewModel = () => {
    const settings = useSettings();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const timeout = Settings.getSettings().getTimeoutLength() * 60000;
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [openedDatabaseName, setOpenedDatabaseName] = useState<string>("");


    const [repo] = useState(new Repo({
        network: [new BroadcastChannelNetworkAdapter()],
        storage: new IndexedDBStorageAdapter(),
    }));

    //Whenever something about the synchronisation happens, the old adapters get removed and new ones get added.
    //This enables the repo the be kept as state while still changing the adapters
    useEffect(() => {
        const removeArray: NetworkAdapterInterface[] = [];

        for (const adapter of repo.networkSubsystem.adapters) {
            if (!settings.getSynchronization() && adapter instanceof WebSocketClientAdapter) {
                removeArray.push(adapter);
            }else if (!settings.getP2P() && adapter instanceof PeerjsNetworkAdapter) {
                removeArray.push(adapter);
            } else if (adapter instanceof PeerjsNetworkAdapter && !settings.getConnectorsToAdapters().has(adapter.getPeerId())) {
                removeArray.push(adapter);
            }
        }
        for (const adapter of removeArray) {
            repo.networkSubsystem.removeNetworkAdapter(adapter);
        }

        if (settings.getSynchronization() && !repo.networkSubsystem.adapters.some(a => a instanceof WebSocketClientAdapter)) {
            repo.networkSubsystem.addNetworkAdapter(
                new WebSocketClientAdapter(settings.getServerUrl())
            );
        }

        for (const adapter of settings.getConnectorsToAdapters().values()) {
            if (!repo.networkSubsystem.adapters.includes(adapter[1])) {
                repo.networkSubsystem.addNetworkAdapter(adapter[1]);
            }
        }

        console.log(repo.networkSubsystem.adapters);

    }, [settings.getSynchronization(), settings.getP2P(), settings.getConnectorsToAdapters().size]);

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
    }

    const onActive = () => {
        if (toastVisible) {
            setToastVisible(false);
        }
    }

    function getSync(): string | null {
        return settings.getSynchronization() ? "server" : (settings.getP2P() ? "p2p" : null);
    }

    function getServerName(): string {
        return settings.getActiveServerName();
    }

    const idleTimer = useIdleTimer({timeout, onIdle, onActive, debounce: 100})


    useEffect(() => {
        if (loggedIn) {
            idleTimer.reset()
        }
    }, [timeout]);

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