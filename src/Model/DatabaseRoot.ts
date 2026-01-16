import {Folder} from './Folder';
import type {Item} from "./Item.ts";

export class DatabaseRoot {
    private _rootFolder: Folder;

    constructor() {
        this._rootFolder = new Folder("root", null)
    }

    public addItem(item: Item) {
        this._rootFolder.addItem(item);
    }

    public getChildById(id: string): Item | null {
        return this._rootFolder.getChildById(id)
    }
}