import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";
import {useMemo, useState} from "react";
import {SortCriteria} from "./PasswordViewModel.ts";
import {useDndContext, useDraggable, useDroppable} from "@dnd-kit/core";

/**
 * The viewmodel used by the ListView. It has the utility needed for correctly deciding and differentiating {@link Entry} and {@link Folder}
 * @param topItem the item that is on top of the list to be shown. Shows this item and all below
 * @param currentSortCrit the current sort criterion to be used
 * @param isAscending whether the sorting should be ascending or descending
 */
export const useListViewModel = (topItem: Item,
                                 currentSortCrit: SortCriteria,
                                 isAscending: boolean,
                                 dirtyItemId: string | null,
                                 setCurrItem: (entry: Entry) => void,
                                 updateItemTitle: (itemId: string, newTitle: string) => void) => {

    const item: Item = topItem;
    const [extended, setExtended] = useState(true);
    const [inEditName, setInEditName] = useState(false);
    const [newTitle, setNewTitle] = useState(item.title);
    const {active} = useDndContext();

    if (dirtyItemId && item.id === dirtyItemId) {
        setCurrItem(item as Entry);
    }

    /**
     * Gets the children of the current item, sorted by the current sort criterion and order
     */
    function getChildren() {
        if (item.isFolder()) {
            switch (`${currentSortCrit}-${isAscending}`) {
                case `${SortCriteria.Name}-true`:
                    return (item as Folder).entries.slice().sort((a, b) => a.title.localeCompare(b.title));

                case `${SortCriteria.Name}-false`:
                    return (item as Folder).entries.slice().sort((a, b) => b.title.localeCompare(a.title));

                case `${SortCriteria.CreatedAt}-true`:
                    return (item as Folder).entries.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                case `${SortCriteria.CreatedAt}-false`:
                    return (item as Folder).entries.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                case `${SortCriteria.EditedAt}-true`:
                    return (item as Folder).entries.slice().sort((a, b) => a.editedAt.getTime() - b.editedAt.getTime());

                case `${SortCriteria.EditedAt}-false`:
                    return (item as Folder).entries.slice().sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime());
            }
        }
    }

    function toggleExtended() {
        setExtended(!extended);
    }

    function getExtended() {
        return extended;
    }

    function getItem() {
        return item;
    }

    function isItemFolder(): this is Folder {
        return item.isFolder();
    }

    function isItemEntry(): this is Entry {
        return item.isEntry();
    }

    function setItemTitle(newTitle: string): void {
        setNewTitle(newTitle);
    }

    /**
     * Updates the title of the item in the automerge doc, should only be called, if a updateItemTitle functino is given into the viewmodel
     */
    function updateTitleInAutomerge() {
        updateItemTitle(item.id, newTitle);
    }

    function setAndStoreEditName(newValue: boolean): void {
        //set the boolean first so the (slow) automerge Updates happens when the UI is already updated
        setInEditName(newValue);
        //due to the code executing first, the state update actually triggers after this function so we need to check for the value before
        if (inEditName) {
            updateTitleInAutomerge();
        }
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
        return isItemFolder() ? getDescendantIds(item) : [];
    }, [item]);

    /**
     * Determines if the current item is an invalid drop target for the active draggable item
     */
    const isInvalidDropTarget = useMemo(() => {
        if (!active) return false;
        const activeDescendants = active.data.current?.descendantIds as string[];
        return activeDescendants.includes(item.id);
    }, [active, item.id]);


    // DnD Kit Draggable and Droppable setup
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        transform,
        isDragging
    } = useDraggable({
        id: item.id,
        data: {type: isItemFolder() ? 'folder' : 'entry',
            descendantIds: descendantIds}
    });

    const {
        setNodeRef: setDroppableRef,
        isOver
    } = useDroppable({
        id: item.id,
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
        setItemTitle,
        updateTitleInAutomerge,
        setAndStoreEditName,
        getChildren,
        isItemFolder,
        isItemEntry,
        getItem,
        toggleExtended,
        getExtended,
        setExtended,
        descendantIds,
        isInvalidDropTarget,
        setFolderRef,
        setDraggableRef,
        attributes,
        listeners,
        isDragging,
        transform,
        isOver
    };
};