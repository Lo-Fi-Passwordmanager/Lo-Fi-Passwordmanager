import {beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useFilteredListViewModel} from "../../../src/Components/ViewModels/FilteredListViewModel";
import {Folder} from "../../../src/Model/Folder";
import {Entry} from "../../../src/Model/Entry";
import {Item} from "../../../src/Model/Item";

describe('FilteredListViewModel', () => {
    let root: Folder;
    let alvl1Folder1: Folder;
    let blvl1Folder2: Folder;
    let clvl2Folder1: Folder;
    let alvl1Entry1: Entry;
    let blvl1Entry2: Entry;
    let clvl2Entry1: Entry;
    let filterText: string;
    const getSortedChildern = vi.fn();

    beforeEach(async () => {
        filterText = "";


        root = new Folder("root", "");
        alvl1Folder1 = new Folder("alvl1Folder1", "01");
        blvl1Folder2 = new Folder("blvl1Folder2", "02");
        alvl1Entry1 = new Entry("alvl1Entry1", "03", new Date(1), new Date(1), "userName", "one", "url", "note");
        blvl1Entry2 = new Entry("blvl1Entry2", "04", new Date(0), new Date(0), "user", "two", "url", "note");
        root.addItem(alvl1Folder1);
        root.addItem(blvl1Folder2);
        root.addItem(alvl1Entry1);
        root.addItem(blvl1Entry2);
        clvl2Entry1 = new Entry("clvl2Entry1", "05", new Date(2), new Date(2), "userName1", "three", "url", "note");
        clvl2Folder1 = new Folder("clvl2Folder1", "06");
        alvl1Folder1.addItem(clvl2Entry1);
        alvl1Folder1.addItem(clvl2Folder1);
    })

    it('should return all Folders when no search filter is applied', async ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredFolders: Item[];
        act(() => {
            filteredFolders = result.current.getFilteredFolders();
        });
        await waitFor(() => {
            expect(filteredFolders.length).toBe(3);
            expect(filteredFolders).toStrictEqual([alvl1Folder1, blvl1Folder2, clvl2Folder1]);
        })
    })

    it('should return all Entries when no search filter is applied', async ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(3);
            expect(filteredEntries).toStrictEqual([alvl1Entry1, blvl1Entry2, clvl2Entry1]);
        });
    });

    it('should be able to search in an attribute of an entry', async ()=> {
        filterText = "Name";
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(2);
            expect(filteredEntries).toStrictEqual([alvl1Entry1, clvl2Entry1]);
        });
    });

    it('should be able to Filter by name in reverse Order', async ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(3);
            expect(filteredEntries).toStrictEqual([clvl2Entry1, blvl1Entry2, alvl1Entry1]);
        });
    });

    it('should be able to Filter by Creation Date', async ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(3);
            expect(filteredEntries).toStrictEqual([blvl1Entry2, alvl1Entry1, clvl2Entry1]);
        });
    });

    it('should be able to Filter by Creation Date in reverse Order', async ()=> {
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(3);
            expect(filteredEntries).toStrictEqual([clvl2Entry1, alvl1Entry1, blvl1Entry2]);
        });
    });

    it('should be able to Filter by Edit Date', async ()=> {
        blvl1Entry2.url = "newUrl";
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(3);
            expect(filteredEntries).toStrictEqual([alvl1Entry1, clvl2Entry1, blvl1Entry2]);
        });
    });

    it('should be able to Filter by Edit Date in reverse Order', async ()=> {
        blvl1Entry2.url = "newUrl";
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredEntries: Item[];
        act(() => {
            filteredEntries = result.current.getFilteredEntries();
        });
        await waitFor(() => {
            expect(filteredEntries.length).toBe(3);
            expect(filteredEntries).toStrictEqual([blvl1Entry2, clvl2Entry1, alvl1Entry1]);
        });
    });


    it('should only return items that fullfill the search criteria', async () => {
        filterText = "lvl1"
        const {result} = renderHook(() =>
            useFilteredListViewModel(root, filterText, getSortedChildern));
        let filteredFolders: Item[];
        act(() => {
            filteredFolders = result.current.getFilteredFolders();
        });
        await waitFor(() => {
            expect(filteredFolders.length).toBe(2);
            expect(filteredFolders).toStrictEqual([alvl1Folder1, blvl1Folder2]);
        });
    })
})