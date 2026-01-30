import React from "react";
import Dialog from "./Dialog.tsx";
import {Item} from "../../../Model/Item.ts";
import {HiTrash} from "react-icons/hi";

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
                Die Datenbank '<strong>{database}</strong>' wirklich löschen?
            </span>
                    <div>
                        <button className={"rectangleButton"} onClick={() => onConfirmDb(database)}>
                            Löschen
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
                Den {item.isEntry() ? "Eintrag" : "Ordner"} '<strong>{item.title}</strong>' wirklich löschen?
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