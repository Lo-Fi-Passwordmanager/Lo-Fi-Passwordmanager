import {type DocHandle, getObjectId, isValidAutomergeUrl, Repo} from "@automerge/react";
import {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import {SecurityProvider} from "./Security/SecurityProvider.ts";
import type {Patch} from "@automerge/automerge";

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

    async getHistory(): Promise<Patch[][] | null> {
        if (this._automergeURL === null) {
            return null;
        }

        const changes: Patch[][] = [];
        let prev = null;
        const handle: DocHandle<AutomergeDoc> = await this._repo.find(this._automergeURL);
        for (const entry of handle.history()!) {
            if (prev === null) {
                prev = entry;
                continue;
            }
            changes.push(handle.diff(prev, entry));
            prev = entry;
        }

        const a = [];

        changes.forEach((change) => {
            const b: (changeEntry | changeFolder)[] = [];

            change.forEach((c) => {
                const itemIndex = c.path[1] as number;
                const changedItem = getObjectId(handle.doc().items[itemIndex]);
            });
        });

        return changes;
    }
}

type changeEntry = {
    idemId: string
    changes: string[]
}