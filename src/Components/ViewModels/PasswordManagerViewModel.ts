import {BroadcastChannelNetworkAdapter, IndexedDBStorageAdapter, Repo, WebSocketClientAdapter} from "@automerge/react";
import {useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {SecurityProvider} from "../../Utility/Security/SecurityProvider.ts";

export const usePasswordManagerViewModel = () => {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [automergeFacade, setAutomergeFacade] = useState<AutomergeFacade | null>(null);
    const [securityProvider] = useState(() => new SecurityProvider());

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

    return {
        repo,
        securityProvider,
        getLoggedIn,
        setLoggedIn,
        setAutomergeFacade,
        getAutomergeFacade,
        closeLoggedIn,
    };
}