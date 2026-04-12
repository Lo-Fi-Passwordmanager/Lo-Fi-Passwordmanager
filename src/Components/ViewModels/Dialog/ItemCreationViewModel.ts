import {useState} from "react";
import {useTranslation} from "react-i18next";

import {Entry} from "../../../Model/Entry.ts";
import {Folder} from "../../../Model/Folder.ts";
import type {Item} from "../../../Model/Item.ts";

/**
 * The Viewmodel for {@link ItemCreationDialog}
 *
 * @param addItem a function to add an item to the data structure
 * @param cancelItemCreation the function to set the visibility of this dialog
 */
export const useItemCreationViewModel = (
    addItem: ((item: Item) => void),
    cancelItemCreation: () => void) => {

    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");
    const [inPasswordGen, setInPasswordGen] = useState(false);
    const {t} = useTranslation();

    function createEntry() {
        const entry = new Entry(t("common.new_entry"), "willBeAutomaticallySet", new Date(), new Date(), "", "", "", "");
        addItem(entry);
        cancelItemCreation();
    }

    function createFolder() {
        const folder = new Folder(t("common.new_folder"), "willBeAutomaticallySet", new Date(), new Date());
        addItem(folder);
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