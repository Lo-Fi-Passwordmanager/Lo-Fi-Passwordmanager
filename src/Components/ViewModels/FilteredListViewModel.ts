import {Folder} from "../../Model/Folder.ts";
import {Entry} from "../../Model/Entry.ts";

export const useFilteredListViewModel = (root: Folder, filterText: string) => {

    function getFilteredEntries(startFolder: Folder = root): Folder {
        const filtered: Folder = new Folder("filteredEntries", "filteredEntriesId");
        for (const item of startFolder.entries) {
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
        for (const item of startFolder.entries) {
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

    return {
        getFilteredEntries,
        getFilteredFolders,
    }
}