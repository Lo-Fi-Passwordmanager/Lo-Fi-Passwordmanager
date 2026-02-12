import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Folder} from "../../../src/Model/Folder";
import {Entry} from "../../../src/Model/Entry";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useListViewModel} from "../../../src/Components/ViewModels/ListViewModel";

describe("ListViewModel", () => {

    const topItem = new Folder("krasser Titel", "123", new Date(1), new Date(2));
    const dirtyItemID: string = "";
    const setCurrItem = vi.fn();
    const updateItemTitle = vi.fn();
    const setCreatedFolderId = vi.fn();
    const createdFolderId = null;
    const isFolderExpanded = vi.fn();
    const expandFolderId = vi.fn();
    const collapseFolderId = vi.fn();


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
            useListViewModel(topItem, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        expect(result.current.isItemFolder()).toBe(true);
        expect(result.current.isItemEntry()).toBe(false);
    });

    it("should be able to tell when its an entry", () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        expect(result.current.isItemFolder()).toBe(false);
        expect(result.current.isItemEntry()).toBe(true);
    });

    it("should be able to return itself", () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        expect(result.current.getItem()).toStrictEqual(topItem);
    });

    it("should be able to return its children", () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        const children = result.current.descendantIds;
        expect(children.length).toBe(4);
    });

    it('should return an empty list if the folder has no children', () => {
        const {result} = renderHook(() =>
            useListViewModel(subFolder1, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        expect(result.current.descendantIds.length).toBe(0);
    });

    it("should return nothing as childern when the item is an entry", () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        expect(result.current.descendantIds.length).toBe(0);
    });

    it('should be able to call for an update to an item in automerge', async () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
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

    it('should set the current item after an update in automerge', async () => {
        renderHook(() =>
            useListViewModel(topItem, "123", setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        await waitFor(() => {
            expect(setCurrItem).toHaveBeenCalledWith(topItem);
        })
    });

    it('should expand and collapse the folder', async () => {
        const {result} = renderHook(() =>
            useListViewModel(topItem, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        act(() => {
            result.current.toggleExpanded();
        });
        await waitFor(() => {
            expect(expandFolderId).toHaveBeenCalledWith("123");
        });
        isFolderExpanded.mockReturnValue(true);
        act(() => {
            result.current.toggleExpanded();
        });
        await waitFor(() => {
            expect(collapseFolderId).toHaveBeenCalledWith("123");
        });
        act(() => {
            result.current.expandFolder();
        });
        await waitFor(() => {
            expect(expandFolderId).toHaveBeenCalledWith("123");
        });
    });

    it('should return if the top item is an entry', async () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        const item = result.current.getItem();
        expect(item).toStrictEqual(entry);
        expect(result.current.isItemEntry()).toBe(true);
    })

    it('should toggle the edit name state and store the new name', async () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));
        act(() => {
            result.current.setAndStoreEditName(true);
        });
        expect(result.current.inEditName).toBe(true);
        act(() => {
            result.current.setItemTitle("newName");
        });
        expect(result.current.newTitle).toBe("newName");
        act(() => {
            result.current.setAndStoreEditName(false);
        });
        expect(result.current.inEditName).toBe(false);
        expect(updateItemTitle).toHaveBeenCalledWith("id123", "newName");
    });

});