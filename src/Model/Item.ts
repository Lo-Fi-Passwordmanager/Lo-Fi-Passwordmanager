abstract class Item {
    protected _title: string;
    protected _created_at: number;
    protected _edited_at: number;

    constructor(_title: string, _created_at: number, _edited_at: number) {
        this._title = _title;
        this._created_at = _created_at;
        this._edited_at = _edited_at;
    }


    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
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
}