import React from "react";
import {HiTrash} from "react-icons/hi";

import Dialog from "./Dialog.tsx";
import type {Item} from "../../../Model/Item.ts";

/**
 * A dialog that confirms the deletion of either an item or a database.
 *
 * @param database the name of the database to be deleted (if any)
 * @param item the item to be deleted (if any)
 * @param onConfirmItem method called when the deletion of an item is confirmed
 * @param onConfirmDb method called when the deletion of a database is confirmed
 * @param onClose method called to close the dialog
 */
const DeleteConfirmationDialog: React.FC<{
    database?: string | null,
    item?: Item | null,
    onConfirmItem?: (subject: Item) => void,
    onConfirmDb?: (database: string) => void,
    onClose: () => void
}> = ({database, item, onConfirmItem, onConfirmDb, onClose}) => {

    if (!item && !database) {
        return null;
    } else if (database && onConfirmDb) {
        return (
            <Dialog title="Löschen bestätigen" onCloseDialog={onClose}>
                <div className={"confirmDeleteWrapper"}>
            <span>
                Die Datenbank &quot;<strong>{database}</strong>&quot; wirklich löschen?
            </span>
                    <div>
                        <button className={"rectangle-button delete"} onClick={() => onConfirmDb(database)}>
                            <HiTrash size={24}/> Löschen
                        </button>
                    </div>
                </div>
            </Dialog>
        );
    } else if (item && onConfirmItem) {
        return (
            <Dialog title="Löschen bestätigen" onCloseDialog={onClose}>
                <div className={"confirmDeleteWrapper"}>
            <span>
                Den {item.isEntry() ? "Eintrag" : "Ordner"} &quot;<strong>{item.title}</strong>&quot; wirklich löschen?
            </span>
                    <div>
                        <button className={"rectangle-button delete"} onClick={() => onConfirmItem(item)}>
                            <HiTrash size={24}/> Löschen
                    </button>
                </div>
            </div>
        </Dialog>
    );}
}
export default DeleteConfirmationDialog;