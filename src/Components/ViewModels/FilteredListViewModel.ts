import type {Entry} from "../../Model/Entry.ts";
import {Folder} from "../../Model/Folder.ts";
import type {Item} from "../../Model/Item.ts";

/**
 * ViewModel for filtering and sorting entries and folders in a list view.
 *
 * @param root The root folder to start filtering from.
 * @param filterText The text to filter entries and folders by.
 * @param getSortedChildren Function to get sorted children of a folder.
 */
export const useFilteredListViewModel = (
    root: Folder,
    filterText: string,
    getSortedChildren: (folder: Folder) => Item[],
) => {

    /**
     * Gets the entries that match the filter text from the given start folder recursively
     */
    function getFilteredEntries(startFolder: Folder = root): Item[] {
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
                for (const subItem of subEntries) {
                    filtered.addItem(subItem);
                }
            }
        }
        return getSortedChildren(filtered);
    }

    /**
     * Gets the folders that match the filter text from the given start folder recursively
     */
    function getFilteredFolders(startFolder: Folder = root): Item[] {
        const filtered = new Folder("filteredFolders", "filteredFoldersId");
        for (const item of startFolder.entries) {
            if (item.isFolder()) {
                const folder = item as Folder;
                if (folder.title.toLowerCase().includes(filterText.toLowerCase())) {
                    filtered.addItem(folder);
                }
                const subFolders = getFilteredFolders(folder);
                for (const subItem of subFolders) {
                    filtered.addItem(subItem);
                }
            }
        }
        return getSortedChildren(filtered);
    }

    return {
        getFilteredEntries,
        getFilteredFolders,
    }
}