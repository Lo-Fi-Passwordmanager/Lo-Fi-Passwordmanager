import {useState} from "react";
import {useTranslation} from "react-i18next";

import type {AutomergeEntry} from "../../../Model/Automerge/AutomergeEntry.ts";
import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";
import {isFolder} from "../../../Utility/AutomergeHelper.ts";
import type {SecurityProvider} from "../../../Utility/Security/SecurityProvider.ts";


/**
 * The ViewModel for a {@link HistoryItem} in the {@link HistoryDialog}
 * @param historyEntry the Entry to be shown (should be retrieved from the Automerge history)
 * @param securityProvider the security Provider used to decrypt the values
 */
export const useHistoryItemViewModel = (historyEntry: HistoryEntry, securityProvider: SecurityProvider) => {

    const {t} = useTranslation();
    const itemType = historyEntry.type;
    const name = securityProvider.decryptValue(historyEntry.item.name);
    const editedAt = new Date(historyEntry.item.editedAt * 1000);
    const createdAt = new Date(historyEntry.item.createdAt * 1000);

    const [passwordVisible, setPasswordVisible] = useState(false);

    function togglePasswordVisible() {
        setPasswordVisible(!passwordVisible);
    }

    let username: string | null = null;
    let password: string | null = null;
    let url: string | null = null;
    let note: string | null = null;
    const oldParent = decrypt(historyEntry.oldParent);
    const parent = decrypt(historyEntry.changes.get("parentId") as string);

    if (!isFolder(historyEntry.item)) {
        username = decrypt((historyEntry.item as AutomergeEntry).username);
        password = decrypt((historyEntry.item as AutomergeEntry).password);
        url = decrypt((historyEntry.item as AutomergeEntry).url);
        note = decrypt((historyEntry.item as AutomergeEntry).note);
    }

    const changes = historyEntry.changes;

    const itemIsFolder = isFolder(historyEntry.item);

    function decrypt(value: string) {
        if (value === undefined || value === "") {
            return "";
        }
        return securityProvider.decryptValue(value);
    }

    function convertDate(value: number): string {
        return (new Date(value * 1000)).toDateString();
    }

    function get(attribute: string) {
        switch (attribute) {
            case "name":
                return name;
            case "username":
                return username;
            case "password":
                return password;
            case "url":
                return url;
            case "note":
                return note;
            case "editedAt":
                return editedAt.toDateString();
            case "createdAt":
                return createdAt.toDateString();
            default:
                return "";
        }
    }

    function getAttributeName(attribute: string) {
        switch (attribute) {
            case "name":
                return "Name";
            case "username":
                return "Benutzername";
            case "password":
                return "Passwort";
            case "url":
                return "URL";
            case "note":
                return "Notiz";
            case "editedAt":
                return "Zuletzt bearbeitet";
            case "createdAt":
                return "Erstellungsdatum";
            default:
                return "";
        }

    }

    const config = {
        new: {icon: "✦", class: "status-new", label: itemIsFolder ? "Ordner erstellt" : "Eintrag erstellt"},
        deleted: {
            icon: "✕",
            class: "status-deleted",
            label: itemIsFolder ? t("history.delete.folder") : t("history.delete.entry")
        },
        update: {
            icon: "✎",
            class: "status-update",
            label: itemIsFolder ? t("history.update.folder") : t("history.update.entry")
        },
        move: {
            icon: ">",
            class: "status-move",
            label: itemIsFolder ? t("history.move.folder") : t("history.move.entry")
        }
    };

    const currentConfig = config[itemType];

    return {
        itemType,
        name,
        username,
        password,
        url,
        note,
        editedAt,
        createdAt,
        oldParent,
        parent,
        changes,
        itemIsFolder,
        get,
        decrypt,
        convertDate,
        getAttributeName,
        currentConfig,
        passwordVisible,
        togglePasswordVisible
    };
};