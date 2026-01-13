export abstract class Item {
    protected _title: string;
    protected _created_at: Date;
    protected _edited_at: Date;

    constructor(_title: string, _created_at: Date, _edited_at: Date) {
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

    public get created_at(): Date {
        return this._created_at;
    }

    public set created_at(value: Date) {
        this._created_at = value;
    }

    public get edited_at(): Date {
        return this._edited_at;
    }

    public set edited_at(value: Date) {
        this._edited_at = value;
    }
}