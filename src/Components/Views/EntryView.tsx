import React from "react";
import type {Entry} from "../../Model/Entry.ts";

const EntryView: React.FC<{ entry: Entry }> = ({entry}) => {
    return (
        <div className="entryViewEntry">
            <span>Titel:</span>        <span>{entry.title}</span>
            <span>ID:</span>           <span>{entry.id}</span>
            <span>Benutzername:</span> <span>{entry.username}</span>
            <span>URL:</span>          <span>{entry.url}</span>
            <span>Notiz:</span>        <span>{entry.note}</span>
        </div>
    );
}

export default EntryView;