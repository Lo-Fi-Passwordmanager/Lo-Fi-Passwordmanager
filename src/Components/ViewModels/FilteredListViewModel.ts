import {Folder} from "../../Model/Folder.ts";
import {Entry} from "../../Model/Entry.ts";
import {SortCriteria} from "./PasswordViewModel.ts";
import type {Item} from "../../Model/Item.ts";

export const useFilteredListViewModel = (root: Folder, filterText: string, currentSortCrit: SortCriteria, isAscending: boolean) => {

    function getFilteredEntries(startFolder: Folder = root): Folder {
        const filtered: Folder = new Folder("filteredEntries", "filteredEntriesId");
        for (const item of getSortedChildren(startFolder)) {
            if (item.isEntry()) {
                const entry = item as Entry;
                if (
                    entry.title.toLowerCase().includes(filterText.toLowerCase()) ||
                    entry.username.toLowerCase().includes(filterText.toLowerCase()) ||
                    entry.url.toLowerCase().includes(filterText.toLowerCase()) ||
                    entry.note.toLowerCase().includes(filterText.toLowerCase())
                ) {
                    filtered.addItem(entry);
                }
            } else if (item.isFolder()) {
                const subEntries = getFilteredEntries(item as Folder);
                for (const subItem of subEntries.entries) {
                    filtered.addItem(subItem);
                }
            }
        }
        return filtered;
    }

    function getFilteredFolders(startFolder: Folder = root): Folder {
        const filtered: Folder = new Folder("filteredFolders", "filteredFoldersId");
        for (const item of getSortedChildren(startFolder)) {
            if (item.isFolder()) {
                const folder = item as Folder;
                if (folder.title.toLowerCase().includes(filterText.toLowerCase())) {
                    filtered.addItem(folder);
                }
                const subFolders = getFilteredFolders(folder);
                for (const subItem of subFolders.entries) {
                    filtered.addItem(subItem);
                }
            }
        }
        return filtered;
    }

    /**
     * Gets the children of the given folder, sorted by the current sort criterion and order
     */
    function getSortedChildren(folder: Folder): Item[] {
        switch (`${currentSortCrit}-${isAscending}`) {
            case `${SortCriteria.Name}-true`:
                return (folder).entries.slice().sort((a, b) => a.title.localeCompare(b.title));

            case `${SortCriteria.Name}-false`:
                return (folder).entries.slice().sort((a, b) => b.title.localeCompare(a.title));

            case `${SortCriteria.CreatedAt}-true`:
                return (folder).entries.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            case `${SortCriteria.CreatedAt}-false`:
                return (folder).entries.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            case `${SortCriteria.EditedAt}-true`:
                return (folder).entries.slice().sort((a, b) => a.editedAt.getTime() - b.editedAt.getTime());

            case `${SortCriteria.EditedAt}-false`:
                return (folder).entries.slice().sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime());
        }
        return [];
    }

    return {
        getFilteredEntries,
        getFilteredFolders,
    }
}