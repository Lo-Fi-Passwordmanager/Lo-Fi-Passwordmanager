import React from "react";
import {type Item} from "../../../Model/Item.ts";
import {useItemCreationViewModel} from "../../ViewModels/Dialog/ItemCreationViewModel.ts";
import Close from "../Icons/Close.tsx";
import Dialog from "./Dialog.tsx";

interface ItemCreationDialogProps {
    addItem: (item: Item) => void;
    cancelItemCreation: () => void;
}

const ItemCreationDialog: React.FC<ItemCreationDialogProps> = ({
                                                                   addItem,
                                                                   cancelItemCreation,
                                                               }: ItemCreationDialogProps) => {
    const viewmodel = useItemCreationViewModel(addItem, cancelItemCreation);


    return (<>
            <Dialog title={"Neues Element erstellen"} onCloseDialog={cancelItemCreation}>
                <Close className="closeIcon" color={"var(--text)"} onClick={cancelItemCreation}/>
                <div className="item-creation-buttons">
                    <button className={"rectangle-button"} onClick={viewmodel.createEntry}>Eintrag</button>
                    <button className={"rectangle-button"} onClick={viewmodel.createFolder}>Ordner</button>
                </div>
            </Dialog>
        </>
    );
}
export default ItemCreationDialog;