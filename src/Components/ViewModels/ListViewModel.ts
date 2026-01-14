import {Item} from "../../Model/Item.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Entry} from "../../Model/Entry.ts";

export const useListViewModel = (topItem: Item) => {

    let item: Item = topItem;


    // Reactive state to store values during runtime

     function getChildren() {
        if (item.isFolder()) {
            return item.entries;
        }
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
    };
};