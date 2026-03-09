import {Item} from "./Item";

export class Folder extends Item {
    private _items: Item[];

    public constructor(name: string, id: string, createdAt?: Date, editedAt?: Date) {
        super("folder", name, id, createdAt ? createdAt : new Date(), editedAt ? editedAt : new Date());
        this._items = [];
    }

    public get items() {
        return this._items.slice();
    }

    public getChildById(id: string): Item | null {
        const child = this._items.find((item) => item.id === id);
        return child ? child : null;
    }

    public addItem(item: Item) {
        this._items.push(item);
    }
}
