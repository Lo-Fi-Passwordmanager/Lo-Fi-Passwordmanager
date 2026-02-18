import {useState} from "react";

import {Entry} from "../../Model/Entry.ts";
import type {Item} from "../../Model/Item.ts";
import {type Attribute} from "../../Utility/AutomergeFacade.ts";

export const useEditablePasswordViewModel = (
    item: Item,
    updateItemAttribute: (itemId: string, changes: [Attribute, string | Date][]) => void,
    createItem: (item: Item) => void,
    inCreation: boolean,
    setInCreation: (inCreation: boolean) => void,
    setEditableView: () => void
) => {
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

    function hasChanges(): boolean {
        return (title != entry.title || username != entry.username || password != entry.password || url != entry.url || note != entry.note);
    }

    /**
     * Create the actual entry in Automerge after saving the temporary
     */
    function createItemInAutomerge() {
        createItem(new Entry(
            title,
            "willBeAutomaticallySet",
            new Date(),
            new Date(),
            username,
            password,
            url,
            note
        ));
    }

    function saveEntry() {
        if (inCreation) {
            setInCreation(false);
            createItemInAutomerge();
        } else if (hasChanges()) {
            updateItemInAutomerge();
        }
        setEditableView();
    }

    function cancelSaving() {
        if (inCreation) {
            setInCreation(false);
            item.deleted = true; //FIXME: meckert rum aber eigentlich klappt es
        }
        setEditableView();
    }

    return {
        title,
        username,
        password,
        url,
        note,
        hasChanges,
        setTitle,
        setUsername,
        setPassword,
        setUrl,
        setNote,
        updateItemInAutomerge,
        createItemInAutomerge,
        saveEntry,
        cancelSaving
    };
};