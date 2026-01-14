import {Item} from "./Item";

export class Folder extends Item {
    private _entries: Item[];

    public constructor(name: string, id: string | null, createdAt?: Date, editedAt?: Date) {
        super("folder", name, id, createdAt ? createdAt : null, editedAt ? editedAt : null);
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
        this.updateEditedAt();
    }

    public removeItem(item: Item): boolean {
        const index = this._entries.indexOf(item);
        this.updateEditedAt();
        if (index >= 0) {
            this._entries.splice(index, 1);
            return true;
        }
        return false;
    }

}
