export abstract class Item {
    protected _type: "entry" | "folder";
    private _title: string;
    protected _id: string | null;
    protected _createdAt: Date;
    protected _editedAt: Date | null;

    protected constructor(type: "entry" | "folder", title: string, id: string | null, createdAt: Date | null, editedAt: Date | null) {
        this._type = type
        this._title = title;
        this._id = id
        if (createdAt === null || createdAt === undefined) {
            this._createdAt = new Date();
        } else {
            this._createdAt = createdAt;
        }
        if (editedAt === null || editedAt === undefined) {
            this._editedAt = new Date();
        }
        this._editedAt = editedAt;
    }


    set title(value: string) {
        this._title = value;
        this.updateEditedAt();
    }

    public get title(): string {
        return this._title;
    }

    get id(): string | null {
        return this._id;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get editedAt(): Date | null {
        return this._editedAt;
    }

    public isFolder() {
        return this._type === "folder"
    }

    public isEntry(){
        return this._type === "entry"
    }

    protected updateEditedAt() {
        this._editedAt = new Date();
    }
}