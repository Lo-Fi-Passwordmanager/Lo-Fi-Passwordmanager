import {beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useItemCreationViewModel} from "../../../../src/Components/ViewModels/Dialog/ItemCreationViewModel";

describe('ItemCreationViewModel' , () => {
    const addItem = vi.fn();
    const setCurItem = vi.fn();
    beforeEach(()=> {
        vi.resetAllMocks();
    })

    it('should be able to create an empty entry',async ()=> {
        const {result} = renderHook(() =>
            useItemCreationViewModel(addItem, setCurItem));
        result.current.createEntry()
        await waitFor(() => {
            expect(addItem).toHaveBeenCalledTimes(1);
            expect(setCurItem).toHaveBeenCalledTimes(1);
        })
    })

    it('should be able to create a new Folder',async ()=> {
        const {result} = renderHook(() =>
            useItemCreationViewModel(addItem, setCurItem));
        act(() => {
            result.current.setTitle("Uni")
        })
        result.current.createFolder()
        await waitFor(() => {
            expect(addItem).toHaveBeenCalledTimes(1);
            expect(setCurItem).toHaveBeenCalledTimes(1);
        })
    });

    it('should not create a new Item when the item Type is wrong',async ()=> {
        const {result} = renderHook(() =>
            useItemCreationViewModel(addItem, setCurItem, curParent, cancelItemCreation));
        act(() => {
            result.current.setTypeOfItem("wederNoch");
        })
        result.current.handleConfirm();
        await waitFor(() => {
            expect(addItem).toHaveBeenCalledTimes(0);
        })
    })
})