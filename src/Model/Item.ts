import type {Folder} from "./Folder.ts";
import type {Entry} from "./Entry.ts";

export abstract class Item {
    protected _type: "entry" | "folder";
    protected _title: string;
    protected _id: string | null;
    protected _createdAt: Date | null;
    protected _editedAt: Date | null;

    protected constructor(type: "entry" | "folder", title: string, id: string | null, createdAt: Date | null, editedAt: Date | null) {
        this._type = type
        this._title = title;
        this._id = id
        this._createdAt = createdAt;
        this._editedAt = editedAt;
    }

    public get title(): string {
        return this._title;
    }

    get id(): string | null {
        return this._id;
    }

    public get createdAt(): Date | null {
        return this._createdAt;
    }

    public get editedAt(): Date | null {
        return this._editedAt;
    }

    public isFolder(): this is Folder {
        return this._type === "folder"
    }
    public isEntry(): this is Entry {
        return this._type === "entry"
    }
}