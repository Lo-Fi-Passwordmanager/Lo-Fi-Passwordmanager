import {Folder} from './Folder';
import type {Item} from "./Item.ts";

export class DatabaseRoot {
    private readonly _salt: string;
    private readonly _rootFolder: Folder;

    constructor(salt: string) {
        this._salt = salt
        this._rootFolder = new Folder("root", "")
    }

    get rootFolder(): Folder {
        return this._rootFolder
    }

    public addItem(item: Item) {
        this._rootFolder.addItem(item);
    }

    public getChildById(id: string): Item | null {
        return this._rootFolder.getChildById(id)
    }

    get salt(): string {
        return this._salt;
    }
}