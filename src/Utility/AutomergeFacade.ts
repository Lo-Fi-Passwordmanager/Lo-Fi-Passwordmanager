import {type Doc, getObjectId, isValidAutomergeUrl, useDocument} from "@automerge/react";
import {useEffect} from "react";
import type {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import {DatabaseRoot} from "../Model/DatabaseRoot.ts";
import type {AutomergeItem} from "../Model/Automerge/AutomergeItem.ts";
import type {AutomergeUrl} from "@automerge/automerge-repo";
import type {Item} from "../Model/Item.ts";

export const useAutomergeFacade = (automergeURL: AutomergeUrl) => {
    if (!isValidAutomergeUrl(automergeURL)) {
        throw new Error(`${automergeURL} is not a valid automerge URL.`)
    }

    const [doc, changeDoc] = useDocument<AutomergeDoc>(automergeURL, {
        // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
        // only renders once the document is loaded
        suspense: true,
    });

    const tree = buildDatabaseAsTree(doc)

    // When darkMode is updated, update settingsModel
    useEffect(() => {

    }, [darkMode])


    return {
        automergeURL,
        tree
    };

}

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

function databaseItemFromAutomergeItem(automergeItem: AutomergeItem): Item {
    
}

function buildPath(item: AutomergeItem, itemsById: Map<string, AutomergeItem>): Array<string> {
    if (item.parentId === null) {
        return []
    }

    return buildPath(itemsById.get(item.parentId)!, itemsById).concat(item.parentId)
}

function findNestedValue(d: DatabaseRoot, path: string[]): Item {
    let currentValue: Item | null = d.getChildById(path[0]);

    if (currentValue === null) {
        throw Error(`Child with ID ${path[0]} does not exist on DatabaseRoot.`)
    }

    path.slice(1).forEach((id) => {
        if (currentValue!.isFolder()) {
            const nestedValue = currentValue.getChildById(id)

            if (nestedValue === null) {
                throw Error(`Child with ID ${id} does not exist on Element with ID ${currentValue.id}.`)
            }

            currentValue = nestedValue;
        } else {
            throw Error("Cannot index into Entry because it has no children")
        }
    })

    return currentValue;
}

function insertNestedValue(d: DatabaseRoot, path: string[], insert: Item) {
    const value = findNestedValue(d, path)
    if (!value.isFolder()) {
        throw Error("Cannot insert value into Entry.")
    }
    value.addItem(insert)
}