import {AutomergeItem} from "./AutomergeItem.ts";

/**
 * The Folder class that gets stored into the automergedocument
 */
export class AutomergeFolder extends AutomergeItem {
    constructor(name: string, createdAt: number, editedAt: number, parentId: string) {
        super("folder", name, createdAt, editedAt, parentId);
    }
}