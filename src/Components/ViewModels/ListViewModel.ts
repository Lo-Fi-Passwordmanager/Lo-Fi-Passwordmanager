import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";
import {useState} from "react";
import {SortCriteria} from "./PasswordViewModel.ts";

/**
 * The viewmodel used by the ListView. It has the utility needed for correctly deciding and differentiating {@link Entry} and {@link Folder}
 * @param topItem the item that is on top of the list to be shown. Shows this item and all below
 * @param currentSortCrit the current sort criterion to be used
 * @param isAscending whether the sorting should be ascending or descending
 */
export const useListViewModel = (topItem: Item, currentSortCrit: SortCriteria, isAscending: boolean, dirtyItemId: string | null, setCurrItem: (entry: Entry) => void) => {

    const item: Item = topItem;
    const [extended, setExtended] = useState(true);

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

    function setTitle(newTitle: string) {
        item.title = newTitle;
    }

    return {
        getChildren,
        isItemFolder,
        isItemEntry,
        getItem,
        toggleExtended,
        getExtended,
        setExtended,
        setTitle,
    };
};