import {Item} from "./Item";

class Folder extends Item {
    private entries: Item[];

    public getEntries() {
        return this.entries.slice();
    }

    public constructor(name: string) {
        super(name, 0, 0);
    }

    public addItem(item: Item) {
        this.entries.push(item);
    }

}
