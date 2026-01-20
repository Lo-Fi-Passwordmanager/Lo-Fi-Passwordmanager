import React from "react";
import  {type Entry} from "../../Model/Entry.ts";
import type {Item} from "../../Model/Item.ts";
import Logo from "../../assets/logo_gelb.svg?inline";


/**
 * The View that depicts an Entry with all its attributes at large scale
 * @param item the entry that should be depicted
 */
const EntryView: React.FC<{ item: Item}> = ({item}) => {
        if (item.isEntry()) {
                const entry = item as Entry;
                return (
                    <div className="entryViewEntry">
                            <span>Titel:</span>        <span>{entry.title}</span>
                            <span>Benutzername:</span> <span>{entry.username}</span>
                            <span>Passwort:</span>     <span>{entry.password}</span>
                        {/* adds https://www. to the start of the link*/}
                            <span>URL:</span>          <a href={entry.url.includes("www.") ?
                                                                (entry.url.startsWith("http")?entry.url:("https://"+entry.url))
                                                                :("https://www."+entry.url)}
                                                          target="_blank" rel="noopener noreferrer"
                                                            style={{textDecoration: "underline", color: "inherit"}}>
                        {entry.url}</a>
                            <span>Notiz:</span>        <span>{entry.note}</span>
                    </div>
                );
        } else if (item.isFolder()) {
                return (
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", width: "100%", height: "100%",
                        fontSize: "2em", color: "gray"}}>
                            <span>Bitte Eintrag auswählen</span>
                            <img className="logo" style={{width: "30vmin", marginTop: "2em"}} src={Logo} alt={"Logo"}/>
                    </div>
                );
        }

}

export default EntryView;