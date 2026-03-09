import {Folder} from "./Folder";

export class DatabaseRoot {
    private readonly _salt: string;
    private readonly _rootFolder: Folder;

    constructor(salt: string) {
        this._salt = salt;
        this._rootFolder = new Folder("root", "");
    }

    get rootFolder(): Folder {
        return this._rootFolder;
    }

    get salt(): string {
        return this._salt;
    }
}