import {type Doc, getObjectId, isValidAutomergeUrl, Repo, useDocument} from "@automerge/react";
import {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import {DatabaseRoot} from "../Model/DatabaseRoot.ts";
import type {AutomergeItem} from "../Model/Automerge/AutomergeItem.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import type {Item} from "../Model/Item.ts";
import {Folder} from "../Model/Folder.ts";
import {Entry} from "../Model/Entry.ts";
import type {AutomergeEntry} from "../Model/Automerge/AutomergeEntry.ts";
import {storeDatabase} from "../Components/ViewModels/PasswordManagerViewModel.ts";

export class AutomergeFacade {
    private readonly _repo: Repo
    private _salt: string | null
    private _validation: string | null
    private readonly _automergeURL: AutomergeUrl | null

    constructor(repo: Repo, automergeURL?: AutomergeUrl | string) {
        this._repo = repo

        if (automergeURL && !isValidAutomergeUrl(automergeURL)) {
            throw new Error(`${automergeURL} is not a valid automerge URL.`)
        }

        this._automergeURL = automergeURL ? automergeURL as AutomergeUrl : null
        this._salt = null
        this._validation = null

    }

    createDatabase(salt: string, validation: string, name: string) {
        const handle = this._repo.create<AutomergeDoc>(new AutomergeDoc(salt!, validation!))
        const automergeURL = handle.url
        this._salt = salt
        this._validation = validation
        storeDatabase(name!, automergeURL)
    }

    get automergeURL(): AutomergeUrl | null {
        return this._automergeURL
    }

    async getSalt(): Promise<string> {
        if (this._salt === null) {
            if (this._automergeURL === null) {
                throw new Error("No automergeURL found.")
            }
            const handle = await this._repo.find<AutomergeDoc>(this._automergeURL)
            this._salt = handle.doc().salt;
        }

        return this._salt
    }

    async getValidation(): Promise<string> {
        if (this._validation === null) {
            if (this._automergeURL === null) {
                throw new Error("No automergeURL found.")
            }
            const handle = await this._repo.find<AutomergeDoc>(this._automergeURL)
            this._validation = handle.doc().validation;
        }

        return this._validation
    }
}

/**
 * Returns a reactive instance of an automerge document with various helper functions.
 *
 * @param automergeFacade an {@link AutomergeFacade} initialized with a databank
 */
export const useAutomergeFacade = (automergeFacade: AutomergeFacade) => {


    if (automergeFacade.automergeURL === null) {
        throw new Error('The facade was not properly initialized is not a valid automerge URL.')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [doc, changeDoc] = useDocument<AutomergeDoc>(automergeFacade.automergeURL, {
        // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
        // only renders once the document is loaded
        suspense: true,
    });

    const automergeURL = automergeFacade.automergeURL
    const salt = doc.salt
    const validation = doc.validation

    const tree = buildDatabaseAsTree(doc)

    return {
        automergeURL,
        salt,
        validation,
        tree
    };

}

/**
 * Takes an automerge document and parses it, to create a database tree structure.
 * @param automergeDoc
 *
 * @returns a new {@link DatabaseRoot} that represents the automerge document
 */
function buildDatabaseAsTree(automergeDoc: Doc<AutomergeDoc>): DatabaseRoot {

    const root = new DatabaseRoot(automergeDoc.salt)

    const itemsById = new Map<string, AutomergeItem>()
    // Die items in eine map packen, wo sie schnell nach id erreichbar sind
    for (const item of automergeDoc.items) {
        const id = getObjectId(item)!
        itemsById.set(id, item);
    }

    const pathByItem = new Map<AutomergeItem, Array<string>>()
    // Eine map aufbauen, in der zu jedem item der pfad steht (pfad so wie vorher, also array an ids)
    for (const item of automergeDoc.items) {
        const path = buildPath(item, itemsById)
        pathByItem.set(item, path)
    }

    // Nach pfadlänge sortieren, damit auf jeden fall immer die eltern zuerst eingesetzt werden
    const sortedByPathLenght = new Map([...pathByItem.entries()].sort((a, b) => a[1].length - b[1].length));

    // Der pfadlänge nach in den passwordmanagerroot einsetzen
    for (const [item, path] of sortedByPathLenght) {
        insertNestedValue(root, path, databaseItemFromAutomergeItem(item)) // gleiche fkt wie früher
    }

    return root;
}

/**
 * Takes an automerge item and creates a new Database Item form it for internal use.
 *
 * @param automergeItem the automerge item that should be used for creation
 */
function databaseItemFromAutomergeItem(automergeItem: AutomergeItem): Item {
    const name = automergeItem.name;
    const id = getObjectId(automergeItem);
    const createdAt = new Date(automergeItem.createdAt * 1000);
    const editedAt = new Date(automergeItem.editedAt * 1000);

    if (isEntry(automergeItem)) {
        return new Entry(name, id, createdAt, editedAt, automergeItem.username, automergeItem.password, automergeItem.url, automergeItem.note)
    }

    return new Folder(name, id, createdAt, editedAt)
}

/**
 * Checks whether the provided {@link AutomergeItem} is an {@link AutomergeEntry}
 * @param automergeItem the automerge item to check
 */
function isEntry(automergeItem: AutomergeItem): automergeItem is AutomergeEntry {
    return automergeItem.type === "entry"
}

/**
 * Recursively traverses the itemsById map, to build a path from the document root to the items location in the tree.
 *
 * @param item the item whose path to calculate
 * @param itemsById a map the maps ids to its corresponding item
 */
function buildPath(item: AutomergeItem, itemsById: Map<string, AutomergeItem>): Array<string> {
    if (item.parentId === null) {
        return []
    }

    return buildPath(itemsById.get(item.parentId)!, itemsById).concat(item.parentId)
}

/**
 * Finds an item by its path (like the ones calculated by {@link buildPath}).
 *
 * @param databaseRoot the root element of a database
 * @param path the path where an item is
 */
function findNestedValue(databaseRoot: DatabaseRoot, path: string[]): Item {
    let currentValue: Item | null = databaseRoot.getChildById(path[0]);

    if (currentValue === null) {
        throw Error(`Child with ID ${path[0]} does not exist on DatabaseRoot.`)
    }

    path.slice(1).forEach((id) => {
        if (currentValue!.isFolder()) {
            const nestedValue = (currentValue! as Folder).getChildById(id)

            if (nestedValue === null) {
                throw Error(`Child with ID ${id} does not exist on Element with ID ${currentValue!.id}.`)
            }

            currentValue = nestedValue;
        } else {
            throw Error("Cannot index into Entry because it has no children")
        }
    })

    return currentValue;
}

/**
 * Inserts an item at a path, if the new parent at the path is a folder.
 *
 * @param databaseRoot the root element of a database
 * @param path the path where the new parent object is
 * @param insert the item which to insert
 */
function insertNestedValue(databaseRoot: DatabaseRoot, path: string[], insert: Item) {
    const value = findNestedValue(databaseRoot, path)
    if (!value.isFolder()) {
        throw Error("Cannot insert value into Entry.")
    }
    (value as Folder).addItem(insert)
}