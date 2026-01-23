import type {Item} from "../../Model/Item.ts";
import {type Attribute} from "../../Utility/AutomergeFacade.ts";
import {useState} from "react";
import type {Entry} from "../../Model/Entry.ts";

export const useEditablePasswordViewModel = (item: Item, updateItemAttribute: (itemId: string, changes: [Attribute, string | Date][]) => void) => {
//     'name' | 'createdAt' | 'editedAt' | 'parentId' | 'username' | 'password' | 'url' | 'note'

    const entry = item as Entry;
    const [title, setTitle] = useState(entry.title);
    const [username, setUsername] = useState(entry.username);
    const [password, setPassword] = useState(entry.password);
    const [url, setUrl] = useState(entry.url);
    const [note, setNote] = useState(entry.note);

    const titleDirty = title !== entry.title;
    const usernameDirty = username !== entry.username;
    const passwordDirty = password !== entry.password;
    const urlDirty = url !== entry.url;
    const noteDirty = note !== entry.note;

    function updateItemInAutomerge() {
        const dirtyValues = [titleDirty, usernameDirty, passwordDirty, urlDirty, noteDirty];
        const updateValues: [Attribute, string | Date][] = [["name", title], ["username", username], ["password", password], ["url", url], ["note", note]];

        const changedValues = updateValues.filter((_item, index) => dirtyValues[index]);

        updateItemAttribute(item.id, changedValues);
    };


    return {
        title,
        username,
        password,
        url,
        note,
        setTitle,
        setUsername,
        setPassword,
        setUrl,
        setNote,
        updateItemInAutomerge
    };
};