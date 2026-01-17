import {Entry} from "../../Model/Entry.ts";
import {useState} from "react";
import {AutomergeFacade, useAutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import type {Item} from "../../Model/Item.ts";


/**
 * The viewmodel for the PasswordView, which stores the currently displayed entry
 * @param entry the entry that should be shown initially
 * @param automergeFacade the Automergefacade that contains the database to be used
 */
export const usePasswortViewModel = (automergeFacade: AutomergeFacade) => {

    const [inEditablePasswordView, setInEditablePasswordView] = useState(false);
    const [inItemCreation, setInItemCreation] = useState(false);
    const reactiveFacade = useAutomergeFacade(automergeFacade);
    const [curEntry, setCurEntry] = useState(reactiveFacade.tree.rootFolder);
    const [curParent, setCurParent] = useState(reactiveFacade.tree.rootFolder);

    /**
     * returns the current entry that should be shown
     */
    function getCurEntry() {
        return curEntry;
    }
    function getInItemCreation() {
        return inItemCreation;
    }

    function getRootFolder() {
        return reactiveFacade.tree.rootFolder;
    }

    function addItem(item: Item, id: string) {
        reactiveFacade.insertItem(item, id);
        toggleEditablePasswordView();
    }

    function toggleEditablePasswordView() {
        setInEditablePasswordView(!inEditablePasswordView);
    }

    function getInEditablePasswordView() {
        return inEditablePasswordView;
    }

    function getCurParent() {
        return curParent;
    }

    return {
        setCurEntry,
        getCurEntry,
        getRootFolder,
        addItem,
        toggleEditablePasswordView,
        getInEditablePasswordView,
        getInItemCreation,
        setInItemCreation,
        setCurParent,
        getCurParent,
    };
};