import {useState} from "react";
import {Entry} from "../../../Model/Entry.ts";
import {Folder} from "../../../Model/Folder.ts";
import type { Item } from "../../../Model/Item.ts";

export const useItemcreationViewModel = (
    addItem: ((item: Item, id: string) => void), setCurItem: (newItem: Item) => void, curParent: Item, cancelItemCreation: () => void) => {

    const [typeOfItem, setTypeOfItem] = useState("entry")
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");
    const [inPasswordGen, setInPasswordGen] = useState(false);


    function handleConfirm() {
        // Temp var must be created, because the react hook is updated only after the functino is fully executed
        let newTitle = title.trim();
        if (newTitle === "") {
            newTitle = "Neuer " + ((typeOfItem === "entry")? "Eintrag":"Ordner");
        }
        if (typeOfItem === "entry") {
            const entry: Entry = new Entry(newTitle, "willBeAutomaticallySet", new Date(), new Date(), username, password, url, note);
            addItem(entry, curParent.id)
            setCurItem(entry);
        } else if (typeOfItem === "folder") {
            addItem(new Folder(newTitle, "willBeAutomaticallySet", new Date(), new Date()), curParent!.id)
        }
        cancelItemCreation();
    }

    return {
        title,
        username,
        password,
        url,
        note,
        inPasswordGen,
        typeOfItem,
        setInPasswordGen,
        setNote,
        setUrl,
        setPassword,
        setUsername,
        setTitle,
        setTypeOfItem,
        handleConfirm,
    }
}