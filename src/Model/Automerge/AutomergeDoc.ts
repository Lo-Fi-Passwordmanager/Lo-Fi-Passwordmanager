import type {AutomergeItem} from "./AutomergeItem.ts";

/**
 * The class that gets stored into the automergedocument as parent
 */
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