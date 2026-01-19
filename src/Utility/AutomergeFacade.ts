import {type Doc, getObjectId, isValidAutomergeUrl, Repo, useDocument} from "@automerge/react";
import {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import {DatabaseRoot} from "../Model/DatabaseRoot.ts";
import type {AutomergeItem} from "../Model/Automerge/AutomergeItem.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import type {Item} from "../Model/Item.ts";
import {Folder} from "../Model/Folder.ts";
import {Entry} from "../Model/Entry.ts";
import {AutomergeEntry} from "../Model/Automerge/AutomergeEntry.ts";
import {AutomergeFolder} from "../Model/Automerge/AutomergeFolder.ts";
import {SecurityProvider} from "./Security/SecurityProvider.ts";

export type Attribute = 'name' | 'createdAt' | 'editedAt' | 'parentId' | 'username' | 'password' | 'url' | 'note'
// FIXME Hier waren im entwurf überflüssige funktionen??
// FIXME Schwierigkeit: traditionelle viewmodel mit react hooks vereinen
// TODO Doku

/**
 * Eine Klasse zum Erstellen und verifizieren von Automerge Dokumenten.
 */
export class AutomergeFacade {
    private readonly _repo: Repo
    private _salt: string | null
    private _validation: string | null
    private _automergeURL: AutomergeUrl | null
    private _securityProvider: SecurityProvider | null = null

    constructor(repo: Repo, automergeURL?: AutomergeUrl | string, securityProvider?: SecurityProvider) {
        this._repo = repo

        if (automergeURL && !isValidAutomergeUrl(automergeURL)) {
            throw new Error(`${automergeURL} is not a valid automerge URL.`)
        }

        this._automergeURL = automergeURL ? automergeURL as AutomergeUrl : null
        this._securityProvider = securityProvider ? securityProvider : null
        this._salt = null
        this._validation = null

    }

    /**
     * Erstellt eine Datenbank mit einem Salt, einem validation String und einem Namen und setzt dabei auch die {@code automergeURL}.
     * @param salt das Salt der neuen Datenbank
     * @param validation die Validation der neuen Datenbank
     * @param name der Anzeigename der neuen Datenbank
     */
    createDatabase(salt: string, validation: string) {
        const handle = this._repo.create<AutomergeDoc>(new AutomergeDoc(salt!, validation!))
        this._automergeURL = handle.url
        this._salt = salt
        this._validation = validation
    }

    /**
     * Die {@link AutomergeUrl} der Datenbank die geöffnet oder neu erstellt wurde. Ist {@code null} wenn keine geöffnet und noch keine erstellt wurde.
     */
    get automergeURL(): AutomergeUrl | null {
        return this._automergeURL
    }

    /**
     * Das Salt der gerade geöffneten Datenbank. Ist {@code null} wenn keine geöffnet und noch keine erstellt wurde.
     */
    async getSalt(): Promise<string | null> {
        if (this._salt === null) {
            if (this._automergeURL === null) {
                return null
            }
            const handle = await this._repo.find<AutomergeDoc>(this._automergeURL)
            this._salt = handle.doc().salt;
        }

        return this._salt
    }

    /**
     * Der validation String der aktuell geöffneten Datenbank. Ist {@code null} wenn keine geöffnet und noch keine erstellt wurde.
     */
    async getValidation(): Promise<string | null> {
        if (this._validation === null) {
            if (this._automergeURL === null) {
                return null
            }
            const handle = await this._repo.find<AutomergeDoc>(this._automergeURL)
            this._validation = handle.doc().validation;
        }

        return this._validation
    }

    getSecurityProvider(): SecurityProvider | null {
        return this._securityProvider
    }
}

/**
 * Returns a reactive instance of an automerge document with various helper functions.
 *
 * @param automergeFacade an {@link AutomergeFacade} initialized with a databank
 */
export const useAutomergeFacade = (automergeFacade: AutomergeFacade) => {


    if (automergeFacade.automergeURL === null) {
        throw new Error('The facade was not properly initialized. There is no valid automerge URL.')
    }

    const [doc, changeDoc] = useDocument<AutomergeDoc>(automergeFacade.automergeURL, {
        // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
        // only renders once the document is loaded
        suspense: true,
    });

    const automergeURL = automergeFacade.automergeURL
    const salt = doc.salt
    const validation = doc.validation


    const [tree, itemsById]: [DatabaseRoot, Map<string, AutomergeItem>] = buildDatabaseAsTree(doc, automergeFacade.getSecurityProvider()!);

    /**
     * Fügt neue Items ins Automerge Dokument ein.
     *
     * @param item das neu einzusetzende Item
     * @param parentId die ID des Parent Items
     */
    function insertItem(item: Item, parentId: string) {
        const automergeItem = automergeItemFromDatabaseItem(item, parentId, automergeFacade.getSecurityProvider()!);
        let parent: AutomergeItem | undefined | null = null
        if (parentId !== "") {
            parent = itemsById.get(parentId)
        }

        if (parent === undefined) {
            throw new Error(`Cannot find parent object with ID ${parentId}`)
        }

        if (parent && !isFolder(parent)) {
            throw new Error(`Cannot insert item into Item with ID ${parentId}, as it is not a folder.`)
        }

        changeDoc((doc) => insertValue(doc, parent, automergeItem))
    }

    /**
     * Löscht das angegebene Item und alle Children rekursiv.
     *
     * @param itemId die ID des Items
     */
    function deleteItem(itemId: string) {
        changeDoc((doc) => deleteValue(doc, itemId, itemsById))
    }

    /**
     * Ändert den Wert eines bestimmten Attributes eines Items
     *
     * @param itemId das Item, dessen Attribut geändert werden soll
     * @param changes die Werte die abgeändert werden sollen
     */
    function updateItem(itemId: string, changes: [Attribute, (string | Date)][]) {
        changeDoc(() => changes.forEach(([attr, val]) => updateValue(itemId, itemsById, attr, val)))
    }

    return {
        /**
         * Die {@link AutomergeUrl} der gerade geöffneten Datenbank.
         */
        automergeURL,
        /**
         * Das Salt der gerade geöffneten Datenbank.
         */
        salt,
        /**
         * Der validation String der aktuell geöffneten Datenbank.
         */
        validation,
        /**
         * Die Datenbank als {@link DatabaseRoot}. Reagiert auf Änderungen im Automerge Doc
         */
        tree,
        insertItem,
        deleteItem,
        updateItem
    };

}

/**
 * Takes an automerge document and parses it, to create a database tree structure.
 * @param automergeDoc the automerge document that should be parsed
 * @param securityProvider the security provider that should be used for decryption
 *
 * @returns a new {@link DatabaseRoot} that represents the automerge document and a map with all {@link AutomergeItem}s mapped to their ID.
 */
function buildDatabaseAsTree(automergeDoc: Doc<AutomergeDoc>, securityProvider: SecurityProvider): [DatabaseRoot, Map<string, AutomergeItem>] {

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
    const sortedByPathLength = new Map([...pathByItem.entries()].sort((a, b) => a[1].length - b[1].length));

    // Der pfadlänge nach in den passwordmanagerroot einsetzen
    for (const [item, path] of sortedByPathLength) {
        insertNestedValue(root, path, databaseItemFromAutomergeItem(item, securityProvider)) // gleiche fkt wie früher
    }

    return [root, itemsById];
}

/**
 * Takes an automerge item and creates a new Database Item form it for internal use.
 *
 * @param automergeItem the automerge item that should be used for creation
 * @param securityProvider the security provider that should be used for decryption
 */
function databaseItemFromAutomergeItem(automergeItem: AutomergeItem, securityProvider: SecurityProvider): Item {
    const name = securityProvider.decryptValue(automergeItem.name) as string;
    const id = getObjectId(automergeItem)!;
    const createdAt = new Date(automergeItem.createdAt * 1000);
    const editedAt = new Date(automergeItem.editedAt * 1000);

    if (isEntry(automergeItem)) {
        return new Entry(
            name,
            id,
            createdAt,
            editedAt,
            securityProvider.decryptValue(automergeItem.username) as string,
            securityProvider.decryptValue(automergeItem.password) as string,
            securityProvider.decryptValue(automergeItem.url) as string,
            securityProvider.decryptValue(automergeItem.note) as string
        )
    }

    return new Folder(name, id, createdAt, editedAt)
}

/**
 * Takes an item and creates a new {@link AutomergeItem} form it for internal use.
 *
 * @param item the item that should be used for creation
 * @param parentId the id that the item should get
 * @param securityProvider the security provider that should be used for encryption
 */
function automergeItemFromDatabaseItem(item: Item, parentId: string, securityProvider: SecurityProvider): AutomergeItem {
    const name = securityProvider.encryptValue(item.title);
    const createdAt = item.createdAt!.getTime() / 1000;
    const editedAt = item.editedAt!.getTime() / 1000;

    if (item.isEntry()) {
        const entry = item as Entry
        return new AutomergeEntry(
            name,
            createdAt,
            editedAt,
            securityProvider.encryptValue(parentId),
            securityProvider.encryptValue(entry.username),
            securityProvider.encryptValue(entry.password),
            securityProvider.encryptValue(entry.url),
            securityProvider.encryptValue(entry.note)
        )
    }

    return new AutomergeFolder(name, createdAt, editedAt, securityProvider.encryptValue(parentId))
}

/**
 * Checks whether the provided {@link AutomergeItem} is an {@link AutomergeEntry}
 * @param automergeItem the automerge item to check
 */
function isEntry(automergeItem: AutomergeItem): automergeItem is AutomergeEntry {
    return automergeItem.type === "entry"
}

/**
 * Checks whether the provided {@link AutomergeItem} is an {@link AutomergeFolder}
 * @param automergeItem the automerge item to check
 */
function isFolder(automergeItem: AutomergeItem): automergeItem is AutomergeFolder {
    return automergeItem.type === "folder"
}

/**
 * Recursively traverses the itemsById map, to build a path from the document root to the items location in the tree.
 *
 * @param item the item whose path to calculate
 * @param itemsById a map the maps ids to its corresponding item
 */
function buildPath(item: AutomergeItem, itemsById: Map<string, AutomergeItem>): Array<string> {
    if (item.parentId === null || item.parentId === "") {
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
    if (path.length === 0) {
        return databaseRoot.rootFolder
    }

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

function insertValue(d: AutomergeDoc, parentItem: AutomergeFolder | null, insert: AutomergeItem) {
    if (parentItem === null) {
        insert.parentId = "";
    } else {
        insert.parentId = getObjectId(parentItem)!;
    }

    d.items.push(insert)
}

function deleteValue(d: AutomergeDoc, itemId: string, itemsById: Map<string, AutomergeItem>) {

    const item = itemsById.get(itemId)

    if (item === undefined) {
        throw new Error(`Cannot find parent object with ID ${itemId}`)
    }

    const index = d.items.indexOf(item)

    d.items.splice(index, 1)

    if (isFolder(item)) {
        for (const value of d.items) {
            if (value.parentId === itemId) {
                deleteValue(d, getObjectId(value)!, itemsById)
            }
        }
    }
}

function updateValue(itemId: string, itemsById: Map<string, AutomergeItem>, attribute: Attribute, newValue: string | Date) {
    const item = itemsById.get(itemId)

    if (item === undefined) {
        throw new Error(`Cannot find parent object with ID ${itemId}`)
    }

    if ((attribute === 'createdAt' || attribute === 'editedAt')) {
        // Attribut is eines der Attribute, die ein Datum nehmen
        if (typeof newValue === 'string') {
            throw new Error(`Cannot assign value of type 'string' to value of type 'Date'`)
        }

        item[attribute] = (newValue.getTime() / 1000)

    } else {
        // Attribut is eines der Attribute, die einen String nehmen
        if (typeof newValue !== 'string') {
            throw new Error(`Cannot assign value of type 'Date' to value of type 'string'`)

        } else if (isFolder(item)) {
            if (attribute === 'name' || attribute === 'parentId') {
                item[attribute] = newValue
            }

            throw new Error(`This attribute does not exist on folders.`)

        } else {
            (item as AutomergeEntry)[attribute] = newValue
        }
    }
}