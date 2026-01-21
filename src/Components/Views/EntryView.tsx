import React from "react";
import {type Entry} from "../../Model/Entry.ts";
import {type Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";


/**
 * The View that depicts an Entry with all its attributes at large scale
 * @param item the entry that should be depicted
 * @param copyAndClearClipboard the function that copies a string to the clipboard and clears it afterwards
 * @param setEditableView a command to toggle the editable view to on
 */
const EntryView: React.FC<{
    item: Item,
    copyAndClearClipboard: (text: string, timeout?: number) => void,
    setEditableView: () => void,
}> = ({item, copyAndClearClipboard, setEditableView}) => {

    if (item.isFolder() || item.deleted) {
        return (
            <div style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "center", width: "100%", height: "100%",
                fontSize: "2em", color: "gray"
            }}>
                <span>Bitte Eintrag auswählen</span>
                <img className="logo" style={{width: "30vmin", marginTop: "2em"}} src={Logo} alt={"Logo"}/>
            </div>
        );
    } else if (item.isEntry()) {
        const entry = item as Entry;
        return (<>
            <div className="entryViewEntry" style={{position: 'relative'}}>
                <button onClick={setEditableView}
                        style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 10,
                    fontSize: "0.8em"
                }}>
                    ✏️
                </button>
                <span>Titel:</span> <span>{entry.title}</span>
                <button onClick={() => copyAndClearClipboard(entry.title)}>🔗</button>

                <span>Benutzername:</span> <span>{entry.username}</span>
                <button onClick={() => copyAndClearClipboard(entry.username)}>🔗</button>

                <span>Passwort:</span> <span>{entry.password}</span>
                <button onClick={() => copyAndClearClipboard(entry.password)}>🔗</button>

                {/* adds https://www. to the start of the link*/}
                <span>URL:</span> <a
                href={entry.url.includes("www.") ? (entry.url.startsWith("http") ? entry.url : ("https://" + entry.url)) : ("https://www." + entry.url)}
                target="_blank" rel="noopener noreferrer"
                style={{textDecoration: "underline", color: "inherit"}}>
                {entry.url}</a>
                <button onClick={() => copyAndClearClipboard(entry.url)}>🔗</button>

                <span>Notiz:</span> <span>{entry.note}</span>
                <button onClick={() => copyAndClearClipboard(entry.note)}>🔗</button>
            </div>
            <div className="entryDateViewEntry">
                <span>Erstellt am: {item.createdAt.toDateString()}</span>
                <span>Bearbeitet am: {item.editedAt.toDateString()}</span>
            </div>
            </>
        );
    }

}

export default EntryView;