import {type DragEndEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {useRef, useState} from "react";

import type {Folder} from "../../Model/Folder.ts";
import type {Item} from "../../Model/Item.ts";
import {useSettings} from "../../Model/Settings.ts";
import type { AutomergeFacade} from "../../Utility/AutomergeFacade.ts";
import {type Attribute} from "../../Utility/AutomergeFacade.ts";
import {
    loadCurrentSortCriterion,
    loadIsAscending,
    saveCurrentSortCriterion,
    saveIsAscending
} from "../../Utility/Storage.ts";
import {useAutomergeFacade} from "../../Utility/useAutomergeFacade.ts";

/**
 * Criteria as enum by which items are sorted
 */
export const SortCriteria = {
    Name: "NAME",
    CreatedAt: "CREATED",
    EditedAt: "EDITED",
} as const;
export type SortCriteria = typeof SortCriteria[keyof typeof SortCriteria];

/**
 * The view model used by the PasswordView. Contains all the logic and states needed for the child components.
 *
 * @param automergeFacade the Automergefacade that contains the database to be used
 */
export const usePasswordViewModel = (automergeFacade: AutomergeFacade) => {

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
    // States to track selected and created items for visual feedback
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [createdFolderId, setCreatedFolderId] = useState<string | null>(null);
    // State to track if we are in the process of creating a new entry
    const [inEntryCreation, setInEntryCreation] = useState(false);
    const [curSortCrit, setCurSortCrit] = useState<SortCriteria>(initSortCriterion);
    const [isAscending, setIsAscending] = useState<boolean>(initIsAscending);
    const [searchValue, setSearchValue] = useState<string>("");
    const [expandedFolders, setExpandedFolders] = useState<string[]>([getRootFolder().id]);


    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    /**
     * sets the current item and clears the dirty item id
     */
    function setCurItem(item: Item) {
        _setCurItem(item);
        setDirtyItemId(null);
    }

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

    /**
     * Eventually creates an entry in the automerge doc after the user saved the temporary entry in the editable view.
     *
     * @param item the new entry
     */
    function createEntry(item: Item) {
        item.id = reactiveFacade.insertItem(item, curParent.id);
        expandFolder(item.id);
        expandFolder(curParent.id);
        setCurItem(item);
        goToItem(item)
    }

    /**
     * Toggles the inEditable state and updates the synchronization setting accordingly
     */
    function toggleInEdit() {
        if (settings.getSynchronization()) {
            settings.setSynchronization(inEditable, !inEditable);
        }
        setInEditable(!inEditable);
    }

    /**
     * Updates the given attributes of the given item
     * @param itemId
     * @param changes
     */
    function updateItemAttribute(itemId: string, changes: [Attribute, string | Date][]) {
        reactiveFacade.updateItem(itemId, changes);
        const id = curItem.id;
        setCurItem(getRootFolder());
        setDirtyItemId(id);


    }

    /**
     * Updates the title of the given item
     * @param itemId the id of the item to be updated
     * @param newTitle the new title of the item
     */
    function updateItemTitle(itemId: string, newTitle: string) {
        reactiveFacade.updateItem(itemId, [["name", newTitle]]);
    }

    /**
     * Prepares the deletion of the given item by setting it to the itemToDelete state
     * @param item the item to be deleted
     */
    function deleteItem(item: Item) {
        if (item.id === "") {
            return;
        }
        setItemToDelete(item);
    }

    /**
     * Confirms the deletion of the given item, removes it from the database and updates the current item to the parent
     */
    function confirmDeletion(item: Item) {
        setItemToDelete(null);
        reactiveFacade.deleteItem(item.id);
        item.deleted = true;
        setCurItem(curParent);
        setCurParent(curParent);
    }

    /**
     * Copies the given text to the clipboard and clears it after the given timeout
     * If the user is not focused on the tab when the timeout expires, it waits until they come back to clear the clipboard
     */
    function copyToClipboardAndClear(text: string, timeout: number = 10000) {
        //If a timer is already running, cancel it. This is important for copying twice so that the first copy doesnt delete the second one
        if (clipboardTimerRef.current) {
            window.clearTimeout(clipboardTimerRef.current);
        }

        setToastMessage("In die Zwischenablage kopiert");
        setToastVisible(true);
        void navigator.clipboard.writeText(text);


        //after the timeout check for focus and clear the clipboard when focused
        clipboardTimerRef.current = window.setTimeout(() => {
            if (document.hasFocus()) {
                void navigator.clipboard.writeText("");
                setToastMessage("Zwischenablage gelöscht");
                setToastVisible(true);
                clipboardTimerRef.current = null;
            } else {
                // If user is away, wait until they come back
                setToastMessage("Löschen ausstehend (bitte Tab fokussieren)");
                window.addEventListener("focus",
                    () => {
                        void navigator.clipboard.writeText("");
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
            expandFolder(over.id as string);
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
     * Recursively searches for the path to the given target item starting from the given folder. Returns an array of item ids representing the path.
     * @param target the item to find the path to
     * @param folder the folder to start searching from, defaults to the root folder
     * @param path the current path of item ids, used for recursion, defaults to an empty array
     */
    function getPath(target: Item, folder: Folder = getRootFolder(), path: string[] = []): string[] {
        for (const item of folder.items) {
            if (item.id === target.id) {
                return [...path, item.id];
            } else if (item.isFolder()) {
                const result = getPath(target, item as Folder, [...path, item.id]);
                if (result.length > 0) {
                    return result;
                }
            }
        }
        return [];
    }

    /**
     * Expands all folders in the path to the given item, so that the item is visible in the hierarchy
     * @param item the item to expand the path to
     */
    function expandFoldersInPath(item: Item) {
        const path = getPath(item);
        expandMultipleFolders(path);
    }

    /**
     * Navigates to the given item by setting it as the current item and clearing the search value so the view shows the full hierarchy
     */
    function goToItem(item: Item) {

        expandFoldersInPath(item);

        setSearchValue("");
        setSelectedItemId(item.id);
        setTimeout(() => document.querySelector("[aria-selected='true']")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        }), 0);
        setTimeout(() => setSelectedItemId(null), 1000);
    }

    /**
     * Expands the folder with the given id
     * @param folderId
     */
    function expandFolder(folderId: string) {
        const expanded = expandedFolders;
        if (!expanded.includes(folderId)) {
            setExpandedFolders([...expanded, folderId]);
        }
    }

    function expandMultipleFolders(folderIds: string[]) {
        const withoutDuplicates: string[] = [];
        for (const folderId of folderIds) {
            if (!expandedFolders.includes(folderId)) {
                withoutDuplicates.push(folderId);
            }
        }
        setExpandedFolders(expandedFolders.concat(withoutDuplicates));
    }

    /**
     * Collapses the folder with the given id
     * @param folderId
     */
    function collapseFolder(folderId: string) {
        const expanded = expandedFolders;
        if (expanded.includes(folderId)) {
            setExpandedFolders(expanded.filter(id => id !== folderId));
        }
    }

    /**
     * Returns whether the folder with the given id is expanded
     * @param folderId
     */
    function isFolderExpanded(folderId: string) {
        return expandedFolders.includes(folderId);
    }

    /**
     * Gets the children of the given folder, sorted by the current sort criterion and order
     */
    function getSortedChildren(folder: Folder): Item[] {
        switch (`${curSortCrit}-${isAscending}`) {
            case `${SortCriteria.Name}-true`:
                return (folder).items.slice().sort((a, b) => a.title.localeCompare(b.title));

            case `${SortCriteria.Name}-false`:
                return (folder).items.slice().sort((a, b) => b.title.localeCompare(a.title));

            case `${SortCriteria.CreatedAt}-true`:
                return (folder).items.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            case `${SortCriteria.CreatedAt}-false`:
                return (folder).items.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            case `${SortCriteria.EditedAt}-true`:
                return (folder).items.slice().sort((a, b) => a.editedAt.getTime() - b.editedAt.getTime());

            case `${SortCriteria.EditedAt}-false`:
                return (folder).items.slice().sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime());
        }
        return [];
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
        curSortCrit,
        curItem,
        curParent,
        inItemCreation,

        setInEntryCreation,
        toggleHidePassword,
        setSearchValue,
        copyToClipboardAndClear,
        setCurItem,
        getRootFolder,
        addItem,
        setToastMessage,
        setToastVisible,
        setInEditable,
        updateItemAttribute,
        toggleInEdit,
        setInItemCreation,
        setCurParent,
        deleteItem,
        setAndStoreSortCriterion,
        toggleOrder,
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
        getSortedChildren,
        setCurSortCrit,
        setIsAscending,
    };
};