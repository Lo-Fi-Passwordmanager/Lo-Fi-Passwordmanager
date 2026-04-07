import React from "react";
import {HiPencil, HiTrash, HiPlus} from "react-icons/hi";

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
                <div className={"entryViewNoSelection"}>
                    <span>Noch kein Eintrag ausgewählt</span>
                    <img className="logo" style={{width: "40vmin", marginTop: "2em"}} src={Logo} alt={"Logo"}/>
                </div>
            </>
        );
    } else if (item.isEntry()) {
        const entry = item as Entry;
        return (<div className="entryViewContainer">
                <div className="entryViewEntry">
                    <div className={"title-value"} title={"Titel"}>
                        {entry.title}
                    </div>

                    <div className={"divider"} style={{width: "50%"}}/>

                    <div className={"scrollableContainer entryViewListing"}>
                        <div className={"entryViewAttribute"}>
                            <span className={"attribute-title"}>Benutzername:</span>
                            <span className={"attribute-value"} title={"Benutzername"}>{entry.username}</span>
                            <CopyButton copyToClipboard={copyAndClearClipboard} attributeValue={entry.username} id={entry.id}/>
                        </div>

                        <div className={"entryViewAttribute"}>
                            <span className={"attribute-title"}>Passwort:</span>
                            <div className={"attribute-value"} style={{gridColumnEnd: "19"}}>
                                <span title={"Passwort"}>{(hidePassword ? "●".repeat(8) : entry.password)}</span>
                            </div>
                            <EyeButton hidePassword={hidePassword} toggleHidePassword={toggleHidePassword}/>
                            <CopyButton copyToClipboard={copyAndClearClipboard} attributeValue={entry.password} id={entry.id}/>
                        </div>

                        <div className={"entryViewAttribute"}>
                            {/* adds https://www. to the start of the link*/}
                            <span className={"attribute-title"}>URL:</span>
                            <a className={"attribute-value"}
                               href={(entry.url.startsWith("http") ? entry.url : ("https://" + entry.url))}
                               target="_blank" rel="noopener noreferrer"
                               style={{textDecoration: "underline", color: "inherit"}}
                               title={"URL"}
                            >
                                {entry.url}
                            </a>
                            <CopyButton copyToClipboard={copyAndClearClipboard} attributeValue={entry.url} id={entry.id}/>
                        </div>

                        <div className={"entryViewAttribute"}>
                            <span className={"attribute-title"}>Notiz:</span>
                            <span className={"attribute-value"} style={{
                                height: "fit-content",
                                whiteSpace: "normal",
                                gridColumnEnd: "21"
                            }}
                                  title={"Notiz"}
                            >{entry.note}</span>
                        </div>
                    </div>

                    <div className="mobile-dates">
                        <HiPlus size={24}/><HiPencil size={24}/>
                        <div className="mobile-date-item">{item.createdAt.toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                        })}</div>
                        <div className="mobile-date-item">{item.editedAt.toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                        })}</div>
                    </div>

                    <div className={"entryViewFooterButtons"}>
                        <button
                            className={"rectangle-button"}
                            onClick={setEditableView}
                            title={"Eintrag bearbeiten"}
                        >
                            <HiPencil size={24}/> Bearbeiten
                        </button>
                        <button className={"rectangle-button delete"}
                                onClick={() => deleteItem(item)}
                                title={"Eintrag löschen"}
                        >
                            <HiTrash size={24}/>Löschen
                        </button>
                    </div>
                </div>
                <div className="entryDateViewEntry">
                    <span>Erstellt am: {item.createdAt.toLocaleString(undefined, {dateStyle: 'long', timeStyle: 'medium'})}</span>
                    <span>Bearbeitet am: {item.editedAt.toLocaleString(undefined, {dateStyle: 'long', timeStyle: 'medium'})}</span>
                </div>
            </div>
        );
    }
};

export default EntryView;