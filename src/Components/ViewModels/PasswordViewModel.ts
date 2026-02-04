import {useRef, useState} from "react";
import {type Attribute, AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {useAutomergeFacade} from "../../Utility/useAutomergeFacade.ts";
import type {Item} from "../../Model/Item.ts";
import {
    loadCurrentSortCriterion,
    loadIsAscending,
    saveCurrentSortCriterion,
    saveIsAscending
} from "../../Utility/Storage.ts";
import {type DragEndEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {useSettings} from "../../Model/Settings.ts";

export const SortCriteria = {
    Name: "NAME",
    CreatedAt: "CREATED",
    EditedAt: "EDITED",
} as const;
export type SortCriteria = typeof SortCriteria[keyof typeof SortCriteria];

/**
 * The viewmodel for the PasswordView, which stores the currently displayed entry
 *
 * @param automergeFacade the Automergefacade that contains the database to be used
 */
export const usePasswortViewModel = (automergeFacade: AutomergeFacade) => {

    const settings = useSettings();
    const [inItemCreation, setInItemCreation] = useState(false);
    const reactiveFacade = useAutomergeFacade(automergeFacade);
    const [curItem, _setCurItem] = useState<Item>(reactiveFacade.tree.rootFolder);
    const [curParent, setCurParent] = useState<Item>(reactiveFacade.tree.rootFolder);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const clipboardTimerRef = useRef<number | null>(null);
    const [inEditable, setInEditable] = useState(false);
    const [dirtyItemId, setDirtyItemId] = useState<string | null>(null);
    const [hidePassword, setHidePassword] = useState(true);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [createdFolderId, setCreatedFolderId] = useState<string | null>(null);
    // State to track if we are in the process of creating a new entry
    const [inEntryCreation, setInEntryCreation] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([getRootFolder().id]));


    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    function setCurItem(item: Item) {
        _setCurItem(item);
        setDirtyItemId(null);
    }

    const [curSortCrit, setCurSortCrit] = useState<SortCriteria>(initSortCriterion);
    const [isAscending, setIsAscending] = useState<boolean>(initIsAscending);
    const [searchValue, setSearchValue] = useState<string>("");

    /**
     * initializes the sort criterion from the local storage, or uses the default value
     */
    function initSortCriterion() {
        const savedCriterion = loadCurrentSortCriterion();
        if (isCriterion(savedCriterion)) {
            return savedCriterion;
        } else {
            return SortCriteria.Name;
        }
    }

    /**
     * Toggles the password from ****** to the string and back
     */
    function toggleHidePassword() {
        setHidePassword(!hidePassword);
    }

    /**
     * type guard to check if a string is a valid SortCriterion
     */
    function isCriterion(value: string | null): value is SortCriteria {
        return Object.values(SortCriteria).includes(value as SortCriteria);
    }

    /**
     * initializes the isAscending boolean from the local storage, or uses the default value
     */
    function initIsAscending() {
        const savedBoolean = loadIsAscending();
        if (isBoolean(savedBoolean)) {
            return savedBoolean;
        } else {
            return true;
        }
    }

    /**
     * type guard to check if a value is a boolean
     */
    function isBoolean(value: boolean | null): value is boolean {
        return typeof value === 'boolean';
    }

    /**
     * sets and stores the current sort criterion
     */
    function setAndStoreSortCriterion(criterion: SortCriteria) {
        setCurSortCrit(criterion);
        saveCurrentSortCriterion(criterion)
    }

    /**
     * returns the current sort criterion
     */
    function getCurSortCriterion() {
        return curSortCrit;
    }

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

    /**
     * Adds an item to the database and sets it as the current item
     * Folders are directly created, if the item is an entry, it sets the view to editable and in entry creation mode.
     */
    function addItem(item: Item) {
        if (item.isEntry()) {
            setCurItem(item);
            setInEntryCreation(true);
            toggleInEdit();
        } else {
            const id = reactiveFacade.insertItem(item, curParent.id);
            item.id = id;
            // expand created folder
            expandFolder(id);
            // expand parent folder
            expandFolder(curParent.id);
            setCurItem(item);
            goToItem(item);
            setCreatedFolderId(id);
        }
    }

    function createEntry(item: Item) {
        item.id = reactiveFacade.insertItem(item, curParent.id);
        expandFolder(item.id);
        expandFolder(curParent.id);
        setCurItem(item);
        goToItem(item)
    }


    function toggleInEdit() {
        settings.setSynchronization(inEditable);
        setInEditable(!inEditable);
    }

    function getCurParent() {
        return curParent;
    }

    function updateItemAttribute(itemId: string, changes: [Attribute, string | Date][]) {
        reactiveFacade.updateItem(itemId, changes);
        const id = curItem.id;
        setCurItem(getRootFolder());
        setDirtyItemId(id);
    }

    function updateItemTitle(itemId: string, newTitle: string) {
        reactiveFacade.updateItem(itemId, [["name", newTitle]]);
    }

    function deleteItem(item: Item) {
        if (item.id === "") {
            return;
        }
        setItemToDelete(item);
    }

    function confirmDeletion(item: Item) {
        setItemToDelete(null);
        reactiveFacade.deleteItem(item.id);
        item.deleted = true;
        setCurItem(curParent);
        setCurParent(curParent);
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
                window.addEventListener("focus",
                    () => {
                        navigator.clipboard.writeText("");
                        setToastMessage("Zwischenablage gelöscht");
                        setToastVisible(true);
                    },
                    {once: true});
                clipboardTimerRef.current = null;
            }
        }, timeout);
    }

    /**
     * Toggles the order of the sorting between ascending and descending
     */
    function toggleOrder() {
        setIsAscending(!isAscending);
        saveIsAscending(!isAscending);
    }

    /**
     * Handles the drag end event from dnd kit and updates the parentId of the dragged item
     */
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) {
            return;
        }
        if (active.id !== over.id) {
            reactiveFacade.updateItem(active.id as string, [["parentId", over.id as string]]);
        }
    };

    /**
     * Sensor for dnd kit to start dragging after moving 5 pixels
     * Otherwise it interferes with clicking to select items
     */
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: allowDragging() ? 5 : Infinity,
            },
        })
    );

    /**
     * Returns whether dragging is allowed in the current state
     */
    function allowDragging() {
        return !inEditable && !inItemCreation && createdFolderId === null;
    }

    /**
     * Navigates to the given item by setting it as the current item and clearing the search value so the view shows the full hierarchy
     */
    function goToItem(item: Item) {
        setSearchValue("");
        setSelectedItemId(item.id);
        setTimeout(() => document.querySelector("[aria-selected='true']")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        }), 0);
        setTimeout(() => setSelectedItemId(null), 1000);
    }

    function expandFolder(folderId: string) {
        setExpandedFolders(prev => new Set(prev).add(folderId));
    }

    function collapseFolder(folderId: string) {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            newSet.delete(folderId);
            return newSet;
        });
    }

    function isFolderExpanded(folderId: string) {
        return expandedFolders.has(folderId);
    }

    return {
        dirtyItemId,
        isAscending,
        searchValue,
        toastMessage,
        toastVisible,
        inEditable,
        hidePassword,
        selectedItemId,
        inEntryCreation,
        createdFolderId,
        itemToDelete,
        sensors,

        setInEntryCreation,
        toggleHidePassword,
        setSearchValue,
        copyToClipboardAndClear,
        setCurItem,
        getCurEntry,
        getRootFolder,
        addItem,
        setToastMessage,
        setToastVisible,
        setInEditable,
        updateItemAttribute,
        toggleInEdit,
        getInItemCreation,
        setInItemCreation,
        setCurParent,
        getCurParent,
        deleteItem,
        setAndStoreSortCriterion,
        toggleOrder,
        getCurSortCriterion,
        handleDragEnd,
        goToItem,
        updateItemTitle,
        confirmDeletion,
        createEntry,
        setCreatedFolderId,
        setItemToDelete,
        expandFolder,
        collapseFolder,
        isFolderExpanded,
    };
};