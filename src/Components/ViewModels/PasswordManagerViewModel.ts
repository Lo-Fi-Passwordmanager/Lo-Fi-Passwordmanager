import {BroadcastChannelNetworkAdapter, IndexedDBStorageAdapter, Repo, WebSocketClientAdapter} from "@automerge/react";
import {useEffect, useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";
import {useIdleTimer} from "react-idle-timer";
import {Settings} from "../../Model/Settings.ts";

export const usePasswordManagerViewModel = () => {
    const settings = Settings.getSettings();
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const [timeout, setTimeout] = useState(Settings.getSettings().getTimeoutLength() * 60000);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);

    const repo = new Repo({
        network: [new BroadcastChannelNetworkAdapter(),
            new WebSocketClientAdapter("wss://5bcaaf94-60ef-4757-b55c-5f2e443c480c.ka.bw-cloud-instance.org/"),
        ],
        storage: new IndexedDBStorageAdapter(),
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

        getLoggedIn,
        setLoggedIn,
        setAutomergeFacade,
        getAutomergeFacade,
        closeLoggedIn,
        setToastVisible,
    };
}