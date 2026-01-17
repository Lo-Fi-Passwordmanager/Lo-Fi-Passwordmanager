import {AutomergeItem} from "./AutomergeItem.ts";

export class AutomergeFolder extends AutomergeItem {
    constructor(name: string, createdAt: number, editedAt: number, parentId: string | null) {
        super("folder", name, createdAt, editedAt, parentId);
    }
}