import React from "react";
import {HiPencil, HiTrash} from "react-icons/hi";

import CopyButton from "./ButtonViews/CopyButton.tsx";
import EyeButton from "./ButtonViews/EyeButton.tsx";
import Logo from "../../assets/logo_gelb.svg?inline";
import {type Entry} from "../../Model/Entry.ts";
import {type Item} from "../../Model/Item.ts";


/**
 * The View that depicts an Entry with all its attributes at large scale
 *
 * @param item the entry that should be depicted
 * @param deleteItem the function that deletes the current item
 * @param copyAndClearClipboard the function that copies a string to the clipboard and clears it afterwards
 * @param setEditableView a command to toggle the editable view to on
 * @param hidePassword whether the password should be hidden
 * @param toggleHidePassword a command to toggle the hide password state
 */
const EntryView: React.FC<{
    item: Item,
    deleteItem: (item: Item) => void,
    copyAndClearClipboard: (text: string, timeout?: number) => void,
    setEditableView: () => void,
    hidePassword: boolean;
    toggleHidePassword: () => void;
}> = ({item, deleteItem, copyAndClearClipboard, setEditableView, hidePassword, toggleHidePassword}) => {

    if (item.isFolder() || item.deleted) {
        return (
            <>
                <div style={{
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    alignItems: "center", width: "100%", height: "100%",
                    fontSize: "2em", color: "gray"
                }}>
                    <span>Bitte Eintrag auswählen</span>
                    <img className="logo" style={{width: "30vmin", marginTop: "2em"}} src={Logo} alt={"Logo"}/>
                </div>
            </>
        );
    } else if (item.isEntry()) {
        const entry = item as Entry;
        return (<div className="entryViewContainer">
                <div className="entryViewEntry">
                    <div className={"title-value"}>
                        {entry.title}
                    </div>

                    <div className={"divider"} style={{width: "50%"}}/>

                    <div className={"scrollableContainer entryViewListing"} style={{width: "90%"}}>
                        <div className={"entryViewAttribute"}>
                            <span style={{gridColumn: "span 20"}}>Benutzername:</span>
                            <span className={"attribute-value"} title={"Benutzername"}>{entry.username}</span>
                            <CopyButton copyToClipboard={copyAndClearClipboard} attributeValue={entry.username}/>
                        </div>

                        <div className={"entryViewAttribute"}>
                            <span style={{gridColumn: "span 20"}}>Passwort:</span>
                            <div className={"attribute-value"} style={{gridColumnEnd: "19"}}>
                                <span title={"Passwort"}>{(hidePassword ? "●".repeat(8) : entry.password)}</span>
                            </div>
                            <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword}/>
                            <CopyButton copyToClipboard={copyAndClearClipboard} attributeValue={entry.password}/>
                        </div>

                        <div className={"entryViewAttribute"}>
                            {/* adds https://www. to the start of the link*/}
                            <span style={{gridColumn: "span 20"}}>URL:</span>
                            <a className={"attribute-value"}
                               href={(entry.url.startsWith("http") ? entry.url : ("https://" + entry.url))}
                               target="_blank" rel="noopener noreferrer"
                               style={{textDecoration: "underline", color: "inherit"}}
                               title={"URL"}
                            >
                                {entry.url}
                            </a>
                            <CopyButton copyToClipboard={copyAndClearClipboard} attributeValue={entry.url}/>
                        </div>

                        <div className={"entryViewAttribute"}>
                            <span style={{gridColumn: "span 20"}}>Notiz:</span>
                            <span className={"attribute-value"} style={{
                                height: "fit-content",
                                paddingLeft: "10px",
                                whiteSpace: "normal",
                                gridColumnEnd: "21"
                            }}
                                  title={"Notiz"}
                            >{entry.note}</span>
                        </div>
                    </div>
                    <div className={"entryViewFooterButtons"}>
                        <button className={"rectangle-button"} onClick={() => {
                            setEditableView();
                        }} style={{boxShadow: "none"}}
                                title={"Eintrag bearbeiten"}
                        >
                            <HiPencil size={24}/> Bearbeiten
                        </button>
                        <button className={"rectangle-button delete"} onClick={() => deleteItem(item)}
                                style={{boxShadow: "none"}}
                                title={"Eintrag löschen"}
                        >
                            <HiTrash size={24}/>Löschen
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

export default EntryView;