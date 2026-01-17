export default class Database {
    #id: string;
    #name: string;

    constructor(id: string, name: string) {
        this.#id = id;
        this.#name = name;
    }

    get Id(): string {
        return this.#id;
    }

    get Name(): string {
        return this.#name;
    }
}