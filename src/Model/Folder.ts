import {Item} from "./Item";

export class Folder extends Item {
    private entries: Item[];

    public getEntries() {
        return this.entries.slice();
    }

    public constructor(name: string, entries: Item[]) {
        super(name, new Date(), new Date());
        this.entries = entries;
    }

    public addItem(item: Item) {
        this.entries.push(item);
    }

}
