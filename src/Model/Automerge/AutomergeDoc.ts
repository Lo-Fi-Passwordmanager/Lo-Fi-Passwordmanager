import type {AutomergeItem} from "./AutomergeItem.ts";

export class AutomergeDoc {

    private _salt: string
    private _validation: string
    private _items: AutomergeItem[]

    constructor(salt: string, validation: string, items: AutomergeItem[]) {
        this._salt = salt;
        this._validation = validation;
        this._items = items;
    }

    get salt(): string {
        return this._salt;
    }

    set salt(value: string) {
        this._salt = value;
    }

    get validation(): string {
        return this._validation;
    }

    set validation(value: string) {
        this._validation = value;
    }

    get items(): AutomergeItem[] {
        return this._items;
    }

    set items(value: AutomergeItem[]) {
        this._items = value;
    }
}