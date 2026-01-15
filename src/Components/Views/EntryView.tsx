import React from "react";
import type {Entry} from "../../Model/Entry.ts";

const EntryView: React.FC<{ entry: Entry }> = ({entry}) => {
    return (
        <div>
            <a>{entry.title}</a>
            <h1>Welcome to the Application</h1>
            <p>Please log in to continue.</p>
        </div>
    );
}

export default EntryView;