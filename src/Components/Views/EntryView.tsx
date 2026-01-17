import React from "react";
import  {type Entry} from "../../Model/Entry.ts";
import type {Item} from "../../Model/Item.ts";
import type {Folder} from "../../Model/Folder.ts";


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
                            <span>URL:</span>          <span>{entry.url}</span>
                            <span>Notiz:</span>        <span>{entry.note}</span>
                    </div>
                );
        } else if (item.isFolder()) {
                const folder = item as Folder;
                return (
                    <div className="entryViewEntry">
                            <span>Titel:</span>        <span>{folder.title}</span>
                    </div>
                );
        }

}

export default EntryView;