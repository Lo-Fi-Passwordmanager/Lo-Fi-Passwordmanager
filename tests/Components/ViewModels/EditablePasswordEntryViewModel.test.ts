import {describe, it, expect, beforeEach, vi} from "vitest";
import {Item} from "../../../src/Model/Item";
import {renderHook, waitFor, act} from "@testing-library/react";
import {useEditablePasswordViewModel} from "../../../src/Components/ViewModels/EditablePasswordViewModel";
import {Entry} from "../../../src/Model/Entry";

describe('EditablePasswordViewModel', () => {
    let item: Item;
    const updateItemAttribute = vi.fn();

    beforeEach(() => {
        item = new Entry("name", "id", new Date(), new Date(), "user", "password", "url", "note")
    })

    it('should call to update an automerge Item', async () => {
        const {result} = renderHook(() => useEditablePasswordViewModel(item, updateItemAttribute));
        act(() => {
            result.current.updateItemInAutomerge();
        });
        await waitFor(() => {
            expect(updateItemAttribute).toHaveBeenCalled();
        });
    });

    it('should be able to tell if no attribute has changed', async ()=> {
        const {result} = renderHook(() => useEditablePasswordViewModel(item, updateItemAttribute));
        await waitFor(() => {
            expect(result.current.hasChanges()).toBe(false);
        });
    });

    it('should be able to tell if an attribute has changed', async ()=> {
        const {result} = renderHook(() => useEditablePasswordViewModel(item, updateItemAttribute));
        act(() => {
            result.current.setPassword("newPassword")
        })
        await waitFor(() => {
            expect(result.current.hasChanges()).toBe(true);
        });
    });
});