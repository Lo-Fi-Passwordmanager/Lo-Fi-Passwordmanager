import {useDocument} from "@automerge/react";

import type { AutomergeFacade} from "./AutomergeFacade.ts";
import {type Attribute} from "./AutomergeFacade.ts";
import {
    automergeItemFromDatabaseItem,
    buildDatabaseAsTree,
    deleteValue,
    insertValue,
    isFolder,
    updateValue
} from "./AutomergeHelper.ts";
import type {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import type {AutomergeItem} from "../Model/Automerge/AutomergeItem.ts";
import type {DatabaseRoot} from "../Model/DatabaseRoot.ts";
import type {Entry} from "../Model/Entry.ts";
import type {Folder} from "../Model/Folder.ts";
import type {Item} from "../Model/Item.ts";


/**
 * Returns a reactive instance of an automerge document with various helper functions.
 *
 * @param automergeFacade an {@link AutomergeFacade} initialized with a databank
 */
export const useAutomergeFacade = (automergeFacade: AutomergeFacade) => {


    if (automergeFacade.automergeURL === null) {
        throw new Error("The facade was not properly initialized. There is no valid automerge URL.");
    }

    const [doc, changeDoc] = useDocument<AutomergeDoc>(automergeFacade.automergeURL, {
        // This hooks the `useDocument` into reacts suspense infrastructure so the whole component
        // only renders once the document is loaded
        suspense: true
    });

    const automergeURL = automergeFacade.automergeURL;
    const salt = doc.salt;
    const validation = doc.validation;


    const [tree, itemsById]: [DatabaseRoot, Map<string, AutomergeItem>] = buildDatabaseAsTree(doc, automergeFacade.getSecurityProvider()!);

    /**
     * Fügt neue Items ins Automerge Dokument ein.
     *
     * @param item das neu einzusetzende Item
     * @param parentId die ID des Parent Items
     */
    function insertItem(item: Item, parentId: string): string {
        const automergeItem = automergeItemFromDatabaseItem(item, parentId, automergeFacade.getSecurityProvider()!);
        let parent: AutomergeItem | undefined | null = null;
        if (parentId !== "") {
            parent = itemsById.get(parentId);
        }

        if (parent === undefined) {
            throw new Error(`Cannot find parent object with ID ${parentId}`);
        }

        if (parent && !isFolder(parent)) {
            throw new Error(`Cannot insert item into Item with ID ${parentId}, as it is not a folder.`);
        }

        let newItemId = "";

        changeDoc((doc) => {newItemId = insertValue(doc, parent, automergeItem);});

        return newItemId;
    }

    /**
     * Moves the item up by one level in its hirachy. This is usually done due to not wanting to recursive delete
     * @param id the id of the item that wants to get moved up. Therefore it s parent should not be the root
     */
    function moveUpInTree(id: string) {
        const item = itemsById.get(id);
        if (!item) {
            return;
        }

        const itemId: string|undefined = item.parentId;
        if (itemId && tree.rootFolder.id == itemId) {
            return;
        }
        const newParent = itemsById.get(item.parentId);
        if (newParent) {
            updateItem(id, [["parentId", newParent.parentId]])
            itemsById.set(id, newParent);
        }
    }

    /**
     * Löscht das angegebene Item und alle Children rekursiv.
     *
     * @param itemId die ID des Items
     */
    function deleteItem(itemId: string) {
        changeDoc((doc) => deleteValue(doc, itemId, itemsById));
    }

    /**
     * Ändert den Wert eines bestimmten Attributes eines Items.
     * Das Attribut "editedAt" wird automatische gesetzt.
     *
     * @param itemId das Item, dessen Attribut geändert werden soll
     * @param changes die Werte die abgeändert werden sollen
     */
    function updateItem(itemId: string, changes: [Attribute, (string | Date)][]) {
        changeDoc(
            (doc) => {
                changes.forEach(
                    ([attr, val]) => updateValue(doc, itemId, itemsById, attr, (typeof val == "string" && attr !== "parentId") ? automergeFacade.getSecurityProvider()!.encryptValue(val) : val)
                );
                updateValue(doc, itemId, itemsById, "editedAt", new Date());
            }
        );
    }

    /**
     * Exports the current file structure in a csv like string array, which could be saved in such.
     */
    function exportToCsvArray(): string[] {
        const entryArray: Entry[] = dfsSearchExport(tree.rootFolder);
        const returnArray: string[] = [];
        returnArray[0] = "\"Account\",\"Login Name\",\"Password\",\"Web Site\",\"Comments\"";
        for (const entry of entryArray) {
            returnArray.push(`"${entry.title}","${entry.username}","${entry.password}","${entry.url}","${entry.note}"`);
        }
        return returnArray;
    }

    function dfsSearchExport(folder: Folder): Entry[] {
        let entryArray: Entry[] = [];
        for (const item of folder.items) {
            if (item.isFolder()) {
                entryArray = entryArray.concat(dfsSearchExport(item as Folder));
            } else {
                entryArray.push(item as Entry);
            }
        }
        return entryArray;
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
        updateItem,
        /**
         * The Map containing a 1 to 1 maping of all active ids to their items
         */
        itemsById,
        exportToCsvArray,
        moveUpInTree
    };
};
export type AutomergeFacadeHook = ReturnType<typeof useAutomergeFacade>;
