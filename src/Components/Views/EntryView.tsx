import React from "react";
import {type Entry} from "../../Model/Entry.ts";
import {type Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";
import EyeButton from "./ButtonViews/EyeButton.tsx";


/**
 * The View that depicts an Entry with all its attributes at large scale
 * @param item the entry that should be depicted
 * @param copyAndClearClipboard the function that copies a string to the clipboard and clears it afterwards
 * @param setEditableView a command to toggle the editable view to on
 * @param hidePassword
 * @param toggleHidePassword
 */
const EntryView: React.FC<{
    item: Item,
    copyAndClearClipboard: (text: string, timeout?: number) => void,
    setEditableView: () => void,
    hidePassword: boolean;
    toggleHidePassword: () => void;
}> = ({item, copyAndClearClipboard, setEditableView, hidePassword, toggleHidePassword}) => {

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
        return (<>
                <div className="entryViewEntry">
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
                    <span className={"title-value"}>{entry.title}</span>

                    <div className={"scrollableContainer"} style={{height: '100%', width: '90%'}}>
                        <div className={"entryViewListing"}>
                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>Benutzername:</span>
                                <span className={"attribute-value"}>{entry.username}</span>
                                <button className={"copy-button"}
                                        onClick={() => copyAndClearClipboard(entry.username)}>🔗
                                </button>
                            </div>

                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>Passwort:</span>
                                <div className={"attribute-value"} style={{gridColumnEnd:"19"}}>
                                    <span>{(hidePassword ? "*".repeat(entry.password.length) : entry.password)}</span>
                                </div>
                                <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword}/>
                                <button className={"copy-button"}
                                        onClick={() => copyAndClearClipboard(entry.password)}>🔗
                                </button>
                            </div>

                            <div className={"entryViewAttribute"}>
                                {/* adds https://www. to the start of the link*/}
                                <span style={{gridColumn: "span 20"}}>URL:</span>
                                <a className={"attribute-value"}
                                   href={(entry.url.startsWith("http") ? entry.url : ("https://" + entry.url))}
                                   target="_blank" rel="noopener noreferrer"
                                   style={{textDecoration: "underline", color: "inherit"}}>
                                    {entry.url}
                                </a>
                                <button className={"copy-button"} onClick={() => copyAndClearClipboard(entry.url)}>🔗
                                </button>
                            </div>

                            <div className={"entryViewAttribute"}>
                                <span style={{gridColumn: "span 20"}}>Notiz:</span>
                                <span className={"attribute-value"} style={{
                                    height: "fit-content",
                                    padding: "10px",
                                    whiteSpace: "normal",
                                    gridColumnEnd:"21"
                                }}>{entry.note}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="entryDateViewEntry">
                    <span>Erstellt am: {item.createdAt.toLocaleString()}</span>
                    <span>Bearbeitet am: {item.editedAt.toLocaleString()}</span>
                </div>
            </>
        );
    }

}

export default EntryView;