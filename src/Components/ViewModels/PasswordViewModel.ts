import {useRef, useState} from "react";
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
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const clipboardTimerRef = useRef<number | null>(null);

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

    function deleteItem(item: Item) {
        reactiveFacade.deleteItem(item.id);
    }

    function copyToClipboardAndClear(text: string, timeout: number = 10000) {
        //If a timer is already running, cancel it. This is important for copying twice so that the first copy doesnt delete the second one
        if (clipboardTimerRef.current) {
            window.clearTimeout(clipboardTimerRef.current);
        }

        setToastMessage("In die Zwischenablage kopiert");
        setToastVisible(true);
        navigator.clipboard.writeText(text);


        //after the timeout check for focus and clear the clipboard when focused
        clipboardTimerRef.current = window.setTimeout(() => {
            if (document.hasFocus()) {
                navigator.clipboard.writeText("");
                setToastMessage("Zwischenablage gelöscht");
                setToastVisible(true);
                clipboardTimerRef.current = null;
            } else {
                // If user is away, wait until they come back
                setToastMessage("Löschen ausstehend (bitte Tab fokussieren)");
                window.addEventListener('focus',
                    () => {navigator.clipboard.writeText("");
                    setToastMessage("Zwischenablage gelöscht");
                    setToastVisible(true);},
                    { once: true });
                clipboardTimerRef.current = null;
            }
        }, timeout);
    }

    return {
        copyToClipboardAndClear,
        setCurItem,
        getCurEntry,
        getRootFolder,
        addItem,
        setToastMessage,
        setToastVisible,
        toastVisible,
        toastMessage,
        toggleEditablePasswordView,
        getInEditablePasswordView,
        getInItemCreation,
        setInItemCreation,
        setCurParent,
        getCurParent,
        deleteItem,
    };
};