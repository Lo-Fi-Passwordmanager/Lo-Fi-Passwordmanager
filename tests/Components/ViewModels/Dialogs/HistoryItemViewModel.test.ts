import {beforeEach, describe, expect, it} from "vitest";
import {SecurityProvider} from "../../../../src/Utility/Security/SecurityProvider";
import {act, renderHook} from "@testing-library/react";
import {useHistoryItemViewModel} from "../../../../src/Components/ViewModels/Dialog/HistoryItemViewModel";
import {HistoryEntry} from "../../../../src/Model/Automerge/HistoryEntry";
import {AutomergeEntry} from "../../../../src/Model/Automerge/AutomergeEntry";
import {AutomergeFolder} from "../../../../src/Model/Automerge/AutomergeFolder";

describe('HistoryItemViewModel', ()=> {
    const secProvider = new SecurityProvider();
    const salt = secProvider.getNewSalt();
    const validation = secProvider.getNewValidation("password", salt);
    const entry = new AutomergeEntry(secProvider.encryptValue("1234"), 1000, 1000,
        "0000",secProvider.encryptValue("aaaa"), secProvider.encryptValue("bbbb"), secProvider.encryptValue("cccc"), secProvider.encryptValue("dddd"))
    const folder = new AutomergeFolder("1234", 1, 1, "0000")
    const hEntryNew: HistoryEntry = {
        itemId: "0000",
        changes: new Map([
            ["name", "4321"],
        ]),
        type: "new",
        item: entry,
    };

    const hFolderNew: HistoryEntry = {
        itemId: "0000",
        changes: new Map([
            ["name", "4321"],
        ]),
        type: "new",
        item: folder,
    };

    beforeEach(() => {

    });

    it('should be able to toggle the password visability', () => {
        const {result} = renderHook(() => useHistoryItemViewModel(hEntryNew, secProvider));
        expect(result.current.passwordVisible).toBe(false);
        act(() => {
            result.current.togglePasswordVisible();
        })
        expect(result.current.passwordVisible).toBe(true);
        act(() => {
            result.current.togglePasswordVisible();
        });
        expect(result.current.passwordVisible).toBe(false);
    });

    it('should be able to decrypt a value correctly', () => {
        const {result} = renderHook(() => useHistoryItemViewModel(hFolderNew, secProvider));
        let decrypted;
        act(() => {
            decrypted = result.current.decrypt(validation);
        })
        expect(decrypted != null).toBe(true);
    });

    it('should be able to covert a number into the correct corresponding Date', ()=> {
        const {result} = renderHook(() => useHistoryItemViewModel(hEntryNew, secProvider));
        console.log(result.current.convertDate(1));

    });

    it('should be able to give the correct Attribute Name', ()=> {
        const {result} = renderHook(() => useHistoryItemViewModel(hEntryNew, secProvider));
        expect(result.current.getAttributeName("name")).toBe("Name");
        expect(result.current.getAttributeName("username")).toBe("Benutzername");
        expect(result.current.getAttributeName("password")).toBe("Passwort");
        expect(result.current.getAttributeName("url")).toBe("URL");
        expect(result.current.getAttributeName("note")).toBe("Notiz");
        expect(result.current.getAttributeName("editedAt")).toBe("Zuletzt bearbeitet");
        expect(result.current.getAttributeName("createdAt")).toBe("Erstellungsdatum");
        expect(result.current.getAttributeName("")).toBe("");
    });

    it('should be able to return the correct Attribute', ()=> {
        const {result} = renderHook(() => useHistoryItemViewModel(hEntryNew, secProvider));
        expect(result.current.get("name")).toBe("1234");
        expect(result.current.get("username")).toBe("aaaa");
        expect(result.current.get("password")).toBe("bbbb");
        expect(result.current.get("url")).toBe("cccc");
        expect(result.current.get("note")).toBe("dddd");
        expect(result.current.get("editedAt")).toBe(new Date (1000).toDateString());
        expect(result.current.get("createdAt")).toBe(new Date (1000).toDateString());
        expect(result.current.get("")).toBe("");
    });
})