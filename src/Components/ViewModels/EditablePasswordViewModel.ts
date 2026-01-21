import type { Item } from "../../Model/Item.ts";
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

    function updateItemInAutomerge() {
        updateItemAttribute(item.id, [['name', title], ['username', username], ['password', password], ['url', url], ['note', note]]);
    }


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
        updateItemInAutomerge,
    };
};