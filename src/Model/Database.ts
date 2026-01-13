import DatabaseRoot from './DatabaseRoot';

export default class Database {
    private url: string;
    private name: string;
    private root: DatabaseRoot;

    constructor(url: string, name: string, root: DatabaseRoot) {
        this.url = url;
        this.name = name;
        this.root = root;
    }

    public getId(): string {
        return this.url;
    }

    public getName(): string {
        return this.name;
    }

    public getRoot(): DatabaseRoot {
        return this.root;
    }
}