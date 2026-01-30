import React from "react";
import {type Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";
import type {Attribute} from "../../Utility/AutomergeFacade.ts";
import {useEditablePasswordViewModel} from "../ViewModels/EditablePasswordViewModel.ts";
import PasswordGenDialog from "./DialogViews/PasswordGenDialog.tsx";
import EyeButton from "./ButtonViews/EyeButton.tsx";


/**
 * The View that depicts an Entry with all its attributes at large scale while beeing editable
 * @param item the entry that should be depicted
 * @param updateItemAttribute the function on the active {@link AutomergeFacade} to update a item in the doc
 * @param setEditableView the function to close the editable passwordview
 */
const EditablePasswordView: React.FC<{
    item: Item,
    updateItemAttribute: (itemId: string, changes: [Attribute, string | Date][]) => void;
    setEditableView: () => void;
    hidePassword: boolean;
    toggleHidePassword: () => void;
    setInCreation: (inCreation: boolean) => void;
    createItem: (item: Item) => void;
}> = ({item, updateItemAttribute, setEditableView, hidePassword, toggleHidePassword}) => {

    const viewmodel = useEditablePasswordViewModel(item, updateItemAttribute, createItem);

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
                <div className="entryViewEntry">
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

                    <div
                        className={"scrollableContainer"}
                        style={{height: '100%', width: '90%'}}>
                        <div className={"entryViewListing"}>
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
                                    newPassword={(password: string) => viewmodel.setPassword(password)}/>
                            </div>
                            <div className={"entryViewAttribute"}>
                                {/* adds https://www. to the start of the link*/}
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
                    </div>
                </div>
                <div className={"entryViewFooterButtons"}>
                    <button className={"standard-button"}
                            onClick={() => {
                                if (inCreation) {
                                    setInCreation(false);
                                    viewmodel.createItemInAutomerge();
                                } else if (viewmodel.hasChanges()) {
                                    viewmodel.updateItemInAutomerge();
                                }
                                setEditableView();
                            }}>Speichern
                    </button>
                    <button className={"standard-button"}
                            onClick={() => {
                                setInCreation(false);
                                setEditableView();
                            }}>Abbrechen
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

export default EditablePasswordView;