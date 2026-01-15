import React from "react";
import {Entry} from "../../Model/Entry.ts";
import {Folder} from "../../Model/Folder.ts";
import SettingsView from "./SettingsView.tsx";
import ListView from "./ListView.tsx";
import EntryView from "./EntryView.tsx";


const root = new Folder("krasser Titel", "123", new Date(), new Date())
const subFolder1 = new Folder("subFolder 1", "123", new Date(), new Date())
const subFolder2 = new Folder("subFolder 2", "123", new Date(), new Date())
const entry = new Entry("Name1", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
const entry3 = new Entry("Name3", "id123", new Date(), new Date(), "benutzer1", "password", "url", "note");
const entry2 = new Entry("Name2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
const entry4 = new Entry("subentry1", "id234", new Date(), new Date(), "name2", "password", "url", "note");
const entry5 = new Entry("subentry2", "id234", new Date(), new Date(), "name2", "password", "url", "note");
root.addItem(subFolder1);
subFolder1.addItem(entry4);
subFolder2.addItem(entry5);
subFolder1.addItem(subFolder2);
root.addItem(entry);
root.addItem(entry2);
root.addItem(entry3);


const PasswordView: React.FC = () => {
    return (
        <div>
            <div className="passwordView">
                <div style={{width: "30%",}}>
                    <ListView item={root}></ListView>
                </div>
                <div style={{width: "70%"}}>
                    <EntryView entry={entry}></EntryView>
                </div>
            </div>
        </div>
    );
}

export default PasswordView;