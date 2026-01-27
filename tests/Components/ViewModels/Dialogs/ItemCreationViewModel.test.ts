import {beforeEach, describe, expect, it, vi} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useItemcreationViewModel} from "../../../../src/Components/ViewModels/Dialog/ItemcreationViewModel";
import {Item} from "../../../../src/Model/Item";
import {Folder} from "../../../../src/Model/Folder";

describe('ItemCreationViewModel' , () => {
    const addItem = vi.fn();
    const setCurItem = vi.fn();
    const curParent: Item = new Folder("parent", "id0");
    const cancelItemCreation = vi.fn();
    beforeEach(()=> {
        vi.resetAllMocks();
    })

    it('should be able to create an empty entry',async ()=> {
        const {result} = renderHook(() =>
            useItemcreationViewModel(addItem, setCurItem, curParent, cancelItemCreation));
        result.current.handleConfirm();
        await waitFor(() => {
            expect(addItem).toHaveBeenCalledTimes(1);
            expect(setCurItem).toHaveBeenCalledTimes(1);
        })
    })

    it('should be able to create a new Folder',async ()=> {
        const {result} = renderHook(() =>
            useItemcreationViewModel(addItem, setCurItem, curParent, cancelItemCreation));
        act(() => {
            result.current.setTitle("Uni")
            result.current.setTypeOfItem("folder");
        })
        result.current.handleConfirm();
        await waitFor(() => {
            expect(addItem).toHaveBeenCalledTimes(1);
            expect(setCurItem).toHaveBeenCalledTimes(0);
        })
    });

    it('should not create a new Item when the item Type is wrong',async ()=> {
        const {result} = renderHook(() =>
            useItemcreationViewModel(addItem, setCurItem, curParent, cancelItemCreation));
        act(() => {
            result.current.setTypeOfItem("wederNoch");
        })
        result.current.handleConfirm();
        await waitFor(() => {
            expect(addItem).toHaveBeenCalledTimes(0);
        })
    })
})