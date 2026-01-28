import {useState} from "react";
import {Entry} from "../../../Model/Entry.ts";
import {Folder} from "../../../Model/Folder.ts";
import type {Item} from "../../../Model/Item.ts";

export const useItemcreationViewModel = (
    addItem: ((item: Item, id: string) => string), setCurItem: (newItem: Item) => void, curParent: Item, cancelItemCreation: () => void) => {

    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");
    const [inPasswordGen, setInPasswordGen] = useState(false);

    function createEntry() {
        const entry = new Entry("Neuer Eintrag", "willBeAutomaticallySet", new Date(), new Date(), "", "", "", "");
        const newId = addItem(entry, curParent.id);
        entry.id = newId;
        setCurItem(entry);
        cancelItemCreation();
    }

    function createFolder() {
        const folder = new Folder("Neuer Ordner", "willBeAutomaticallySet", new Date(), new Date());
        addItem(folder, curParent.id);
        cancelItemCreation();
    }

    return {
        title,
        username,
        password,
        url,
        note,
        inPasswordGen,
        setInPasswordGen,
        setNote,
        setUrl,
        setPassword,
        setUsername,
        setTitle,
        createFolder,
        createEntry
    };
};