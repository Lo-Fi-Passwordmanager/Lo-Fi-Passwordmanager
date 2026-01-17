import {Entry} from "../../Model/Entry.ts";
import {useState} from "react";
import {AutomergeFacade, useAutomergeFacade} from "../../Utility/AutomergeFacade.ts";


/**
 * The viewmodel for the PasswordView, which stores the currently displayed entry
 * @param entry the entry that should be shown initially
 * @param automergeFacade the Automergefacade that contains the database to be used
 */
export const usePasswortViewModel = (entry: Entry, automergeFacade: AutomergeFacade) => {

    const [curEntry, setCurEntry] = useState(entry);
    const reactiveFacade = useAutomergeFacade(automergeFacade);

    /**
     * returns the current entry that should be shown
     */
    function getCurEntry() {
        return curEntry;
    }

    function getRootFolder() {
        return reactiveFacade.tree.rootFolder;
    }

    function addEntry() {
        reactiveFacade.insertItem(new Entry("test", "123", new Date(), new Date(), "username", "password", "url", "notiz"), reactiveFacade.tree.rootFolder.id as string);
    }

    return {
        setCurEntry,
        getCurEntry,
        getRootFolder,
        addEntry,
    };
};