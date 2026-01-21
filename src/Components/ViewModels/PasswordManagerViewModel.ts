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

export const usePasswordManagerViewModel = () => {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const [synchronization, setSynchronization] = useState<boolean>(localStorage.getItem("synchronization") === "true");

    const initialNetworkAdapters = [
        new BroadcastChannelNetworkAdapter(),
        new WebSocketClientAdapter("wss://5bcaaf94-60ef-4757-b55c-5f2e443c480c.ka.bw-cloud-instance.org/")
    ];

    const [networkAdapters, setNetworkAdapters] = useState<NetworkAdapterInterface[] | undefined>(synchronization ? initialNetworkAdapters : undefined);

    useEffect(() => {
        if (synchronization) {
            // Does not cause cascading renders (apparently) => ignore error
            setNetworkAdapters(initialNetworkAdapters);
        } else {
            setNetworkAdapters(undefined);
        }
    }, [synchronization]);

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

    function setSyncSetting(value: boolean): void {
        setSynchronization(value);
    }

    return {
        repo,
        securityProvider,

        getLoggedIn,
        setLoggedIn,
        setAutomergeFacade,
        getAutomergeFacade,
        closeLoggedIn,
        setSyncSetting
    };
};