import React from "react";
import Dialog from "./Dialog.tsx";
import {Item} from "../../../Model/Item.ts";

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
                    <button className={"rectangleButton"} onClick={() => onConfirm(item)}>
                        Löschen
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default DeleteConfirmationDialog;