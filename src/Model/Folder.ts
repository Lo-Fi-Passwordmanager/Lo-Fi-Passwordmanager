import {Item} from "./Item";

export class Folder extends Item {
    private _entries: Item[];

    public constructor(name: string, id: string | null, createdAt?: number, editedAt?: number) {
        super("folder", name, id, createdAt ? createdAt : -1, editedAt ? editedAt : -1);
        this._entries = []
    }

    public get entries() {
        return this._entries.slice();
    }

    public getChildById(id: string): Item | null {
        const child = this._entries.find((item) => item.id === id)
        return child ? child : null
    }

    public addItem(item: Item) {
        this._entries.push(item);
    }

}
