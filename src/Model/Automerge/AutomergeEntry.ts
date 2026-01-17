import {AutomergeItem} from "./AutomergeItem.ts";

export class AutomergeEntry extends AutomergeItem {
    username: string;
    password: string;
    url: string;
    note: string;

    constructor(name: string, createdAt: number, editedAt: number, parentId: string | null, username: string, password: string, url: string, note: string) {
        super("entry", name, createdAt, editedAt, parentId);
        this.username = username;
        this.password = password;
        this.url = url;
        this.note = note;
    }
}