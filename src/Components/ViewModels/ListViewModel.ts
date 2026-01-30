import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";
import {useEffect, useState} from "react";
import {SortCriteria} from "./PasswordViewModel.ts";

/**
 * The viewmodel used by the ListView. It has the utility needed for correctly deciding and differentiating {@link Entry} and {@link Folder}
 * @param topItem the item that is on top of the list to be shown. Shows this item and all below
 * @param currentSortCrit the current sort criterion to be used
 * @param isAscending whether the sorting should be ascending or descending
 */
export const useListViewModel = (
    topItem: Item,
    currentSortCrit: SortCriteria,
    isAscending: boolean,
    dirtyItemId: string | null,
    setCurrItem: (entry: Entry) => void,
    updateItemTitle: (itemId: string, newTitle: string) => void,
    setCreatedFolderId: (folderId: string | null) => void,
    createdFolderID: string | null
) => {

    const [extended, setExtended] = useState(true);
    const [inEditName, setInEditName] = useState(false);
    const [newTitle, setItemTitle] = useState(topItem.title);

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

    function toggleExtended() {
        setExtended(!extended);
    }

    function getExtended() {
        return extended;
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
     * Updates the title of the topItem in the automerge doc, should only be called, if a updateItemTitle functino is given into the viewmodel
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
        setExtended
    };
};