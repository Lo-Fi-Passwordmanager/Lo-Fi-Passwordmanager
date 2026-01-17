import type {AutomergeItem} from "./AutomergeItem.ts";

export class AutomergeDoc {

    salt: string
    validation: string
    items: AutomergeItem[]

    constructor(salt: string, validation: string) {
        this.salt = salt;
        this.validation = validation;
        this.items = [];
    }
}