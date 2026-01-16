import type {Entry} from "../../Model/Entry.ts";
import {useState} from "react";


/**
 * The viewmodel for the PasswordView, which stores the currently displayed entry
 * @param entry the entry that should be shown initially
 */
export const usePasswortViewModel = (entry:Entry) => {

    const [curEntry, setCurEntry] = useState(entry);

    /**
     * returns the current entry that should be shown
     */
    function getCurEntry() {
        return curEntry;
    }

    return {
        setCurEntry,
        getCurEntry,
    };
};