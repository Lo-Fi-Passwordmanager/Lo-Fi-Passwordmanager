import {useState} from "react";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useHistoryViewModel = () => {

    const [historyOpen, setHistoryOpen] = useState(false);

    return {
        historyOpen,
        setHistoryOpen
    };
};