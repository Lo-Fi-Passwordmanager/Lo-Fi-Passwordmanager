import {useCallback, useState} from "react";
import {AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {useAutomergeFacade} from "../../Utility/useAutomergeFacade.ts";
import type {Item} from "../../Model/Item.ts";


/**
 * The viewmodel for the PasswordView, which stores the currently displayed entry
 *
 * @param automergeFacade the Automergefacade that contains the database to be used
 */
export const usePasswortViewModel = (automergeFacade: AutomergeFacade) => {

    const [inEditablePasswordView, setInEditablePasswordView] = useState(false);
    const [inItemCreation, setInItemCreation] = useState(false);
    const reactiveFacade = useAutomergeFacade(automergeFacade);
    const [curItem, setCurItem] = useState<Item>(reactiveFacade.tree.rootFolder);
    const [curParent, setCurParent] = useState<Item>(reactiveFacade.tree.rootFolder);

    /**
     * returns the current entry that should be shown
     */
    function getCurEntry() {
        return curItem;
    }

    function getInItemCreation() {
        return inItemCreation;
    }

    function getRootFolder() {
        return reactiveFacade.tree.rootFolder;
    }

    function addItem(item: Item, parentId: string) {
        reactiveFacade.insertItem(item, parentId);
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

    const deleteItem = useCallback(async (item: Item) => {
        await reactiveFacade.deleteItem(item.id);
        // FIXME: bitte lösch button nur in entry view und nciht list view, dann funktioniert das hier auch
        if (curItem.id === item.id) {
            setCurItem(curParent);
            setCurParent(curParent);
        }
    }, [curItem.id, curParent, reactiveFacade]);

    return {
        setCurItem,
        getCurEntry,
        getRootFolder,
        addItem,
        toggleEditablePasswordView,
        getInEditablePasswordView,
        getInItemCreation,
        setInItemCreation,
        setCurParent,
        getCurParent,
        deleteItem,
    };
};