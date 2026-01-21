import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";
import {useState} from "react";

/**
 * The viewmodel used by the ListView. It has the utility needed for correctly deciding and differentiating {@link Entry} and {@link Folder}
 * @param topItem the item that is on top of the list to be shown. Shows this item and all below
 */
export const useListViewModel = (topItem: Item, dirtyItemId: number | null, setCurrItem: (entry: Entry) => void) => {

    const item: Item = topItem;
    const [extended, setExtended] = useState(true);

    if (dirtyItemId && item.id === dirtyItemId) {
        setCurrItem(item);
    }


    // Reactive state to store values during runtime

     function getChildren() {
        if (item.isFolder()) {
            return (item as Folder).entries;
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

    return {
        getChildren,
        isItemFolder,
        isItemEntry,
        getItem,
        toggleExtended,
        getExtended,
    };
};