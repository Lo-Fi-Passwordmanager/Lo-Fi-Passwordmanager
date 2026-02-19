import React from "react";

import Dialog from "./Dialog.tsx";
import {type Item} from "../../../Model/Item.ts";
import {useItemCreationViewModel} from "../../ViewModels/Dialog/ItemCreationViewModel.ts";
import Close from "../Icons/Close.tsx";

interface ItemCreationDialogProps {
    addItem: (item: Item) => void;
    cancelItemCreation: () => void;
}

/**
 * A dialog that allows the user to create a new item (entry or folder).
 *
 * @param addItem Function to add the newly created item.
 * @param cancelItemCreation Function to cancel the item creation process.
 */
const ItemCreationDialog: React.FC<ItemCreationDialogProps> = ({
                                                                   addItem,
                                                                   cancelItemCreation,
                                                               }: ItemCreationDialogProps) => {
    const viewModel = useItemCreationViewModel(addItem, cancelItemCreation);


    return (<>
            <Dialog title={"Neues Element erstellen"} onCloseDialog={cancelItemCreation}>
                <Close className="closeIcon" color={"var(--text)"} onClick={cancelItemCreation}/>
                <div className="item-creation-buttons">
                    <button className={"rectangle-button"} onClick={viewModel.createEntry}>Eintrag</button>
                    <button className={"rectangle-button"} onClick={viewModel.createFolder}>Ordner</button>
                </div>
            </Dialog>
        </>
    );
}
export default ItemCreationDialog;