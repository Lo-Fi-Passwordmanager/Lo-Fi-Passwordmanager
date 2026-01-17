import React from "react";
import {Entry} from "../../Model/Entry.ts";
import {Folder} from "../../Model/Folder.ts";
import ListView from "./ListView.tsx";
import EntryView from "./EntryView.tsx";
import {usePasswortViewModel} from "../ViewModels/PasswordViewModel.ts";
import {AutomergeFacade, useAutomergeFacade} from "../../Utility/AutomergeFacade.ts";


const root = new Folder("krasser Titel", "123", new Date(), new Date())
const subFolder1 = new Folder("subFolder 1", "123", new Date(), new Date())
const subFolder2 = new Folder("subFolder 2", "123", new Date(), new Date())
const subFolder3 = new Folder("subFolder 2", "123", new Date(), new Date())
const subFolder4 = new Folder("subFolder 2", "123", new Date(), new Date())
const subFolder5 = new Folder("subFolder 2", "123", new Date(), new Date())
const subFolder6 = new Folder("subFolder 2", "123", new Date(), new Date())
const subFolder7 = new Folder("subFolder 2", "123", new Date(), new Date())
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
subFolder2.addItem(subFolder3);
subFolder3.addItem(subFolder4);
subFolder4.addItem(subFolder5);
subFolder5.addItem(subFolder6);
subFolder6.addItem(subFolder7);

interface PasswordViewProps {
    automergeFacade?: AutomergeFacade | null
}

/**
 * The view that should be shown, when the user opened a database successfully and shows the whole structure and one selected entry
 */
const PasswordView: React.FC = ({automergeFacade}: PasswordViewProps) => {
    const passwordViewModel = usePasswortViewModel(entry, automergeFacade as AutomergeFacade);
    // Zu testzwecken eingefügt
    // const facade = useAutomergeFacade(automergeFacade)

    return (
        <div>
            <div className="passwordView">
                {/* the left 30% of the screen should be the list, showing the structure */}
                <div className="borderBox scrollableContainer" style={{width: "30%"}}>
                    {/* Zu testzwecken eingefügt <ListView item={facade.tree.rootFolder} onSetEntry={passwordViewModel.setCurEntry}/>*/}
                    <ListView item={passwordViewModel.getRootFolder()} onSetEntry={passwordViewModel.setCurEntry} addEntry={passwordViewModel.addEntry}/>
                </div>
                {/* The right 70% are showing the Entry in a big representation */}
                <div className="borderBox" style={{width: "70%"}}>
                    <EntryView entry={passwordViewModel.getCurEntry()}/>
                </div>
            </div>
        </div>
    );
}

export default PasswordView;