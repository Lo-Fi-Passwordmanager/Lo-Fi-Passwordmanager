import {Item} from "./Item";

export class Entry extends Item {
    private _username: string;
    private _password: string;
    private _url: string;
    private _note: string;

    constructor(name: string, id: string | null, created_at: number, edited_at: number, username: string, password: string, url: string, note: string) {
        super("entry", name, id, created_at, edited_at);
        this._username = username;
        this._password = password;
        this._url = url;
        this._note = note;
    }

    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this._password = value;
    }

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {
        this._url = value;
    }

    public get note(): string {
        return this._note;
    }

    public set note(value: string) {
        this._note = value;
    }
}