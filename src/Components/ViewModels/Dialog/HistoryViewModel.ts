import {useEffect, useState} from "react";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useHistoryViewModel = (automergeFacade: AutomergeFacade) => {


    const [automergeHistory, setHistory] = useState<HistoryEntry[] | null>(null);

    async function loadHistory(): Promise<void> {
        const newHistory = await automergeFacade.getHistory();
        setHistory(newHistory);
    }

    const [historyOpen, setHistoryOpen] = useState(false);

    useEffect(() => {
        if (historyOpen) {
            loadHistory();
        }
    }, [historyOpen]);

    return {
        historyOpen,
        history,
        setHistoryOpen,
        automergeHistory
    };
};