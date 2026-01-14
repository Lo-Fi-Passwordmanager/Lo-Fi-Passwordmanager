export abstract class AutomergeItem {
    private _type: "entry" | "folder"
    private _name: string;
    private _createdAt: number;
    private _editedAt: number;
    private _parentId: string;

    protected constructor(type: "entry" | "folder", name: string, createdAt: number, editedAt: number, parentId: string) {
        this._type = type;
        this._name = name;
        this._createdAt = createdAt;
        this._editedAt = editedAt;
        this._parentId = parentId;
    }


    get parentId(): string {
        return this._parentId;
    }

    set parentId(value: string) {
        this._parentId = value;
    }

    get editedAt(): number {
        return this._editedAt;
    }

    set editedAt(value: number) {
        this._editedAt = value;
    }

    get createdAt(): number {
        return this._createdAt;
    }

    set createdAt(value: number) {
        this._createdAt = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get type(): "entry" | "folder" {
        return this._type;
    }

    set type(value: "entry" | "folder") {
        this._type = value;
    }
}