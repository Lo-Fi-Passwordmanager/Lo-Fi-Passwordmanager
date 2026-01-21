import React from "react";
import {type Item} from "../../../Model/Item.ts";
import PasswordGenDialog from "./PasswordGenDialog.tsx";
import {useItemcreationViewModel} from "../../ViewModels/Dialog/ItemcreationViewModel.ts";

interface ItemCreationDialogProps {
    addItem: (item: Item, id: string) => void
    curParent: Item
    cancelItemCreation: () => void
    setCurItem: (newItem: Item) => void;
}

const ItemCreationDialog: React.FC<ItemCreationDialogProps> = ({addItem, curParent, cancelItemCreation, setCurItem}: ItemCreationDialogProps) => {
    const viewmodel = useItemcreationViewModel(addItem, setCurItem, curParent, cancelItemCreation);


    if (viewmodel.typeOfItem === "entry") {
        return (<>
            <div className="dialogOverlay">
                <div className="dialog">
                    <div className="confirm-cancel-buttons">
                        <button onClick={() => viewmodel.setTypeOfItem("entry")}>Eintrag</button>
                        <button onClick={() => viewmodel.setTypeOfItem("folder")}>Ordner</button>
                    </div>
                    <h3>Neuer Eintrag</h3>
                    <label>Titel</label>
                    <input
                        className="inputField"
                        type="text"
                        value={viewmodel.title}
                        onChange={(e) => viewmodel.setTitle(e.target.value)}
                        placeholder={"Titel"}
                        autoFocus
                    />
                    <label>Benutzername</label>
                    <input
                        className="inputField"
                        type="text"
                        value={viewmodel.username}
                        onChange={(e) => viewmodel.setUsername(e.target.value)}
                        placeholder={"Benutzername"}
                        autoFocus
                    />
                    <div
                    style={{display: "flex", alignItems: "flex-end"}}>
                        <div
                        style={{display: "flex", flexDirection: "column", flex: 1}}>
                    <label>Passwort</label>
                    <input
                        className="inputField"
                        type="text"
                        value={viewmodel.password}
                        onChange={(e) => viewmodel.setPassword(e.target.value)}
                        placeholder={"Passwort"}
                        autoFocus
                    />
                    </div>
                    <button
                        className="passwordGenButton"
                        onClick={() => viewmodel.setInPasswordGen(true)}
                        >
                        +
                    </button>
                    </div>
                    <label>URL</label>
                    <input
                        className="inputField"
                        type="text"
                        value={viewmodel.url}
                        onChange={(e) => viewmodel.setUrl(e.target.value)}
                        placeholder={"URL"}
                        autoFocus
                    />
                    <label>Notiz</label>
                    <input
                        className="inputField"
                        type="text"
                        value={viewmodel.note}
                        onChange={(e) => viewmodel.setNote(e.target.value)}
                        placeholder={"Notiz"}
                        autoFocus
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={viewmodel.handleConfirm}>Bestätigen</button>
                        <button onClick={cancelItemCreation}>Abbrechen</button>
                    </div>
                </div>
            </div>
                {viewmodel.inPasswordGen &&
                    <PasswordGenDialog
                        newPassword={(password) =>
                        {viewmodel.setPassword(password);
                            viewmodel.setInPasswordGen(false)}}
                        cancelPasswordGen={() => viewmodel.setInPasswordGen(false)}
                    />}
            </>
        );
    } else {
        return (
            <div className="dialogOverlay">
                <div className="dialog">
                    <div className="confirm-cancel-buttons">
                        <button onClick={() => viewmodel.setTypeOfItem("entry")}>Eintrag</button>
                        <button onClick={() => viewmodel.setTypeOfItem("folder")}>Ordner</button>
                    </div>
                    <h3>Neuer Ordner</h3>
                    <label>Titel</label>
                    <input
                        className="inputField"
                        type="text"
                        value={viewmodel.title}
                        onChange={(e) => viewmodel.setTitle(e.target.value)}
                        placeholder={"Titel"}
                        autoFocus
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={viewmodel.handleConfirm}>Bestätigen</button>
                        <button onClick={cancelItemCreation}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );
    }

}
export default ItemCreationDialog;