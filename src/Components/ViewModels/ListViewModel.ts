import {useDndContext, useDraggable, useDroppable} from "@dnd-kit/core";
import {useEffect, useMemo, useState} from "react";

import type {Entry} from "../../Model/Entry.ts";
import type {Folder} from "../../Model/Folder.ts";
import type {Item} from "../../Model/Item.ts";


/**
 * The view model used by the ListView. It has the utility needed for correctly deciding and differentiating {@link Entry} and {@link Folder}
 *
 * @param topItem the item that is on top of the list to be shown. Shows this item and all below
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
    dirtyItemId: string | null,
    setCurrItem: (entry: Entry) => void,
    updateItemTitle: (itemId: string, newTitle: string) => void,
    setCreatedFolderId: (folderId: string | null) => void,
    createdFolderID: string | null,
    expandFolderId: (folderId: string) => void,
    collapseFolderId: (folderId: string) => void,
    isFolderExpanded: (folderId: string) => boolean
) => {

    const [inEditName, setInEditName] = useState(false);
    const [newTitle, setItemTitle] = useState(topItem.title);
    const {active} = useDndContext();

    // reset the state if a folder was just created
    useEffect(() => {
        if (createdFolderID === topItem.id) {
            setItemTitle(topItem.title);
        }
    }, [createdFolderID, topItem.id, topItem.title]);

    if (dirtyItemId && topItem.id === dirtyItemId) {
        setCurrItem(topItem as Entry);
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
        setCreatedFolderId(null);
    }


    const getDescendantIds = (item: Item): string[] => {
        if (item.isEntry()) {
            return [];
        }
        return (item as Folder).items.flatMap((child) => [child.id, ...getDescendantIds(child)]);
    };

    /**
     * Gets all descendant IDs of the current item if it is a folder
     */
    const descendantIds = useMemo(() => {
        if (!topItem.isFolder()) return [];
        return getDescendantIds(topItem);
        //eslint-disable-next-line react-hooks/exhaustive-deps
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
        data: {
            type: isItemFolder() ? "folder" : "entry",
            descendantIds: descendantIds
        }
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
        isItemFolder,
        isItemEntry,
        getItem,
        toggleExpanded,
        setFolderRef,
        setDraggableRef,
        expandFolder
    };
};