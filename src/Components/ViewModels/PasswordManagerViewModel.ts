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
import Peer from "peerjs";
import {PeerjsNetworkAdapter} from "automerge-repo-network-peerjs";

export const usePasswordManagerViewModel = () => {
    const [peer, setPeer] = useState(new Peer("GubiFortnite"));
    const [connector] = useState(peer.connect("Fortnite"))

    const settings = useSettings();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const [timeout, setTimeout] = useState(Settings.getSettings().getTimeoutLength() * 60000);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [synchronization] = useState<boolean>(settings.getSynchronization());
    const [openedDatabaseName, setOpenedDatabaseName] = useState<string>("");

    peer.on("connection", (conn) => {
        conn.on("data", (data) => {
            // Will print 'hi!'
            console.log("data:" + data);
        });
        conn.on("open", () => {
            conn.send("open");
        });
    });

    const initialNetworkAdapters = [
        new BroadcastChannelNetworkAdapter(),
        new WebSocketClientAdapter("wss://5bcaaf94-60ef-4757-b55c-5f2e443c480c.ka.bw-cloud-instance.org/"),
        new PeerjsNetworkAdapter(connector)
    ];

    const [networkAdapters, setNetworkAdapters] = useState<NetworkAdapterInterface[] | undefined>(synchronization ? initialNetworkAdapters : undefined);

    useEffect(() => {
        if (settings.getSynchronization()) {
            // Does not cause cascading renders (apparently) => ignore error
            setNetworkAdapters(initialNetworkAdapters);
        } else {
            setNetworkAdapters(undefined);
        }
    }, [settings]);

    const repo = new Repo({
        network: networkAdapters,
        storage:
            new IndexedDBStorageAdapter()
    });

    function getLoggedIn(): boolean {
        return loggedIn;
    }

    function getAutomergeFacade(): AutomergeFacade | null {
        return automergeFacade;
    }

    function closeLoggedIn(): void {
        setLoggedIn(false);
        setAutomergeFacade(null);
        securityProvider.clearKey();
    }

    const onIdle = () => {
        if(Settings.getSettings().getTimeoutActive() && loggedIn) {
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

    const idleTimer = useIdleTimer({timeout, onIdle, onActive, debounce: 100})

    useEffect(() => {
        if (loggedIn) {
            idleTimer.reset()
        }
    },[idleTimer, loggedIn, timeout]);

    useEffect(() => {
        return settings.subscribe(() => {
            setTimeout(settings.getTimeoutLength() * 60000);
        });
    }, [settings]);

    return {
        repo,
        securityProvider,
        toastMessage,
        toastVisible,
        openedDatabaseName,
        setOpenedDatabaseName,
        getLoggedIn,
        setLoggedIn,
        setAutomergeFacade,
        getAutomergeFacade,
        closeLoggedIn,
        setToastVisible,
    };
};