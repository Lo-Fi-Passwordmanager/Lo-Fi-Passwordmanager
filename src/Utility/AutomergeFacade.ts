import {type DocHandle, getObjectId, isValidAutomergeUrl, Repo} from "@automerge/react";
import {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import {SecurityProvider} from "./Security/SecurityProvider.ts";
import type {HistoryEntry} from "../Model/Automerge/HistoryEntry.ts";

export type Attribute = "name" | "createdAt" | "editedAt" | "parentId" | "username" | "password" | "url" | "note"
// FIXME Hier waren im entwurf überflüssige funktionen??
// FIXME Schwierigkeit: traditionelle viewmodel mit react hooks vereinen
// TODO Doku

/**
 * Eine Klasse zum Erstellen und verifizieren von Automerge Dokumenten.
 */
export class AutomergeFacade {
    private readonly _repo: Repo;
    private _salt: string | null;
    private _validation: string | null;
    private _automergeURL: AutomergeUrl | null;
    private _securityProvider: SecurityProvider | null = null;

    constructor(repo: Repo, automergeURL?: AutomergeUrl | string, securityProvider?: SecurityProvider) {
        this._repo = repo;

        if (automergeURL && !isValidAutomergeUrl(automergeURL)) {
            throw new Error(`${automergeURL} is not a valid automerge URL.`);
        }

        this._automergeURL = automergeURL ? automergeURL as AutomergeUrl : null;
        this._securityProvider = securityProvider ? securityProvider : null;
        this._salt = null;
        this._validation = null;

    }

    /**
     * Erstellt eine Datenbank mit einem Salt, einem validation String und einem Namen und setzt dabei auch die {@code automergeURL}.
     * @param salt das Salt der neuen Datenbank
     * @param validation die Validation der neuen Datenbank
     */
    createDatabase(salt: string, validation: string) {
        const handle = this._repo.create<AutomergeDoc>(new AutomergeDoc(salt!, validation!));
        this._automergeURL = handle.url;
        this._salt = salt;
        this._validation = validation;
    }

    /**
     * Die {@link AutomergeUrl} der Datenbank die geöffnet oder neu erstellt wurde. Ist {@code null} wenn keine geöffnet und noch keine erstellt wurde.
     */
    get automergeURL(): AutomergeUrl | null {
        return this._automergeURL;
    }

    /**
     * Das Salt der gerade geöffneten Datenbank. Ist {@code null} wenn keine geöffnet und noch keine erstellt wurde.
     */
    async getSalt(): Promise<string | null> {
        if (this._salt === null) {
            if (this._automergeURL === null) {
                return null;
            }
            const handle = await this._repo.find<AutomergeDoc>(this._automergeURL);
            this._salt = handle.doc().salt;
        }

        return this._salt;
    }

    /**
     * Der validation String der aktuell geöffneten Datenbank. Ist {@code null} wenn keine geöffnet und noch keine erstellt wurde.
     */
    async getValidation(): Promise<string | null> {
        if (this._validation === null) {
            if (this._automergeURL === null) {
                return null;
            }
            const handle = await this._repo.find<AutomergeDoc>(this._automergeURL);
            this._validation = handle.doc().validation;
        }

        return this._validation;
    }

    getSecurityProvider(): SecurityProvider | null {
        return this._securityProvider;
    }

    async getHistory(): Promise<HistoryEntry[] | null> {
        if (this._automergeURL === null) {
            return null;
        }

        let prev = null;
        const history: HistoryEntry[] = [];
        const handle: DocHandle<AutomergeDoc> = await this._repo.find(this._automergeURL);

        for (const historyEntry of handle.history()!) {
            let historyItem: HistoryEntry | undefined = undefined;

            if (prev === null) {
                prev = historyEntry;
                continue;
            }

            const changes = handle.diff(prev, historyEntry);

            const prevDoc = handle.view(prev);
            const currentDoc = handle.view(historyEntry);

            let inserted = false;

            for (const change of changes) {
                const itemIndex = change.path[1] as number;
                const action = change.action;

                if (action === "insert") {
                    inserted = true;
                }

                if (inserted) {
                    // Es wurde im aktuelle change set ein neues Item erstellt
                    const newItem = currentDoc.doc().items[itemIndex];
                    const newItemId = getObjectId(newItem)!;

                    if (action === "insert") {
                        // Das Item wird erstellt
                        historyItem = {
                            itemId: newItemId,
                            changes: new Map(),
                            type: "new",
                            item: newItem
                        };
                        continue;
                    }

                    // Für alle nachfoldenden Änderungen können wir immer nur das neue Item updaten, da es kein altes gibt, zu dem man Änderungen zeigen könnte
                    // @ts-expect-error wird vorher immer assigned, hier entsteht kein Fehler
                    historyItem.item = newItem;
                } else {
                    const prevItem = prevDoc.doc().items[itemIndex];
                    const prevItemId = getObjectId(prevItem)!;

                    const changedValueKey = change.path[2] as string;
                    let newValue: string | number | null = null;

                    if (action === "put" || action === "splice") {
                        newValue = (change.value as string | number);
                    }

                    if (historyItem === undefined) {
                        historyItem = {
                            itemId: prevItemId,
                            changes: newValue ? new Map([[changedValueKey, newValue]]) : new Map(),
                            type: (action === "del") ? "deleted" : "update",
                            item: prevItem
                        };
                    } else {
                        if (newValue) {
                            historyItem.changes.set(changedValueKey, newValue);
                        }
                    }
                }
            }
            if (historyItem) {
                history.push(historyItem);
            }

            prev = historyEntry;
        }

        return history;
    }

    /**
     * Exports the current Databse to binary
     * If the automergeUrl is not set, this functino does not work and returns undefinded
     */
    public exportAutomergeToBinary(): Promise<Uint8Array | undefined> {
        return this._repo.export(this._automergeURL!);
    }
}

