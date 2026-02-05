import {useEffect, useState} from "react";
import type {AutomergeFacade} from "../../../Utility/AutomergeFacade.ts";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";

/**
 * The Viewmodel for the {@link HistoryDialog}
 * @param automergeFacade the automergefaced with the database that should be displayed
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