import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Folder} from "../../../src/Model/Folder";
import {Entry} from "../../../src/Model/Entry";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useListViewModel} from "../../../src/Components/ViewModels/ListViewModel";
import {SortCriteria} from "../../../src/Components/ViewModels/PasswordViewModel";

describe("ListViewModel", () => {

    const topItem = new Folder("krasser Titel", "123", new Date(1), new Date(2));
    const currentSortCrit = SortCriteria.Name;
    const isAscending = true;
    const dirtyItemID: string = "";
    const setCurrItem = vi.fn();
    const updateItemTitle = vi.fn();
    const setCreatedFolderId = vi.fn();
    const createdFolderId = null;


    const subFolder1 = new Folder("subFolder 1", "123", new Date(4), new Date(8));
    const entry = new Entry("Name1", "id123", new Date(3), new Date(6), "benutzer1", "password", "url", "note");
    const entry3 = new Entry("Name3", "id123", new Date(2), new Date(12), "benutzer1", "password", "url", "note");
    const entry2 = new Entry("Name2", "id234", new Date(5), new Date(10), "name2", "password", "url", "note");
    topItem.addItem(subFolder1);
    topItem.addItem(entry);
    topItem.addItem(entry2);
    topItem.addItem(entry3);


    beforeEach(() => {

    });

    afterEach(() => {

    });

    it("should be able to tell when its a folder", () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        expect(result.current.isItemFolder()).toBe(true);
        expect(result.current.isItemEntry()).toBe(false);
    });

    it("should be able to tell when its an entry", () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        expect(result.current.isItemFolder()).toBe(false);
        expect(result.current.isItemEntry()).toBe(true);
    });

    it("should be able to return itself", () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        expect(result.current.getItem()).toStrictEqual(topItem);
    });

    it("should be able to return its children", () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        const children = result.current.getChildren();
        expect(children.length).toBe(4);
        const sortedByTitle = [subFolder1, entry, entry2, entry3].sort((a, b) => a.title.localeCompare(b.title));
        expect(children).toStrictEqual(sortedByTitle);
    });

    it("should correctly handle to extended state", () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        expect(result.current.getExtended()).toBe(true);
        act(() => {
            result.current.toggleExtended();
        });
        expect(result.current.getExtended()).toBe(false);
        act(() => {
            result.current.toggleExtended();
        });
        expect(result.current.getExtended()).toBe(true);
    });

    it("should return nothing as childern when the item is an entry", () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        expect(result.current.getChildren()).toBe(undefined);
    });

    it('should be able to call for an update to an item in automerge', async () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, currentSortCrit, isAscending, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        act(() => {
            result.current.setItemTitle("newName");
        })
        act(() => {
            result.current.updateTitleInAutomerge();
        });
        await waitFor(() => {
            expect(updateItemTitle).toHaveBeenCalledWith("123", "newName");
        })
    });

    it('should be able to', () => {

    })

    it('should be able to sort according to criteria', () => {
        let {result} = renderHook(() =>
            useListViewModel(topItem, SortCriteria.Name, true, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId));
        expect(result.current.getChildren()).toStrictEqual([entry, entry2, entry3, subFolder1]);

        ({ result } = renderHook(() =>
            useListViewModel(topItem, SortCriteria.Name, false, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId)));
        expect(result.current.getChildren()).toStrictEqual([subFolder1, entry3, entry2, entry]);

        ({ result } = renderHook(() =>
            useListViewModel(topItem, SortCriteria.CreatedAt, true, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId)));
        expect(result.current.getChildren()).toStrictEqual([entry3, entry, subFolder1, entry2]);

        ({ result } = renderHook(() =>
            useListViewModel(topItem, SortCriteria.CreatedAt, false, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId)));
        expect(result.current.getChildren()).toStrictEqual([entry2, subFolder1, entry, entry3]);

        ({ result } = renderHook(() =>
            useListViewModel(topItem, SortCriteria.EditedAt, true, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId)));
        expect(result.current.getChildren()).toStrictEqual([entry, subFolder1, entry2, entry3]);

        ({ result } = renderHook(() =>
            useListViewModel(topItem, SortCriteria.EditedAt, false, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId)));
        expect(result.current.getChildren()).toStrictEqual([entry3, entry2, subFolder1, entry]);

    })
});