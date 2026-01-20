import React, {useState} from "react";
import {type Item} from "../../../Model/Item.ts";
import {Entry} from "../../../Model/Entry.ts";
import {Folder} from "../../../Model/Folder.ts";
import PasswordGenDialog from "./PasswordGenDialog.tsx";

interface ItemCreationDialogProps {
    addItem?: (item: Item, id: string) => void
    curParent?: Item
    cancelItemCreation?: () => void
    setCurItem: (newItem: Item) => void;
}

const ItemCreationDialog: React.FC<ItemCreationDialogProps> = ({addItem, curParent, cancelItemCreation, setCurItem}: ItemCreationDialogProps) => {

    const [typeOfItem, setTypeOfItem] = useState("entry")
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");
    const [inPasswordGen, setInPasswordGen] = useState(false);

    function handleConfirm() {
        if (typeOfItem === "entry") {
            const entry: Entry = new Entry(title, "willBeAutomaticallySet", new Date(), new Date(), username, password, url, note);
            addItem!(entry, curParent!.id)
            setCurItem(entry);
        } else if (typeOfItem === "folder") {
            addItem!(new Folder(title, "willBeAutomaticallySet", new Date(), new Date()), curParent!.id)
        }
        cancelItemCreation!();
    }


    if (typeOfItem === "entry") {
        return (<>
            <div className="dialogOverlay">
                <div className="dialog">
                    <div className="confirm-cancel-buttons">
                        <button onClick={() => setTypeOfItem("entry")}>Eintrag</button>
                        <button onClick={() => setTypeOfItem("folder")}>Ordner</button>
                    </div>
                    <h3>Neuer Eintrag</h3>
                    <label>Titel</label>
                    <input
                        className="inputField"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={"Titel"}
                        autoFocus
                    />
                    <label>Benutzername</label>
                    <input
                        className="inputField"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={"Passwort"}
                        autoFocus
                    />
                    </div>
                    <button
                        className="passwordGenButton"
                        onClick={() => setInPasswordGen(true)}
                        >
                        +
                    </button>
                    </div>
                    <label>URL</label>
                    <input
                        className="inputField"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={"URL"}
                        autoFocus
                    />
                    <label>Notiz</label>
                    <input
                        className="inputField"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={"Notiz"}
                        autoFocus
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={handleConfirm}>Bestätigen</button>
                        <button onClick={cancelItemCreation}>Abbrechen</button>
                    </div>
                </div>
            </div>
                {inPasswordGen &&
                    <PasswordGenDialog
                        newPassword={(password) =>
                        {setPassword(password);
                            setInPasswordGen(false)}}
                        cancelPasswordGen={() => setInPasswordGen(false)}
                    />}
            </>
        );
    } else {
        return (
            <div className="dialogOverlay">
                <div className="dialog">
                    <div className="confirm-cancel-buttons">
                        <button onClick={() => setTypeOfItem("entry")}>Eintrag</button>
                        <button onClick={() => setTypeOfItem("folder")}>Ordner</button>
                    </div>
                    <h3>Neuer Ordner</h3>
                    <label>Titel</label>
                    <input
                        className="inputField"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={"Titel"}
                        autoFocus
                    />
                    <div className="confirm-cancel-buttons">
                        <button onClick={handleConfirm}>Bestätigen</button>
                        <button onClick={cancelItemCreation}>Abbrechen</button>
                    </div>
                </div>
            </div>
        );
    }

}
export default ItemCreationDialog;