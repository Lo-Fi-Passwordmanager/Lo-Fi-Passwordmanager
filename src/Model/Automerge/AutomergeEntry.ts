import {AutomergeItem} from "./AutomergeItem.ts";

export class AutomergeEntry extends AutomergeItem {
    private _username: string;
    private _password: string;
    private _url: string;
    private _note: string;

    constructor(name: string, createdAt: number, editedAt: number, parentId: string, username: string, password: string, url: string, note: string) {
        super("folder", name, createdAt, editedAt, parentId);
        this._username = username;
        this._password = password;
        this._url = url;
        this._note = note;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get note(): string {
        return this._note;
    }

    set note(value: string) {
        this._note = value;
    }
}