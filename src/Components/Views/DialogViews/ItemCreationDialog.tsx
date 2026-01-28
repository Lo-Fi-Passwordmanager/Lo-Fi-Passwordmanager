import React from "react";
import {type Item} from "../../../Model/Item.ts";
import PasswordGenDialog from "./PasswordGenDialog.tsx";
import {useItemcreationViewModel} from "../../ViewModels/Dialog/ItemcreationViewModel.ts";

interface ItemCreationDialogProps {
    addItem: (item: Item, id: string) => string;
    curParent: Item;
    cancelItemCreation: () => void;
    setCurItem: (newItem: Item) => void;
}

const ItemCreationDialog: React.FC<ItemCreationDialogProps> = ({
    addItem,
    curParent,
    cancelItemCreation,
    setCurItem
}: ItemCreationDialogProps) => {
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
                            type="text"
                            value={viewmodel.title}
                            onChange={(e) => viewmodel.setTitle(e.target.value)}
                            placeholder={"Titel"}
                            autoFocus
                        />
                        <label>Benutzername</label>
                        <input
                            type="text"
                            value={viewmodel.username}
                            onChange={(e) => viewmodel.setUsername(e.target.value)}
                            placeholder={"Benutzername"}
                        />
                        <div
                            style={{display: "flex", alignItems: "flex-end"}}>
                            <div
                                style={{display: "flex", flexDirection: "column", flex: 1}}>
                                <label>Passwort</label>
                                <input
                                    type="text"
                                    value={viewmodel.password}
                                    onChange={(e) => viewmodel.setPassword(e.target.value)}
                                    placeholder={"Passwort"}
                                />
                            </div>
                            <PasswordGenDialog newPassword={(password: string) => viewmodel.setPassword(password)}></PasswordGenDialog>
                        </div>
                        <label>URL</label>
                        <input
                            type="text"
                            value={viewmodel.url}
                            onChange={(e) => viewmodel.setUrl(e.target.value)}
                            placeholder={"URL"}
                        />
                        <label>Notiz</label>
                        <input
                            type="text"
                            value={viewmodel.note}
                            onChange={(e) => viewmodel.setNote(e.target.value)}
                            placeholder={"Notiz"}
                        />
                        <div className="confirm-cancel-buttons">
                            <button onClick={viewmodel.handleConfirm}>Bestätigen</button>
                            <button onClick={cancelItemCreation}>Abbrechen</button>
                        </div>
                    </div>
                </div>
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

};
export default ItemCreationDialog;