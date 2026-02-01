import React from "react";
import {type Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";
import type {Attribute} from "../../Utility/AutomergeFacade.ts";
import {useEditablePasswordViewModel} from "../ViewModels/EditablePasswordViewModel.ts";
import PasswordGenDialog from "./DialogViews/PasswordGenDialog.tsx";


/**
 * The View that depicts an Entry with all its attributes at large scale while beeing editable
 * @param item the entry that should be depicted
 * @param updateItemAttribute the function on the active {@link AutomergeFacade} to update a item in the doc
 * @param setEditableView the function to close the editable passwordview
 */
const EditableEntryView: React.FC<{
    item: Item,
    updateItemAttribute: (itemId: string, changes: [Attribute, string | Date][]) => void;
    setEditableView: () => void; inCreation: boolean;
    setInCreation: (inCreation: boolean) => void;
    createItem: (item: Item) => void;
}> = ({item, updateItemAttribute, setEditableView, setInCreation, inCreation, createItem}) => {

    const viewmodel = useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView);

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
            <>
                <div className="entryViewEntry" style={{position: "relative"}}>
                    <button onClick={() => {
                        if (viewmodel.hasChanges()) {
                            viewmodel.updateItemInAutomerge();
                        }
                        setEditableView();
                    }}
                            style={{
                                position: "absolute",
                                top: "10px",   // Distance from the top edge
                                left: "10px",  // Distance from the left edge
                                zIndex: 10,
                                fontSize: "0.8em"// Ensures it sits on top of the div content
                            }}>
                        💾
                    </button>
                    <input className={"title-value"} type={"text"} value={viewmodel.title}
                           onChange={(e) => viewmodel.setTitle(e.target.value)}/>

                    <div className={"entryViewListing"}>
                        <div className={"entryViewAttribute"}>
                            <span>Benutzername:</span>
                            <input className={"attribute-value"}
                                   type={"text"} value={viewmodel.username}
                                   onChange={(e) => viewmodel.setUsername(e.target.value)}/>
                        </div>
                        <div className={"entryViewAttribute"}>
                            <span>Passwort:</span>
                            <input className={"attribute-value"} type={"text"} value={viewmodel.password}
                                   onChange={(e) => viewmodel.setPassword(e.target.value)}/>
                            <PasswordGenDialog
                                newPassword={(password: string) => viewmodel.setPassword(password)}></PasswordGenDialog>

                        </div>
                        <div className={"entryViewAttribute"}>
                            {/* adds https://www. to the start of the link*/}
                            <span>URL:</span>
                            <input className={"attribute-value"} type={"text"} value={viewmodel.url}
                                   onChange={(e) => viewmodel.setUrl(e.target.value)}/>
                        </div>
                        <div className={"entryViewAttribute"}>
                            <span>Notiz:</span>
                            <input className={"attribute-value"} type={"text"} value={viewmodel.note}
                                   onChange={(e) => viewmodel.setNote(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className={"entryViewFooterButtons"}>
                    <button className={"standard-button"}
                            onClick={viewmodel.saveEntry}>Speichern
                    </button>
                    <button className={"standard-button"}
                            onClick={viewmodel.cancelSaving}>Abbrechen
                    </button>
                </div>

                <div className="entryDateViewEntry">
                    <span>Erstellt am: {item.createdAt.toLocaleString()}</span>
                    <span>Bearbeitet am: {item.editedAt.toLocaleString()}</span>
                </div>
            </>
        );
    }

};

export default EditableEntryView;