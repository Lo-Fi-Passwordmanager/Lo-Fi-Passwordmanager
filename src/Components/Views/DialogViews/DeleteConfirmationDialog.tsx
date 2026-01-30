import React from "react";
import Dialog from "./Dialog.tsx";
import {Item} from "../../../Model/Item.ts";
import {HiTrash} from "react-icons/hi";

const DeleteConfirmationDialog: React.FC<{
    item: Item,
    onConfirm: (item: Item) => void,
    onClose: () => void
}> = ({item, onConfirm, onClose}) => {

    if (!item) {
        return null;
    }

    return (
        <Dialog title="Löschen bestätigen" onCloseDialog={onClose}>
            <div className={"confirmDeleteWrapper"}>
            <span>
                Den {item.isEntry() ? "Eintrag" : "Ordner"} '<strong>{item.title}</strong>' wirklich löschen?
            </span>
                <div>
                    <button className={"rectangle-button delete"} onClick={() => onConfirm(item)}>
                        <HiTrash size={24}/> Löschen
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default DeleteConfirmationDialog;