import type {Folder} from "./Folder.ts";

export abstract class Item {
    private _type: "entry" | "folder";
    protected _title: string;
    private _id: string | null;
    protected _created_at: number;
    protected _edited_at: number;

    protected constructor(type: "entry" | "folder", title: string, id: string | null, created_at: number, edited_at: number) {
        this._type = type
        this._title = title;
        this._id = id
        this._created_at = created_at;
        this._edited_at = edited_at;
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

    public get created_at(): number {
        return this._created_at;
    }

    public set created_at(value: number) {
        this._created_at = value;
    }

    public get edited_at(): number {
        return this._edited_at;
    }

    public set edited_at(value: number) {
        this._edited_at = value;
    }

    public isFolder(): this is Folder {
        return this._type === "folder"
    }
}