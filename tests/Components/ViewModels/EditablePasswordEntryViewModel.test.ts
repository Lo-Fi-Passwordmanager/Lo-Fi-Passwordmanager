import {describe, it, expect, beforeEach, vi} from "vitest";
import {Item} from "../../../src/Model/Item";
import {renderHook, waitFor, act} from "@testing-library/react";
import {useEditablePasswordViewModel} from "../../../src/Components/ViewModels/EditablePasswordViewModel";
import {Entry} from "../../../src/Model/Entry";

describe('EditablePasswordViewModel', () => {
    let item: Item;
    const updateItemAttribute = vi.fn();
    const createItem = vi.fn();
    let inCreation: boolean;
    const setEditableView = vi.fn();
    const setInCreation = vi.fn();

    beforeEach(() => {
        item = new Entry("name", "id", new Date(), new Date(), "user", "password", "url", "note");
        vi.resetAllMocks();
    })

    it('should call to update an automerge Item', async () => {
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.updateItemInAutomerge();
        });
        await waitFor(() => {
            expect(updateItemAttribute).toHaveBeenCalled();
        });
    });

    it('should be able to tell if no attribute has changed', async ()=> {
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        await waitFor(() => {
            expect(result.current.hasChanges()).toBe(false);
        });
    });

    it('should be able to tell if an attribute has changed', async ()=> {
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.setPassword("newPassword")
        })
        await waitFor(() => {
            expect(result.current.hasChanges()).toBe(true);
        });
    });

    it('should be able to create an Item in Automerge', ()=> {
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.createItemInAutomerge();
        });
        expect(createItem).toHaveBeenCalled();
    });

    it('should', ()=> {
        inCreation = false;
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.saveEntry();
        })
        expect(setEditableView).toHaveBeenCalled();
    })

    it('should be able to correctly save an entry', ()=> {
        inCreation = true;
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.saveEntry();
        });
        expect(createItem).toHaveBeenCalled();
        expect(setEditableView).toHaveBeenCalled();
    });

    it('should be able to save changes', ()=> {
        inCreation = false;
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.setTitle("newTitle");
        });
        act(() => {
            result.current.saveEntry();
        })
        expect(updateItemAttribute).toHaveBeenCalled();
        expect(setEditableView).toHaveBeenCalled();
    });

    it('should be able to handle cancel Saving while in Creation', () => {
        inCreation = true;
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.cancelSaving();
        });
        expect(setInCreation).toHaveBeenCalled();
        expect(setEditableView).toHaveBeenCalled();
    });

    it('should be able to handle cancel Saving while in Creation', () => {
        inCreation = false;
        const {result} = renderHook(() =>
            useEditablePasswordViewModel(item, updateItemAttribute, createItem, inCreation, setInCreation, setEditableView));
        act(() => {
            result.current.cancelSaving();
        });
        expect(setInCreation).toHaveBeenCalledTimes(0);
        expect(setEditableView).toHaveBeenCalled();
    });
});