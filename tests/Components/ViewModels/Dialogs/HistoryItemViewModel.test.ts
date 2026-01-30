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
    const entry = new AutomergeEntry("1234", 1000, 1000, "0000","aaaa", "bbbb", "cccc", "dddd")
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
        const {result} = renderHook(() => useHistoryItemViewModel(hEntryNew, secProvider));
        let decypted
        act(() => {
            decypted = result.current.decrypt(validation);
        })
        expect(decypted != null).toBe(true);
    });

    it('should be able to covert a number into the correct corresponding Date', ()=> {
        const {result} = renderHook(() => useHistoryItemViewModel(hEntryNew, secProvider));
        console.log(result.current.convertDate(1));

    })
})