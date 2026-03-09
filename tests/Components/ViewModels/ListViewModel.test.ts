import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {Folder} from "../../../src/Model/Folder";
import {Entry} from "../../../src/Model/Entry";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useListViewModel} from "../../../src/Components/ViewModels/ListViewModel";
import * as dndKit from '@dnd-kit/core';

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
    const setDraggableRef = vi.fn();
    const setDroppableRef = vi.fn();

    const subFolder1 = new Folder("subFolder 1", "123", new Date(4), new Date(8));
    const entry = new Entry("Name1", "id123", new Date(3), new Date(6), "benutzer1", "password", "url", "note");
    const entry3 = new Entry("Name3", "id123", new Date(2), new Date(12), "benutzer1", "password", "url", "note");
    const entry2 = new Entry("Name2", "id234", new Date(5), new Date(10), "name2", "password", "url", "note");
    topItem.addItem(subFolder1);
    topItem.addItem(entry);
    topItem.addItem(entry2);
    topItem.addItem(entry3);

    vi.mock('@dnd-kit/core', () => ({
        useDndContext: vi.fn(),
        useDraggable: vi.fn(),
        useDroppable: vi.fn(),
    }));


    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(dndKit.useDndContext).mockReturnValue({active: null} as any);

        vi.mocked(dndKit.useDraggable).mockReturnValue({
            setNodeRef: setDraggableRef,
            attributes: {},
            listeners: {},
            transform: null,
            isDragging: false,
        } as any);

        vi.mocked(dndKit.useDroppable).mockReturnValue({
            setNodeRef: setDroppableRef,
            isOver: false,
        } as any);
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
            result.current.updateTitleInAutomerge();
        });
        act(() => {
            result.current.setAndStoreEditName(false);
        });
        expect(result.current.inEditName).toBe(false);
        expect(updateItemTitle).toHaveBeenCalledWith("id123", "newName");
    });

    it('should reset the new title when a folder was just created', async () => {
        const {result} = renderHook(() =>
            useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, "id123", expandFolderId, collapseFolderId, isFolderExpanded));
        expect(result.current.newTitle).toBe("Name1");
    });

    it('should call both ref setter with the HTML element', () => {
        const {result} = renderHook(() => useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));

        const mockNode = document.createElement('div');

        result.current.setFolderRef(mockNode);

        expect(setDraggableRef).toHaveBeenCalledWith(mockNode);
        expect(setDroppableRef).toHaveBeenCalledWith(mockNode);
        expect(setDraggableRef).toHaveBeenCalledTimes(1);
        expect(setDroppableRef).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when the ref setter is called with null', () => {
        const {result} = renderHook(() => useListViewModel(entry, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded));

        result.current.setFolderRef(null);

        expect(setDraggableRef).not.toHaveBeenCalled();
        expect(setDroppableRef).not.toHaveBeenCalled();
    });

    it('should return if the item is an invalid drop target', () => {
        // mock the dnd context to simulate that some item is being dragged and one of its descendant is the top item
        vi.mocked(dndKit.useDndContext).mockReturnValue({
            active: {
                id: 'id123',
                data: {
                    current: {
                        descendantIds: ['123', 'id234']
                    }
                }
            }
        } as any);

        const { result } = renderHook(() => useListViewModel(
            topItem, dirtyItemID, setCurrItem, updateItemTitle, setCreatedFolderId, createdFolderId, expandFolderId, collapseFolderId, isFolderExpanded
        ));
        expect(result.current.isInvalidDropTarget).toBe(true);
    });

});