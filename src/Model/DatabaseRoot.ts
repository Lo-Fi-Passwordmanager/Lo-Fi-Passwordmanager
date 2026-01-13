import {Folder} from './Folder';
import type {Item} from "./Item.ts";

class DatabaseRoot {
    private _salt: string;
    private rootFolder: Folder;

    constructor() {
        this._salt = "default"; //%FIXME hier richtiges Salt bekommen
        this.rootFolder = new Folder("root", []);
    }

    public addToRoot(item: Item) {
        this.rootFolder.addItem(item);
    }


    get salt(): string {
        return this._salt;
    }
}