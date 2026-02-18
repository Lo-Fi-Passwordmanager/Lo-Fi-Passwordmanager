import React from "react";

import EyeButton from "./ButtonViews/EyeButton.tsx";
import PasswordGenDialog from "./DialogViews/PasswordGenDialog.tsx";
import Logo from "../../assets/logo_gelb.svg?inline";
import {type Item} from "../../Model/Item.ts";
import type {Attribute} from "../../Utility/AutomergeFacade.ts";
import {useEditablePasswordViewModel} from "../ViewModels/EditablePasswordViewModel.ts";


/**
 * The View that depicts an Entry with all its attributes at large scale while being editable
 *
 * @param item the entry that should be depicted
 * @param updateItemAttribute the function on the active {@link AutomergeFacade} to update a item in the doc
 * @param setEditableView the function to close the editable passwordView
 */
const EditableEntryView: React.FC<{
    item: Item,
    updateItemAttribute: (itemId: string, changes: [Attribute, string | Date][]) => void;
    setEditableView: () => void;
    hidePassword: boolean;
    toggleHidePassword: () => void;
    setInCreation: (inCreation: boolean) => void;
    inCreation: boolean;
    createItem: (item: Item) => void;
}> = ({item, updateItemAttribute, setEditableView, hidePassword, toggleHidePassword, createItem, setInCreation, inCreation}) => {

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
            <div className={"entryViewContainer"}>
                <div className="entryViewEntry">
                    <input className={"title-value"} type={"text"} value={viewmodel.title} autoFocus
                           onChange={(e) => viewmodel.setTitle(e.target.value)}/>

                    <div className={"divider"} style={{background:"transparent"}}/>

                    <div
                        className={"scrollableContainer entryViewListing"}
                        style={{height: '90%', width: '90%'}}>
                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>Benutzername:</span>
                                <input className={"attribute-value editing"}
                                       type={"text"} value={viewmodel.username}
                                       onChange={(e) => viewmodel.setUsername(e.target.value)}/>
                            </div>
                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>Passwort:</span>
                                <input className={"attribute-value editing"} style={{gridColumnEnd: "19"}}
                                       type={hidePassword ? "password" : "text"}
                                       value={viewmodel.password}
                                       onChange={(e) => viewmodel.setPassword(e.target.value)}/>
                                <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword}/>
                                <PasswordGenDialog
                                    setNewPassword={(password: string) => viewmodel.setPassword(password)}/>
                            </div>
                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>URL:</span>
                                <input className={"attribute-value editing"} type={"text"} value={viewmodel.url}
                                       onChange={(e) => viewmodel.setUrl(e.target.value)}/>
                            </div>
                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>Notiz:</span>
                                <input className={"attribute-value editing"} type={"text"} value={viewmodel.note}
                                       onChange={(e) => viewmodel.setNote(e.target.value)}
                                       style={{
                                           padding: "10px",
                                           whiteSpace: "normal",
                                       }}/>
                            </div>
                        </div>
                        <div className={"entryViewFooterButtons"}>
                            <button className={"rectangle-button"}
                                    onClick={
                                            viewmodel.saveEntry
                                    }>Speichern
                            </button>
                            <button className={"rectangle-button cancel"}
                                    onClick={viewmodel.cancelSaving
                                    }>Abbrechen
                            </button>
                    </div>
                </div>
                <div className="entryDateViewEntry">
                    <span>Erstellt am: {item.createdAt.toLocaleString()}</span>
                    <span>Bearbeitet am: {item.editedAt.toLocaleString()}</span>
                </div>
            </div>
        );
    }

};

export default EditableEntryView;