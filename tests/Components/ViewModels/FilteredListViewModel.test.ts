import {beforeEach, describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useFilteredListViewModel} from "../../../src/Components/ViewModels/FilteredListViewModel";
import {Folder} from "../../../src/Model/Folder";
import {SortCriteria} from "../../../src/Components/ViewModels/PasswordViewModel";
import {Entry} from "../../../src/Model/Entry";

describe('FilteredListViewModel', () => {
    let root: Folder;
    let alvl1Folder1: Folder;
    let blvl1Folder2: Folder;
    let clvl2Folder1: Folder;
    let alvl1Entry1: Entry;
    let blvl1Entry2: Entry;
    let clvl2Entry1: Entry;
    let filterText: string = "";
    let currentSortCrit: SortCriteria = "NAME";
    let isAscending: boolean = true;

    beforeEach(() => {
        root = new Folder("root", "");
        alvl1Folder1 = new Folder("alv1Folder1", "01");
        blvl1Folder2 = new Folder("blv1Folder2", "02");
        alvl1Entry1 = new Entry("alvl1Entry1", "03", new Date(), new Date(), "user", "one", "url", "note");
        blvl1Entry2 = new Entry("blvl1Entry2", "04", new Date(), new Date(), "user", "two", "url", "note");
        root.addItem(alvl1Folder1);
        root.addItem(blvl1Folder2);
        root.addItem(alvl1Entry1);
        root.addItem(blvl1Entry2);
        clvl2Entry1 = new Entry("clvl2Entry1", "05", new Date(), new Date(), "user", "three", "url", "note");
        alvl1Folder1.addItem(clvl2Entry1);
    })

    it('should return all entries when no search filters is applied', ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, currentSortCrit, isAscending));
        let filteredFolders: Folder;
        act(() => {
            filteredFolders = result.current.getFilteredFolders();
        });
        expect(filteredFolders.entries.length).toBe(3);
    })

    it('should be awesome', ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, currentSortCrit, isAscending));
        let filteredEntries: Folder;
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        console.log(filteredEntries)
    })
})