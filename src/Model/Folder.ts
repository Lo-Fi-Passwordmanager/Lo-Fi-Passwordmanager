import {Item} from "./Item";

export class Folder extends Item {
    private _entries: Item[];

    public constructor(name: string, id: string | null, createdAt?: number, edited_at?: number) {
        super("folder", name, id, createdAt ? createdAt : -1, edited_at ? edited_at : -1);
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
