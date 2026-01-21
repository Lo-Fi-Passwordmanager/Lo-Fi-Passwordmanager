import React from "react";
import {type Entry} from "../../Model/Entry.ts";
import {type Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";
import type {Attribute} from "../../Utility/AutomergeFacade.ts";


/**
 * The View that depicts an Entry with all its attributes at large scale
 * @param item the entry that should be depicted
 * @param copyAndClearClipboard the function that copies a string to the clipboard and clears it afterwards
 */
const EditablePasswordView: React.FC<{
    item: Item,
    updateItemAttribute: (itemId: string, attribute: Attribute, value: string) => void;
    copyAndClearClipboard: (text: string, timeout?: number) => void;
    setEditableView: () => void;
}> = ({item, updateItemAttribute, copyAndClearClipboard, setEditableView}) => {

    if (item.isFolder() || item.deleted) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "center", width: "100%", height: "100%",
                fontSize: "2em", color: "gray"
            }}>
                <input>Bitte Eintrag auswählen</input>
                <img className="logo" style={{width: "30vmin", marginTop: "2em"}} src={Logo} alt={"Logo"}/>
            </div>
        );
    } else if (item.isEntry()) {
        const entry = item as Entry;
        return (
            <div className="entryViewEntry" style={{position: 'relative'}}>
                <button onClick={setEditableView}
                        style={{
                    position: "absolute",
                    top: "10px",   // Distance from the top edge
                    left: "10px",  // Distance from the left edge
                    zIndex: 10,
                    fontSize: "0.8em"// Ensures it sits on top of the div content
                }}>
                    ✏️
                </button>
                <input>Fortnite:</input> <input>{entry.title}</input>
                <button onClick={() => copyAndClearClipboard(entry.title)}>🔗</button>

                <input>Benutzername:</input> <input>{entry.username}</input>
                <button onClick={() => copyAndClearClipboard(entry.username)}>🔗</button>

                <input>Passwort:</input> <input>{entry.password}</input>
                <button onClick={() => copyAndClearClipboard(entry.password)}>🔗</button>

                {/* adds https://www. to the start of the link*/}
                <input>URL:</input> <a
                href={entry.url.includes("www.") ? (entry.url.startsWith("http") ? entry.url : ("https://" + entry.url)) : ("https://www." + entry.url)}
                target="_blank" rel="noopener noreferrer"
                style={{textDecoration: "underline", color: "inherit"}}>
                {entry.url}</a>
                <button onClick={() => copyAndClearClipboard(entry.url)}>🔗</button>

                <input>Notiz:</input> <input>{entry.note}</input>
                <button onClick={() => copyAndClearClipboard(entry.note)}>🔗</button>
            </div>
        );
    }

}

export default EditablePasswordView;