import React from "react";
import {type Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";
import type {Attribute} from "../../Utility/AutomergeFacade.ts";
import {useEditablePasswordViewModel} from "../ViewModels/EditablePasswordViewModel.ts";


/**
 * The View that depicts an Entry with all its attributes at large scale while beeing editable
 * @param item the entry that should be depicted
 * @param copyAndClearClipboard the function that copies a string to the clipboard and clears it afterwards
 */
const EditablePasswordView: React.FC<{
    item: Item,
    updateItemAttribute: (itemId: string, changes: [Attribute, string | Date][]) => void;
    copyAndClearClipboard: (text: string, timeout?: number) => void;
    setEditableView: () => void;
}> = ({item, updateItemAttribute, copyAndClearClipboard, setEditableView}) => {

    const viewmodel = useEditablePasswordViewModel(item, updateItemAttribute);

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
        return (
            <div className="entryViewEntry" style={{position: 'relative'}}>
                <button onClick={() => {viewmodel.updateItemInAutomerge();
                                                setEditableView();}}
                        style={{
                    position: "absolute",
                    top: "10px",   // Distance from the top edge
                    left: "10px",  // Distance from the left edge
                    zIndex: 10,
                    fontSize: "0.8em"// Ensures it sits on top of the div content
                }}>
                    💾
                </button>
                <span>Fortnite:</span> <input type={"text"} value={viewmodel.title}
                                              onChange={(e) => viewmodel.setTitle(e.target.value)}></input>
                <button onClick={() => copyAndClearClipboard(viewmodel.title)}>🔗</button>

                <span>Benutzername:</span> <input type={"text"} value={viewmodel.username}
                                                  onChange={(e) => viewmodel.setUsername(e.target.value)}></input>
                <button onClick={() => copyAndClearClipboard(viewmodel.username)}>🔗</button>

                <span>Passwort:</span> <input type={"text"} value={viewmodel.password}
                                              onChange={(e) => viewmodel.setPassword(e.target.value)}></input>
                <button onClick={() => copyAndClearClipboard(viewmodel.password)}>🔗</button>

                {/* adds https://www. to the start of the link*/}
                <span>URL:</span> <input type={"text"} value={viewmodel.url}
                style={{textDecoration: "underline", color: "inherit"}}
                                         onChange={(e) => viewmodel.setUrl(e.target.value)}></input>
                <button onClick={() => copyAndClearClipboard(viewmodel.url)}>🔗</button>

                <span>Notiz:</span> <input type={"text"} value={viewmodel.note}
                                           onChange={(e) => viewmodel.setNote(e.target.value)}></input>
                <button onClick={() => copyAndClearClipboard(viewmodel.note)}>🔗</button>
            </div>
        );
    }

}

export default EditablePasswordView;