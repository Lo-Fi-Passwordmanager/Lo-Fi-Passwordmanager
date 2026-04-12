import {decodeChange, getActorId} from "@automerge/automerge";
import {
    BroadcastChannelNetworkAdapter,
    type DocHandle,
    type DocHandleChangePayload,
    getChanges,
    getObjectId,
    IndexedDBStorageAdapter,
    type NetworkAdapterInterface,
    Repo,
    WebSocketClientAdapter
} from "@automerge/react";
import {useEffect, useState} from "react";
import {useIdleTimer} from "react-idle-timer";

import {useToast} from "./Provider/ToastProviderViewModel.ts";
import {PeerjsNetworkAdapter} from "../../customNetworkAdapter/PeerJsNetworkAdapter.ts";
import type {AutomergeDoc} from "../../Model/Automerge/AutomergeDoc.ts";
import type {Item} from "../../Model/Item.ts";
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
    const [openedDatabaseName, setOpenedDatabaseName] = useState<string>("");
    const [oldP2PSize, setOldP2PSize] = useState<number>(settings.getConnectorsToAdapters().size);
    const [justSynced, setJustSynced] = useState<boolean>(false);
    const [itemsDeleted, setItemsDeleted] = useState<string[]>([]);
    const [toImportItems, setToImportItems] = useState<Item[]>([]);

    const syncEnabled = settings.getSynchronization();
    const p2pEnabled = settings.getP2P();
    const connectorsSize = settings.getConnectorsToAdapters().size;
    const connectorAdapter = settings.getConnectorsToAdapters();
    const servers = settings.getActiveServerUrls();

    const [repo] = useState(new Repo({
        network: [new BroadcastChannelNetworkAdapter()],
        storage: new IndexedDBStorageAdapter()
    }));

    const [showToast, removeToast] = useToast();

    //Whenever something about the synchronisation happens, the old adapters get removed and new ones get added.
    //This enables the repo to be kept as state while still changing the adapters
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
            for (const url of servers) {
                repo.networkSubsystem.addNetworkAdapter(
                    new WebSocketClientAdapter(url)
                );
            }
        }

        if (p2pEnabled) {
            for (const adapter of connectorAdapter.values()) {
                if (!repo.networkSubsystem.adapters.includes(adapter[1])) {
                    repo.networkSubsystem.addNetworkAdapter(adapter[1]);
                }
            }
        }

    }, [syncEnabled, p2pEnabled, connectorsSize, connectorAdapter, repo.networkSubsystem, servers]);


    useEffect(() => {
        if (connectorsSize > oldP2PSize) {
            showToast("Neue PeerToPeer Verbindung aufgebaut.");
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOldP2PSize(connectorsSize);
    }, [connectorsSize, oldP2PSize, showToast]);

    // recognize changes from remote
    useEffect(() => {
        if (!automergeFacade) return;
        if (!automergeFacade.automergeURL) return;

        let handle: DocHandle<AutomergeDoc> | null = null;

        const handleRemoteChange = (payload: DocHandleChangePayload<AutomergeDoc>) => {
            const localActorId = getActorId(payload.doc);
            const remoteDeleted: string[] = [];

            const newChanges = getChanges(payload.patchInfo.before, payload.patchInfo.after);

            const changesFromRemote = newChanges.some(change => {
                const decoded = decodeChange(change);
                return decoded.actor !== localActorId;
            });

            if (!changesFromRemote) {
                return;
            }

            // check if remote change was a deletion so if the cur item was deleted it can be unselected
            const prevDoc = payload.patchInfo.before;

            for (const patch of payload.patches) {
                if (patch.action === "del") {
                    const index = patch.path[1] as number;
                    const prevItem = prevDoc.items[index];
                    if (prevItem && typeof prevItem === "object") {
                        remoteDeleted.push(getObjectId(prevItem)!);
                    }
                }
            }
            setItemsDeleted(remoteDeleted);

            setJustSynced(true);
            setTimeout(() => {
                setJustSynced(false);
            }, 3000);
        };

        const setupListener = async () => {
            try {
                handle = await repo.find(automergeFacade.automergeURL!);

                handle.on("change", handleRemoteChange);
            } catch (error) {
                console.error(error);
            }
        };

        void setupListener();

        return () => {
            if (handle && typeof handleRemoteChange === "function") {
                handle.off("change", handleRemoteChange);
            }
        };
    }, [automergeFacade, itemsDeleted, repo]);


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

    const [toastId, setToastId] = useState<number>(-1);

    const onIdle = () => {
        if (Settings.getSettings().getTimeoutActive() && loggedIn) {
            closeLoggedIn();
            removeToast(toastId);
            const id = showToast("Der Nutzer wurde auf Grund von Inaktivität automatisch abgemeldet.", -1);
            setToastId(id);
        }
    };

    const onAction = () => {
        if (toastId >= 0) {
            removeToast(toastId);
            setToastId(-1);
        }
    };

    const idleTimer = useIdleTimer({timeout, onIdle, onAction, debounce: 100});


    useEffect(() => {
        idleTimer.reset();
    }, [idleTimer, timeout]);

    return {
        repo,
        securityProvider,
        openedDatabaseName,
        loggedIn,
        justSynced,
        itemsDeleted,
        toImportItems,
        setToImportItems,
        setOpenedDatabaseName,
        setLoggedIn,
        setAutomergeFacade,
        getAutomergeFacade,
        closeLoggedIn
    };
};