import React from "react";
import  {type Entry} from "../../Model/Entry.ts";


/**
 * The View that depicts an Entry with all its attributes at large scale
 * @param entry the entry that should be depicted
 */
const EntryView: React.FC<{ entry: Entry, inEditablePasswordView: boolean }> = ({entry, inEditablePasswordView}) => {
        return (
            <div className="entryViewEntry">
                <span>Titel:</span>        <span>{entry.title}</span>
                <span>Benutzername:</span> <span>{entry.username}</span>
                <span>URL:</span>          <span>{entry.url}</span>
                <span>Notiz:</span>        <span>{entry.note}</span>
            </div>
        );
}

export default EntryView;