import type {HistoryEntry} from "../../../Model/Automerge/HistoryEntry.ts";
import type {AutomergeEntry} from "../../../Model/Automerge/AutomergeEntry.ts";
import {isFolder} from "../../../Utility/AutomergeHelper.ts";
import type {SecurityProvider} from "../../../Utility/Security/SecurityProvider.ts";

/**
 * The ViewModel that is used for interfacing the {@link Settings} singleton.
 * It uses states to reload react when chaning settings, so that they get applied
 */
export const useHistoryItemViewModel = (historyEntry: HistoryEntry, securityProvider: SecurityProvider) => {


    const itemType = historyEntry.type;
    const name = securityProvider.decryptValue(historyEntry.item.name);
    const editedAt = new Date(historyEntry.item.editedAt * 1000);
    const createdAt = new Date(historyEntry.item.createdAt * 1000);

    let username: string | null = null;
    let password: string | null = null;
    let url: string | null = null;
    let note: string | null = null;

    if (!isFolder(historyEntry.item)) {
        username = securityProvider.decryptValue((historyEntry.item as AutomergeEntry).username);
        password = securityProvider.decryptValue((historyEntry.item as AutomergeEntry).password);
        url = securityProvider.decryptValue((historyEntry.item as AutomergeEntry).url);
        note = securityProvider.decryptValue((historyEntry.item as AutomergeEntry).note);
    }

    const changes = historyEntry.changes;

    const itemIsFolder = isFolder(historyEntry.item);

    function decrypt(value: string) {
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
            label: itemIsFolder ? "Ordner gelöscht" : "Eintrag gelöscht"
        },
        update: {
            icon: "✎",
            class: "status-update",
            label: itemIsFolder ? "Ordner bearbeitet" : "Eintrag bearbeitet"
        }
    };

    const currentConfig = config[itemType as keyof typeof config];

    return {
        itemType,
        name,
        username,
        password,
        url,
        note,
        editedAt,
        createdAt,
        changes,
        itemIsFolder,
        get,
        decrypt,
        convertDate,
        getAttributeName,
        currentConfig
    };
};