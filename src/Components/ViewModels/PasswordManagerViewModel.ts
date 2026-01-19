import {BroadcastChannelNetworkAdapter, IndexedDBStorageAdapter, Repo, WebSocketClientAdapter} from "@automerge/react";
import {useEffect, useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";

export const usePasswordManagerViewModel = () => {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());
    const [synchronization, setSynchronization] = useState<boolean>(localStorage.getItem("synchronization") === "true");
    
    const repo = new Repo({
        network: [
            new BroadcastChannelNetworkAdapter(),
            new WebSocketClientAdapter("wss://5bcaaf94-60ef-4757-b55c-5f2e443c480c.ka.bw-cloud-instance.org/"),
        ],
        storage: 
            new IndexedDBStorageAdapter(),
    });

    useEffect(() => {
        try {
            if (synchronization) {
                repo.networkSubsystem.reconnect();
            } else {
                repo.networkSubsystem.disconnect();
            }
        } catch (error) {
            console.error("Error toggling synchronization:", error);
        }
    }, [repo.networkSubsystem, synchronization]);

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

    function getSyncSetting(value: boolean): void {
        setSynchronization(false);
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
        getSyncSetting,
    };
}