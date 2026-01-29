import React from "react";
import {type Item} from "../../../Model/Item.ts";
import {useItemCreationViewModel} from "../../ViewModels/Dialog/ItemCreationViewModel.ts";

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
                    <h3>Erstellen</h3>
                    <div className="confirm-cancel-buttons">
                        <button onClick={viewmodel.createEntry}>Eintrag</button>
                        <button onClick={viewmodel.createFolder}>Ordner</button>
                    </div>
                    <div className="confirm-cancel-buttons">
                        <button onClick={cancelItemCreation}>Abbrechen</button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ItemCreationDialog;