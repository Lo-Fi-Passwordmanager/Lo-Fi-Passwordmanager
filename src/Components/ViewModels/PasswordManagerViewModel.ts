import {
    BroadcastChannelNetworkAdapter,
    IndexedDBStorageAdapter,
    type NetworkAdapterInterface,
    Repo,
    WebSocketClientAdapter
} from "@automerge/react";
import {useEffect, useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import {useIdleTimer} from "react-idle-timer";
import {Settings, useSettings} from "../../Model/Settings.ts";
import {PeerjsNetworkAdapter} from "automerge-repo-network-peerjs";

/**
 * The view model used by the PasswordManagerView. Manages the state and logic for the password manager.
 */
export const usePasswordManagerViewModel = () => {
    const settings = useSettings();
    const [connector] = useState(settings.getConnector());
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const timeout = Settings.getSettings().getTimeoutLength() * 60000;
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [openedDatabaseName, setOpenedDatabaseName] = useState<string>("");

    const [peerJsAdapter, setPeerJsAdapter] = useState<PeerjsNetworkAdapter>(new PeerjsNetworkAdapter(connector));

    /*
    const initialNetworkAdapters = [
        new BroadcastChannelNetworkAdapter(),
        new WebSocketClientAdapter(settings.getServerUrl()),
    ];

    const initialP2PNetworkAdapter = [
        new BroadcastChannelNetworkAdapter(),
        peerJsAdapter,
    ] */

    function getNetworkAdapters(): NetworkAdapterInterface[] | undefined {
        const networkAdapters: NetworkAdapterInterface[] = [new BroadcastChannelNetworkAdapter()];

        if (settings.getSynchronization()) {
            networkAdapters.push(new WebSocketClientAdapter(settings.getServerUrl()))
        }
        if (settings.getP2P()) {
            networkAdapters.push(settings.getP2PAdapter());
            console.log(settings.getP2PAdapter());
        }
        return networkAdapters;
    }

    const [networkAdapters, setNetworkAdapters] = useState<NetworkAdapterInterface[] | undefined>(getNetworkAdapters());
    useEffect(() => {
        // Does not cause cascading renders (apparently) => ignore error
        setPeerJsAdapter(new PeerjsNetworkAdapter(settings.getConnector()));
        setNetworkAdapters(getNetworkAdapters());
        console.log(getNetworkAdapters())
    }, [settings]);


    const repo = new Repo({
        network: networkAdapters,
        storage:
            new IndexedDBStorageAdapter()
    });

    function getAutomergeFacade(): AutomergeFacade | null {
        return automergeFacade;
    }

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
        return settings.getServerName();
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