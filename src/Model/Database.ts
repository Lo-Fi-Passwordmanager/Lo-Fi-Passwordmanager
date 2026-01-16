export default class Database {
    private url: string;
    private name: string;

    constructor(url: string, name: string) {
        this.url = url;
        this.name = name;
    }

    public getId(): string {
        return this.url;
    }

    public getName(): string {
        return this.name;
    }
}