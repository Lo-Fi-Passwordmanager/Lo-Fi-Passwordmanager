import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";
import {useState} from "react";

export const useListViewModel = (topItem: Item) => {

    let item: Item = topItem;
    const [extended, setExtended] = useState(false);


    // Reactive state to store values during runtime

     function getChildren() {
        if (item.isFolder()) {
            return item.entries;
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