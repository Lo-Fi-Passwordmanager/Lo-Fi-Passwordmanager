import {type Doc, getObjectId} from "@automerge/react";

import type {Attribute} from "./AutomergeFacade.ts";
import type {SecurityProvider} from "./Security/SecurityProvider.ts";
import type {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import {AutomergeEntry} from "../Model/Automerge/AutomergeEntry.ts";
import {AutomergeFolder} from "../Model/Automerge/AutomergeFolder.ts";
import type {AutomergeItem} from "../Model/Automerge/AutomergeItem.ts";
import {DatabaseRoot} from "../Model/DatabaseRoot.ts";
import {Entry} from "../Model/Entry.ts";
import {Folder} from "../Model/Folder.ts";
import type {Item} from "../Model/Item.ts";


/**
 * Takes an automerge document and parses it, to create a database tree structure.
 * @param automergeDoc the automerge document that should be parsed
 * @param securityProvider the security provider that should be used for decryption
 *
 * @returns a new {@link DatabaseRoot} that represents the automerge document and a map with all {@link AutomergeItem}s mapped to their ID.
 */
export function buildDatabaseAsTree(automergeDoc: Doc<AutomergeDoc>, securityProvider: SecurityProvider): [DatabaseRoot, Map<string, AutomergeItem>] {

    const root = new DatabaseRoot(automergeDoc.salt);

    const itemsById = new Map<string, AutomergeItem>();
    // Die items in eine map packen, wo sie schnell nach id erreichbar sind
    for (const item of automergeDoc.items) {
        const id = getObjectId(item)!;
        itemsById.set(id, item);
    }

    const pathByItem = new Map<AutomergeItem, Array<string>>();
    // Eine map aufbauen, in der zu jedem item der pfad steht (pfad so wie vorher, also array an ids)
    for (const item of automergeDoc.items) {
        const path = buildPath(item, itemsById);
        pathByItem.set(item, path);
    }

    // Nach pfadlänge sortieren, damit auf jeden fall immer die eltern zuerst eingesetzt werden
    const sortedByPathLength = new Map([...pathByItem.entries()].sort((a, b) => a[1].length - b[1].length));

    // Der pfadlänge nach in den passwordmanagerroot einsetzen
    for (const [item, path] of sortedByPathLength) {
        insertNestedValue(root, path, databaseItemFromAutomergeItem(item, securityProvider)); // gleiche fkt wie früher
    }

    return [root, itemsById];
}

/**
 * Takes an automerge item and creates a new Database Item form it for internal use.
 *
 * @param automergeItem the automerge item that should be used for creation
 * @param securityProvider the security provider that should be used for decryption
 */
export function databaseItemFromAutomergeItem(automergeItem: AutomergeItem, securityProvider: SecurityProvider): Item {
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
        );
    }

    return new Folder(name, id, createdAt, editedAt);
}

/**
 * Takes an item and creates a new {@link AutomergeItem} form it for internal use.
 *
 * @param item the item that should be used for creation
 * @param parentId the id that the item should get
 * @param securityProvider the security provider that should be used for encryption
 */
export function automergeItemFromDatabaseItem(item: Item, parentId: string, securityProvider: SecurityProvider): AutomergeItem {
    const name = securityProvider.encryptValue(item.title);
    const createdAt = item.createdAt.getTime() / 1000;
    const editedAt = item.editedAt.getTime() / 1000;

    if (item.isEntry()) {
        const entry = item as Entry;
        return new AutomergeEntry(
            name,
            createdAt,
            editedAt,
            securityProvider.encryptValue(parentId),
            securityProvider.encryptValue(entry.username),
            securityProvider.encryptValue(entry.password),
            securityProvider.encryptValue(entry.url),
            securityProvider.encryptValue(entry.note)
        );
    }

    return new AutomergeFolder(name, createdAt, editedAt, securityProvider.encryptValue(parentId));
}

/**
 * Checks whether the provided {@link AutomergeItem} is an {@link AutomergeEntry}
 * @param automergeItem the automerge item to check
 */
function isEntry(automergeItem: AutomergeItem): automergeItem is AutomergeEntry {
    return automergeItem.type === "entry";
}

/**
 * Checks whether the provided {@link AutomergeItem} is an {@link AutomergeFolder}
 * @param automergeItem the automerge item to check
 */
export function isFolder(automergeItem: AutomergeItem): automergeItem is AutomergeFolder {
    return automergeItem.type === "folder";
}

/**
 * Recursively traverses the itemsById map, to build a path from the document root to the items location in the tree.
 *
 * @param item the item whose path to calculate
 * @param itemsById a map the maps ids to its corresponding item
 */
function buildPath(item: AutomergeItem, itemsById: Map<string, AutomergeItem>): Array<string> {
    if (item.parentId === null || item.parentId === "") {
        return [];
    }

    return buildPath(itemsById.get(item.parentId)!, itemsById).concat(item.parentId);
}

/**
 * Finds an item by its path (like the ones calculated by {@link buildPath}).
 *
 * @param databaseRoot the root element of a database
 * @param path the path where an item is
 */
function findNestedValue(databaseRoot: DatabaseRoot, path: string[]): Item {
    if (path.length === 0) {
        return databaseRoot.rootFolder;
    }

    let currentValue: Item | null = databaseRoot.rootFolder.getChildById(path[0]);

    if (currentValue === null) {
        throw Error(`Child with ID ${path[0]} does not exist on DatabaseRoot.`);
    }

    path.slice(1).forEach((id) => {
        if (currentValue!.isFolder()) {
            const nestedValue = (currentValue! as Folder).getChildById(id);

            if (nestedValue === null) {
                throw Error(`Child with ID ${id} does not exist on Element with ID ${currentValue!.id}.`);
            }

            currentValue = nestedValue;
        } else {
            throw Error("Cannot index into Entry because it has no children");
        }
    });

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
    const value = findNestedValue(databaseRoot, path);
    if (!value.isFolder()) {
        throw Error("Cannot insert value into Entry.");
    }
    (value as Folder).addItem(insert);
}

export function insertValue(d: AutomergeDoc, parentItem: AutomergeFolder | null, insert: AutomergeItem): string {
    if (parentItem === null) {
        insert.parentId = "";
    } else {
        insert.parentId = getObjectId(parentItem)!;
    }

    d.items.push(insert);

    return getObjectId(d.items[d.items.length - 1])!;
}

export function deleteValue(d: AutomergeDoc, itemId: string, itemsById: Map<string, AutomergeItem>) {

    const item = itemsById.get(itemId);

    if (item === undefined) {
        throw new Error(`Cannot find parent object with ID ${itemId}`);
    }

    const index = d.items.indexOf(item);

    d.items.splice(index, 1);

    if (isFolder(item)) {
        for (const item of itemsById.values()) {
            if (item.parentId === itemId) {
                deleteValue(d, getObjectId(item)!, itemsById);
            }
        }
    }
}

export function updateValue(d: AutomergeDoc, itemId: string, itemsById: Map<string, AutomergeItem>, attribute: Attribute, newValue: string | Date) {
    const item = itemsById.get(itemId);

    if (item === undefined) {
        throw new Error(`Cannot find parent object with ID ${itemId}`);
    }

    const index = d.items.indexOf(item);

    const docItem = d.items[index];

    if ((attribute === "createdAt" || attribute === "editedAt")) {
        // Attribut is eines der Attribute, die ein Datum nehmen
        if (typeof newValue === "string") {
            throw new Error(`Cannot assign value of type 'string' to value of type 'Date'`);
        }

        docItem[attribute] = (newValue.getTime() / 1000);

    } else {
        // Attribut is eines der Attribute, die einen String nehmen
        if (typeof newValue !== "string") {
            throw new Error(`Cannot assign value of type 'Date' to value of type 'string'`);

        } else if (isFolder(docItem)) {
            if (attribute === "name" || attribute === "parentId") {
                docItem[attribute] = newValue;
                return;
            }

            throw new Error(`This attribute does not exist on folders.`);

        } else {
            (docItem as AutomergeEntry)[attribute] = newValue;
        }
    }
}