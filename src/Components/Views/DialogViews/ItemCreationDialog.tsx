import React from "react";
import {type Item} from "../../../Model/Item.ts";
import {useItemCreationViewModel} from "../../ViewModels/Dialog/ItemCreationViewModel.ts";
import Close from "../Icons/Close.tsx";

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
            <div className="dialogOverlay">
                <div className="dialog">
                    <Close className="closeIcon" color={"var(--text)"} onClick={cancelItemCreation}/>
                    <h3>Neues Element erstellen</h3>
                    <div className="item-creation-buttons">
                        <button className={"rectangle-button"} onClick={viewmodel.createEntry}>Eintrag</button>
                        <button className={"rectangle-button"} onClick={viewmodel.createFolder}>Ordner</button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ItemCreationDialog;