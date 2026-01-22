import {useDocument} from "@automerge/react";
import {AutomergeDoc} from "../Model/Automerge/AutomergeDoc.ts";
import {DatabaseRoot} from "../Model/DatabaseRoot.ts";
import type {AutomergeItem} from "../Model/Automerge/AutomergeItem.ts";
import type {Item} from "../Model/Item.ts";
import {type Attribute, AutomergeFacade} from "./AutomergeFacade.ts";
import {
    automergeItemFromDatabaseItem,
    buildDatabaseAsTree,
    deleteValue,
    insertValue,
    isFolder,
    updateValue
} from "./AutomergeHelper.ts";


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
            (doc) => changes
                .forEach(
                    ([attr, val]) => updateValue(doc, itemId, itemsById, attr, (typeof val == "string") ? automergeFacade.getSecurityProvider()!.encryptValue(val) : val)
                )
        );
        changeDoc((doc) => updateValue(doc, itemId, itemsById, "editedAt", new Date()));
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

};