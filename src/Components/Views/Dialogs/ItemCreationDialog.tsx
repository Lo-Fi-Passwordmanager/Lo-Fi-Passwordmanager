import React, {useState} from "react";
import OnClickButton from "../ButtonViews/OnClickButton.tsx";
import {type Item} from "../../../Model/Item.ts";
import {Entry} from "../../../Model/Entry.ts";

interface ItemCreationDialogProps {
    addItem?: (item: Item, id: string) => void
    curParent?: Item
    cancelItemCreation?: () => void
}

const ItemCreationDialog: React.FC = ({addItem, curParent, cancelItemCreation}: ItemCreationDialogProps) => {

    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");

    function handleConfirm() {
        addItem!(new Entry(title, "willBeAutomaticallySet", new Date(), new Date(), username, password, url, note), curParent!.id)
        cancelItemCreation!();
    }


    return (
        <div className="dialogOverlay">
            <div className="dialog">
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
                <label>Passwort</label>
                <input
                    className="inputField"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={"Passwort"}
                    autoFocus
                />
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
    )
}
export default ItemCreationDialog;