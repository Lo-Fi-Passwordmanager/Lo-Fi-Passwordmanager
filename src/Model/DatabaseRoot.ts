import {Folder} from './Folder';

class DatabaseRoot {
    private _salt: string;
    private rootFolder: Folder = new Folder("root");

    public addToRoot(item: Item) {
        root.addEntry(item);
    }


    get salt(): string {
        return this._salt;
    }
}