import type {Folder} from "./Folder.ts";

export abstract class Item {
    private _type: "entry" | "folder";
    protected _title: string;
    private _id: string | null;
    protected _createdAt: number;
    protected _editedAt: number;

    protected constructor(type: "entry" | "folder", title: string, id: string | null, createdAt: number, editedAt: number) {
        this._type = type
        this._title = title;
        this._id = id
        this._createdAt = createdAt;
        this._editedAt = editedAt;
    }


    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    get id(): string | null {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    public get createdAt(): number {
        return this._createdAt;
    }

    public set createdAt(value: number) {
        this._createdAt = value;
    }

    public get editedAt(): number {
        return this._editedAt;
    }

    public set editedAt(value: number) {
        this._editedAt = value;
    }

    public isFolder(): this is Folder {
        return this._type === "folder"
    }
}