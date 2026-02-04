import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";
import {useEffect, useState, useMemo} from "react";
import {SortCriteria} from "./PasswordViewModel.ts";
import {useDndContext, useDraggable, useDroppable} from "@dnd-kit/core";

/**
 * The viewmodel used by the ListView. It has the utility needed for correctly deciding and differentiating {@link Entry} and {@link Folder}
 * @param topItem the item that is on top of the list to be shown. Shows this item and all below
 * @param currentSortCrit the current sort criterion to be used
 * @param isAscending whether the sorting should be ascending or descending
 * @param dirtyItemId the id of the item that was just modified externally and needs to be re-fetched
 * @param setCurrItem method to set the current item in the parent view model
 * @param updateItemTitle method to update the title of an item in the automerge doc
 * @param setCreatedFolderId method to set the created folder id in the parent view model
 * @param createdFolderID the id of the folder that was just created
 * @param expandFolderId method to expand the folder with the given id
 * @param collapseFolderId method to collapse the folder with the given id
 * @param isFolderExpanded method to check if the folder with the given id is expanded
 */
export const useListViewModel = (
    topItem: Item,
    currentSortCrit: SortCriteria,
    isAscending: boolean,
    dirtyItemId: string | null,
    setCurrItem: (entry: Entry) => void,
    updateItemTitle: (itemId: string, newTitle: string) => void,
    setCreatedFolderId: (folderId: string | null) => void,
    createdFolderID: string | null,
    expandFolderId: (folderId: string) => void,
    collapseFolderId: (folderId: string) => void,
    isFolderExpanded: (folderId: string) => boolean,
) => {

    const [inEditName, setInEditName] = useState(false);
    const [newTitle, setItemTitle] = useState(topItem.title);
    const {active} = useDndContext();

    // reset the state if a folder was just created
    useEffect(() => {
        if(createdFolderID === topItem.id) {
            setItemTitle(topItem.title);
        }
    }, [createdFolderID, topItem.id, topItem.title]);

    if (dirtyItemId && topItem.id === dirtyItemId) {
        setCurrItem(topItem as Entry);
    }

    /**
     * Gets the children of the current item, sorted by the current sort criterion and order
     */
    function getChildren() {
        if (topItem.isFolder()) {
            switch (`${currentSortCrit}-${isAscending}`) {
                case `${SortCriteria.Name}-true`:
                    return (topItem as Folder).entries.slice().sort((a, b) => a.title.localeCompare(b.title));

                case `${SortCriteria.Name}-false`:
                    return (topItem as Folder).entries.slice().sort((a, b) => b.title.localeCompare(a.title));

                case `${SortCriteria.CreatedAt}-true`:
                    return (topItem as Folder).entries.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                case `${SortCriteria.CreatedAt}-false`:
                    return (topItem as Folder).entries.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                case `${SortCriteria.EditedAt}-true`:
                    return (topItem as Folder).entries.slice().sort((a, b) => a.editedAt.getTime() - b.editedAt.getTime());

                case `${SortCriteria.EditedAt}-false`:
                    return (topItem as Folder).entries.slice().sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime());
            }
        }
    }

    function toggleExpanded() {
        if (!isFolderExpanded(topItem.id)) {
            expandFolderId(topItem.id);
        } else {
            collapseFolderId(topItem.id);
        }
    }

    function expandFolder() {
        expandFolderId(topItem.id);
    }

    function getItem() {
        return topItem;
    }

    function isItemFolder(): this is Folder {
        return topItem.isFolder();
    }

    function isItemEntry(): this is Entry {
        return topItem.isEntry();
    }


    /**
     * Updates the title of the topItem in the automerge doc, should only be called, if a updateItemTitle funciton is given into the view model
     */
    function updateTitleInAutomerge() {
        updateItemTitle(topItem.id, newTitle);
    }

    function setAndStoreEditName(newValue: boolean): void {
        //set the boolean first so the (slow) automerge Updates happens when the UI is already updated
        setInEditName(newValue);
        //due to the code executing first, the state update actually triggers after this function so we need to check for the value before
        if (inEditName) {
            updateTitleInAutomerge();
        }
        setCreatedFolderId(null);
    }


    const getDescendantIds = (item: Item): string[] => {
        if (item.isEntry()) {
            return [];
        } else if (!(item as Folder).entries) {
            return [];
        }
        return (item as Folder).entries.flatMap((child) => [child.id, ...getDescendantIds(child)]);
    }

    /**
     * Gets all descendant IDs of the current item if it is a folder
     */
    const descendantIds = useMemo(() => {
        return isItemFolder() ? getDescendantIds(topItem) : [];
    }, [topItem]);

    /**
     * Determines if the current item is an invalid drop target for the active draggable item
     */
    const isInvalidDropTarget = useMemo(() => {
        if (!active) return false;
        const activeDescendants = active.data.current?.descendantIds as string[];
        return activeDescendants.includes(topItem.id);
    }, [active, topItem.id]);


    // DnD Kit Draggable and Droppable setup
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        transform,
        isDragging
    } = useDraggable({
        id: topItem.id,
        data: {type: isItemFolder() ? 'folder' : 'entry',
            descendantIds: descendantIds}
    });

    const {
        setNodeRef: setDroppableRef,
        isOver
    } = useDroppable({
        id: topItem.id,
        disabled: !isItemFolder() || isInvalidDropTarget
    });

    const setFolderRef = (node: HTMLDivElement | null) => {
        if (!node) return;
        setDraggableRef(node);
        setDroppableRef(node);
    };

    return {
        newTitle,
        inEditName,
        descendantIds,
        isInvalidDropTarget,
        attributes,
        listeners,
        isDragging,
        transform,
        isOver,

        setItemTitle,
        updateTitleInAutomerge,
        setAndStoreEditName,
        getChildren,
        isItemFolder,
        isItemEntry,
        getItem,
        toggleExpanded,
        setFolderRef,
        setDraggableRef,
        expandFolder,
    };
};